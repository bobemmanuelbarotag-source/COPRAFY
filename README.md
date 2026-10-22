# COPRAFY Kotlin Android prototype

This is an Android Studio project built from the 20 screens in **APP NI COPR.pdf** and the matching Canva PNGs. It preserves the original brown header, cream reading cards, logo, shared-load forms, list/calendar view, and bottom navigation. Screens are interactive code, not clickable screenshots.

## Open and run

1. Extract the ZIP. Open the **COPRAFY-Android** folder in Android Studio, selecting the folder that contains `settings.gradle.kts`.
2. Allow Gradle sync to finish. Install **Android SDK Platform 35** and **Build Tools 34.0.0** if Android Studio asks.
3. Keep Android Studio’s bundled Gradle JDK selected. The included project settings use **GRADLE_LOCAL_JAVA_HOME**, which defaults to Android Studio’s embedded runtime. JDK 17 and JDK 21 are supported; you do not need a separate JDK 17 installation when the embedded runtime is JDK 21.
4. Select an emulator or a USB-debugging-enabled phone and click **Run**.

The minimum supported Android version is **Android 8.0 / API 26**, with an updated Android System WebView. There are no API keys, server accounts, paid services, or external UI-library dependencies (the Kotlin standard library is included by the Kotlin plugin). Internet is needed for the first Gradle/SDK setup; the installed app works offline.

Choose a role on the first screen. The login fields are prefilled:

| Role | Demo email | Password |
| --- | --- | --- |
| Cooperative Head / Operations Manager | head@coprafy.demo | demo1234 |
| PCA Personnel | pca@coprafy.demo | demo1234 |

These are demonstration credentials, not real authentication. Log out to switch roles; both roles see the same locally stored demonstration records.

## Kotlin and JVM setup

The native Android code and Gradle build scripts now use **Kotlin**. The bundled screen interface remains HTML/CSS/JavaScript inside the offline WebView.

| Setting | Pinned value |
| --- | --- |
| Android Gradle plugin | 8.7.2 |
| Kotlin Android plugin | 2.1.21 |
| Gradle wrapper | 8.9 |
| Java source and bytecode compatibility | 17 |
| Kotlin JVM bytecode target | 17 |
| Gradle runtime | Android Studio embedded JDK 17 or 21 |

Both compilation targets are explicitly **17**. Running Gradle on JDK 21 does not change Kotlin’s target to 21, so it does not produce an “Inconsistent JVM-target compatibility” error against Java’s target 17. The Java compatibility settings are still needed in a Kotlin project because Android’s build system includes Java compilation tasks.

There is no `org.gradle.java.home`, no hard-coded JDK/SDK path, and no `jvmToolchain(17)` that requires downloading another JDK. The ZIP includes only portable Android Studio Gradle settings; Android Studio creates its own SDK path configuration.

**Use a fresh extraction of this ZIP.** Open it as an existing project; do not paste it into a newly generated project with different Gradle plugins. The old `.java` and Groovy `.gradle` files have been replaced by `.kt` and `.gradle.kts` files.

If an existing Android Studio setting still selects an older Java runtime, open **Settings → Build, Execution, Deployment → Build Tools → Gradle** and select **GRADLE_LOCAL_JAVA_HOME** or the bundled **jbr** entry with version 17 or 21, then sync. A first sync still downloads the SDK and Gradle dependencies. Android Studio **Ladybug 2024.2.1 or newer** supports this Android Gradle plugin.

Build from Android Studio’s Run button to use its selected runtime. A terminal build instead uses `JAVA_HOME` or Java on your PATH.

References: [Android JDK configuration](https://developer.android.com/build/jdks), [Kotlin plugin compatibility and JVM targets](https://kotlinlang.org/docs/gradle-configure-project.html), [Android Gradle plugin 8.7 compatibility](https://developer.android.com/build/releases/agp-8-7-0-release-notes).

## Working features

- **Head:** schedule registered members; log/edit shared loads; add farmer-lots; assign/reassign an operator; inspect readings and alerts; record measured samples; record confirmed unloading completion.
- **PCA:** register/edit farmer-members; mark registrations active/inactive; search members; review operational records; filter by date and generate/save/open an actual PDF report.
- **Shared:** dashboard, list/calendar, session details, lot ownership, quantities, tray allocation, progress, history, and in-app notices.
- Tray entries accept ranges (`1-2`) or lists (`1, 3, 5`). Overlapping trays and duplicate members within a load are rejected. Lot assignments lock when drying starts.
- Records persist after closing/reopening. Use **Profile → Reset demo records** to restore the initial examples.

## Demo walkthrough

1. Open the Head role. A simulated drying session, **S0231**, is already active.
2. Open **Profile → Demo scenarios**. All controls on this screen simulate events from the local machine; they are not proposed remote controls.
3. Try **Door-open fault**. Inspect monitoring and alerts. Marking a notice read does not silence the machine or clear the fault.
4. Return to Demo scenarios. Choose **Clear fault locally**, followed by **Local heating restart**. Clearing a fault alone does not restart heating.
5. Try **Monitor offline**. The last readings become stale; sample acceptance and completion are blocked. Choose **Reconnect monitor**.
6. Choose **Reach endpoint** to simulate entering cooldown. The machine is still not ready to unload.
7. Open monitoring and record a sample result for each farmer-lot. Enter values at or below the proposed 6% acceptance target. Try a value above 6% to see the failed-sample state.
8. Choose **Confirm cooldown** in Demo scenarios. Once local clearance and every lot’s sample acceptance are recorded, the session becomes **Ready to unload**.
9. In monitoring, select **Record unloading completion** and confirm that the operator reported supervised unloading. This closes the record; it does not operate the dryer.
10. Switch to PCA. Open **Reports**, choose a period, select **Generate and save PDF**, choose a destination, then **Open PDF**. A PDF viewer must be installed to open the saved file.

To demonstrate a new session, log a scheduled shared load first. Demo **Begin loading** rejects a second active session while the single chamber is occupied. Then simulate **Local startup**.

## Changes from the Canva mockups

| Canva detail | Implemented correction |
| --- | --- |
| Chambers A and B | One shared chamber |
| “Operations Manager” as a separate account label | Cooperative Head / Operations Manager is one role |
| Operations Manager report screen | PDF generation belongs to PCA Personnel |
| App “Start Drying” button | Local-control event in the explicitly marked demonstration tools |
| Loading → Drying → Completed | Loading → Drying → Cooldown → Ready to unload → Completed |
| Completed card still showing 9.2% | Measured samples, chamber estimates, and readiness are separate |
| Moisture / Temp / Humidity without context | Estimated copra moisture / chamber air temperature / chamber air humidity |
| No stale-data or fault workflow | Explicit stale/offline, door, sensor, airflow, fault-clearance, and restart scenarios |
| Farmer counts and lot labels disagree | Counts are calculated from the saved records |
| Permanent completion by one confirmation | Sample acceptance, local cooldown clearance, and operator unloading confirmation required |

The status tower and 24 V sounder are represented through event messages: a brief cooldown tone, a distinct ready tone, and a repeating fault alarm. The app itself has in-app notices only. It does not promise background phone notifications, control the sounder, or acknowledge local alarms.

## Implementation and limits

The project uses a **Kotlin Android Activity** and an **offline HTML/CSS/JavaScript interface bundled inside an Android WebView**. Native Android code handles the document picker and PDF saving/opening. This produces a real installable Android app while keeping the Canva layout easy to edit.

The interface lives in `app/src/main/assets/`. `model.js` contains the record and workflow rules; `app.js` contains screens and interactions; `styles.css` contains the visual styling. The native wrapper is `app/src/main/java/ph/edu/coprafy/MainActivity.kt`.

All readings, machine responses, alarm events, cooldown clearance, and sample data used for demonstrations are simulated. There is no PLC/ESP32 connection, shared server, account security, background push service, or physical machine control. Local data does not synchronize between phones. Device storage can be cleared by uninstalling or clearing app data.

The proposed 6% sample target comes from the project context. The illustrative 35°C cooldown reading is **not an approved unloading threshold**; the demo requires a separate local-clearance event. Engineering must define actual sampling, control, and safety conditions. The CFIDP facility context does not establish COPRAFY approval or funding.

HELPERO’s source was not available in this workspace. This project therefore does not reuse or overwrite HELPERO files.

## Checks

Run the record/workflow checks with Node.js:

```sh
node --test tests/model.test.js
```

For interface checks, install Playwright separately (`npm install --no-save playwright` and `npx playwright install chromium`), then:

```sh
node tests/ui.test.cjs
```

The UI checks cover both roles, registration, booking, session creation, tray validation, faults, offline status, samples, readiness, completion, persistence, calendar, PDF download, and a narrow-screen layout.

Build from a terminal using `gradlew.bat assembleDebug` on Windows, or `./gradlew assembleDebug` on macOS/Linux. Android Studio creates its own `local.properties` for your SDK location.
