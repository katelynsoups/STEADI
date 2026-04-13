# STEADI (Expo Project)

This is a [Expo](https://expo.dev) project built with React Native. The goal of this README is to help you set up your development environment so you can run the app locally using a **local development build** on an Android emulator via Android Studio.

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (comes with `npx expo`)
- [Android Studio](https://developer.android.com/studio) with an Android emulator configured
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) — required for Gradle compatibility
- [Gradle](https://gradle.org/install/) — used to build the local development build

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/STEADI.git
cd STEADI
```

### 2. Install dependencies

```bash
npm install
npm install firebase --legacy-peer-deps
npm install @expo/vector-icons
```

### 3. Build the local development build

Make sure your Android emulator is open and running in Android Studio before running this command.

```bash
npx expo run:android
```

> This uses Gradle and JDK 17 to compile the native Android build. If you see Gradle errors, verify that `JAVA_HOME` points to your JDK 17 installation.
>
> To check: `java -version` should output `openjdk 17.x.x`

---

## ▶️ Running the App

With your Android emulator running, start the Expo dev server:

```bash
npx expo start
```

Then press `a` to open on the Android emulator.
