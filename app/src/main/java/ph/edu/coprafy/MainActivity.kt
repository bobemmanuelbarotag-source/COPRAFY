package ph.edu.coprafy

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject

/** Offline Kotlin Android container for the COPRAFY HCI interface. */
@Suppress("DEPRECATION")
class MainActivity : Activity() {
    private var web: WebView? = null
    private var pendingReport: String? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        pendingReport = savedInstanceState?.getString("pendingReport")

        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.WHITE)
            setOnApplyWindowInsetsListener { view, insets ->
                view.setPadding(
                    insets.systemWindowInsetLeft, insets.systemWindowInsetTop,
                    insets.systemWindowInsetRight, insets.systemWindowInsetBottom
                )
                insets.consumeSystemWindowInsets()
            }
        }
        val browser = WebView(this)
        web = browser
        root.addView(
            browser, FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
        setContentView(root)
        root.requestApplyInsets()

        browser.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            databaseEnabled = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            builtInZoomControls = false
            displayZoomControls = false
            useWideViewPort = false
            loadWithOverviewMode = false
        }
        browser.webChromeClient = android.webkit.WebChromeClient()
        browser.setBackgroundColor(Color.WHITE)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        browser.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView, request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun shouldOverrideUrlLoading(
                view: WebView, request: WebResourceRequest
            ): Boolean {
                return false
            }
        }
        browser.addJavascriptInterface(ReportBridge(), "NativeCoprafy")
        browser.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    inner class ReportBridge {
        @Suppress("unused")
        @JavascriptInterface
        fun exportPdf(payload: String) {
            runOnUiThread {
                if (pendingReport != null) {
                    notifyWeb("Finish or cancel the current PDF save first.")
                    return@runOnUiThread
                }
                try {
                    require(payload.length <= 600_000) { "Report is too large." }
                    val data = JSONObject(payload)
                    val lines = data.getJSONArray("lines")
                    require(lines.length() in 1..3000) { "Report is empty or too large." }
                    val filename = data.optString("filename", "COPRAFY-Report.pdf")
                        .replace(Regex("[^a-zA-Z0-9._-]"), "_")
                    pendingReport = payload
                    val choose = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "application/pdf"
                        putExtra(Intent.EXTRA_TITLE, filename)
                    }
                    startActivityForResult(choose, SAVE_PDF)
                } catch (error: Exception) {
                    pendingReport = null
                    notifyWeb("Could not prepare PDF: ${error.message}")
                }
            }
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString("pendingReport", pendingReport)
        super.onSaveInstanceState(outState)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode != SAVE_PDF) return
        val payload = pendingReport
        pendingReport = null
        val uri = data?.data
        if (resultCode != RESULT_OK || uri == null) {
            notifyWeb("PDF save cancelled.")
            return
        }
        try {
            checkNotNull(payload) { "Report content is no longer available. Generate it again." }
            writeReport(uri, JSONObject(payload).getJSONArray("lines"))
            notifyWeb("PDF saved. You can open the file now.")
            AlertDialog.Builder(this)
                .setTitle("PDF saved")
                .setMessage("Your COPRAFY report contains simulated prototype records.")
                .setNegativeButton("Done", null)
                .setPositiveButton("Open PDF") { _, _ ->
                    val open = Intent(Intent.ACTION_VIEW).apply {
                        setDataAndType(uri, "application/pdf")
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    try {
                        startActivity(open)
                    } catch (_: ActivityNotFoundException) {
                        Toast.makeText(
                            this, "Open the saved file using a PDF reader.", Toast.LENGTH_LONG
                        ).show()
                    }
                }.show()
        } catch (error: Exception) {
            notifyWeb("PDF save failed: ${error.message}")
        }
    }

    private fun writeReport(uri: Uri, source: JSONArray) {
        val text = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(48, 40, 34)
            textSize = 10f
            typeface = Typeface.create(Typeface.MONOSPACE, Typeface.NORMAL)
        }
        val lines = mutableListOf<String>()
        for (index in 0 until source.length()) {
            var remaining = source.getString(index).replace('\n', ' ').replace('\r', ' ')
            require(remaining.length <= 5000) { "A report line is too long." }
            while (text.measureText(remaining) > 507f) {
                val max = text.breakText(remaining, true, 507f, null)
                val space = remaining.lastIndexOf(' ', max)
                val end = if (space > 0) space else max.coerceAtLeast(1)
                lines.add(remaining.substring(0, end))
                remaining = remaining.substring(end).trim()
            }
            lines.add(remaining)
        }
        val document = PdfDocument()
        try {
            val pageCount = ((lines.size + 48) / 49).coerceAtLeast(1)
            for (pageNo in 0 until pageCount) {
                val page = document.startPage(
                    PdfDocument.PageInfo.Builder(595, 842, pageNo + 1).create()
                )
                val canvas = page.canvas
                var y = 47f
                for (index in pageNo * 49 until minOf(lines.size, (pageNo + 1) * 49)) {
                    canvas.drawText(lines[index], 44f, y, text)
                    y += 14.5f
                }
                val footer = Paint(text).apply { textSize = 9f; color = Color.GRAY }
                canvas.drawText(
                    "COPRAFY HCI prototype - simulated data | Page ${pageNo + 1} / $pageCount",
                    44f, 814f, footer
                )
                document.finishPage(page)
            }
            val output = contentResolver.openOutputStream(uri, "w")
                ?: error("Could not open the selected destination.")
            output.use { document.writeTo(it) }
        } finally {
            document.close()
        }
    }

    private fun notifyWeb(message: String) {
        web?.evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('coprafy-export'," +
                    "{detail:{message:${JSONObject.quote(message)}}}));", null
        )
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        web?.evaluateJavascript("window.Coprafy ? window.Coprafy.back() : false") { handled ->
            if (handled != "true") finish()
        } ?: finish()
    }

    override fun onDestroy() {
        web?.apply {
            removeJavascriptInterface("NativeCoprafy")
            destroy()
        }
        web = null
        super.onDestroy()
    }

    private companion object {
        const val SAVE_PDF = 41
    }
}
