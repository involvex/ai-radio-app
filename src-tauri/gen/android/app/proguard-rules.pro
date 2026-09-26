# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Keep Tauri WebView JS bridge + MediaPipe (WebView-side, defensive for R8 full mode).
-keepattributes SourceFile,LineNumberTable
-keep class com.google.mediapipe.** { *; }
-keep class androidx.webkit.** { *; }