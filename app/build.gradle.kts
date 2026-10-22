import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ph.edu.coprafy"
    compileSdk = 35

    defaultConfig {
        applicationId = "ph.edu.coprafy"
        minSdk = 26
        targetSdk = 35
        versionCode = 2
        versionName = "1.1-kotlin-prototype"
    }

    // Keep this equal to Kotlin's target below, even when Gradle runs on JDK 21.
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}
