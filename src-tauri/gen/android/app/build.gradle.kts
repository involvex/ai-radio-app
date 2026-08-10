import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("rust")
}

val tauriProperties = Properties().apply {
    val propFile = file("tauri.properties")
    if (propFile.exists()) {
        propFile.inputStream().use { load(it) }
    }
}

val releaseStorePath = System.getenv("KEYSTORE_PATH")
    ?: run {
        val localProps = file("local.properties")
        if (localProps.exists()) {
            val props = Properties().apply { localProps.inputStream().use { load(it) } }
            props.getProperty("KEYSTORE_PATH")
        } else null
    }
val releaseStorePassword = System.getenv("KEYSTORE_PASSWORD")
    ?: run {
        val localProps = file("local.properties")
        if (localProps.exists()) {
            val props = Properties().apply { localProps.inputStream().use { load(it) } }
            props.getProperty("KEYSTORE_PASSWORD")
        } else null
    }
val releaseKeyAlias = System.getenv("KEY_ALIAS")
    ?: run {
        val localProps = file("local.properties")
        if (localProps.exists()) {
            val props = Properties().apply { localProps.inputStream().use { load(it) } }
            props.getProperty("KEY_ALIAS", "airadio")
        } else "airadio"
    }
val releaseKeyPassword = System.getenv("KEY_PASSWORD")
    ?: run {
        val localProps = file("local.properties")
        if (localProps.exists()) {
            val props = Properties().apply { localProps.inputStream().use { load(it) } }
            props.getProperty("KEY_PASSWORD")
        } else null
    }

android {
    compileSdk = 34
    namespace = "com.airoadio.desktop"

    defaultConfig {
        manifestPlaceholders["usesCleartextTraffic"] = "false"
        applicationId = "com.airoadio.desktop"
        minSdk = 24
        targetSdk = 34
        versionCode =
            tauriProperties.getProperty("tauri.android.versionCode", "1").toInt()
        versionName =
            tauriProperties.getProperty("tauri.android.versionName", "1.0")
        vectorDrawables { enabled = true }
    }

    signingConfigs {
        debug {
            storeFile = file(System.getProperty("user.home")).resolve(".android/debug.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
        release {
            storeFile = if (releaseStorePath != null) file(releaseStorePath) else file(System.getProperty("user.home")).resolve(".android/debug.keystore")
            storePassword = releaseStorePassword ?: "android"
            keyAlias = releaseKeyAlias ?: "androiddebugkey"
            keyPassword = releaseKeyPassword ?: "android"
        }
    }

    buildTypes {
        getByName("debug") {
            signingConfig = signingConfigs.getByName("debug")
            manifestPlaceholders["usesCleartextTraffic"] = "true"
            isDebuggable = true
            isJniDebuggable = true
            isMinifyEnabled = false
            packaging {
                jniLibs.keepDebugSymbols.add("*/arm64-v8a/*.so")
                jniLibs.keepDebugSymbols.add("*/armeabi-v7a/*.so")
                jniLibs.keepDebugSymbols.add("*/x86/*.so")
                jniLibs.keepDebugSymbols.add("*/x86_64/*.so")
            }
        }
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            proguardFiles(
                *fileTree(".") { include("**/*.pro") }
                    .plus(getDefaultProguardFile("proguard-android-optimize.txt"))
                    .toList().toTypedArray()
            )
        }
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        buildConfig = true
    }

}

rust {
    rootDirRel = "../../../"
}

dependencies {
    implementation("androidx.webkit:webkit:1.14.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("androidx.activity:activity-ktx:1.10.1")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.lifecycle:lifecycle-process:2.10.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.4")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.0")
}

apply(from = "tauri.build.gradle.kts")

tasks.matching { it.name.startsWith("rustBuild") }.configureEach {
    enabled = false
}