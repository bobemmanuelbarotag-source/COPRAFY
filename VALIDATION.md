# Validation

Validated on 7 October 2026.

**Gradle `assembleDebug` and `lintDebug` both pass.** The final lint report contains no issues. The original Android 8.0 theme incompatibility was corrected by using an API 27 resource variant; Android 12 backup/transfer exclusions are explicit.

- Six automated record/workflow tests pass. They cover role access, tray allocation, single-chamber occupancy, record locking, sample/readiness rules, faults/offline status, and report content.
- The browser interface test passes for registration, booking, logging, both account roles, sample entry, cooldown, readiness, record completion, persistence after reopening, calendar navigation, PDF downloading, and 320px layouts.
- No JavaScript runtime errors were observed in the tested flow. Main screens were inspected visually.
- The Kotlin Activity compiles with Kotlin 2.1.21 against Android SDK Platform 35. The actual Gradle build produced an APK after Kotlin compilation, resource processing, dex compilation, and packaging. The supplied APK is that Gradle output, signed with the same development key as the earlier prototype. APK signature verification succeeds for v2 and v3, with package `ph.edu.coprafy`, version code 2, version `1.1-kotlin-prototype`, minimum API 26, and target API 35.
- Java source/bytecode compatibility and Kotlin JVM target are both explicitly 17. Compiled Activity class files have class version 61 (JVM 17). The Kotlin build completed without a JVM target mismatch.
- Portable Android Studio configuration selects `GRADLE_LOCAL_JAVA_HOME`; no machine-specific JDK path, SDK path, or separately required Java 17 toolchain is included. The project has no Java source files; the Gradle scripts use Kotlin DSL.
- All five bundled UI assets in the APK match the project source bytes.
- A generated report was opened with a PDF parser and checked for the session, farmer-lot names, quantities, tray assignments, and separate measured sample results.

The Android Studio project includes Gradle wrapper 8.9, Android Gradle plugin 8.7.2, Kotlin Android plugin 2.1.21, and standard SDK configuration. The Gradle build used JDK 17.0.2. Temporary local download routing was needed for this workspace’s network restrictions; it is not included in the project. Android Studio uses the normal official repositories and still needs internet for the initial Gradle/SDK downloads. JDK 21 is supported by the pinned Gradle version, but this validation run used JDK 17.

The APK has not been installed on a physical phone or Android emulator here. Native document-picker and PDF-viewer handoff should be checked on your device. This prototype does not validate actual dryer hardware, sensor accuracy, moisture performance, or physical safety.

The APK uses a development signing key. If Android Studio later reports a signing mismatch when installing its own build over this APK, uninstall the prototype APK first; this removes its local demo records.
