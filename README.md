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
- A [Google Cloud](https://console.cloud.google.com) account with the **Cloud Speech-to-Text API** enabled and an API key
- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) — required to authenticate and initialize your Google Cloud project locally

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

## ☁️ Google Cloud CLI Setup

The speech server requires your Google Cloud project to be initialized locally. Follow the steps from the [Google Cloud Speech-to-Text quickstart documentation](https://docs.cloud.google.com/speech-to-text/docs/v1/transcribe-client-libraries?authuser=1#client-libraries-usage-nodejs).

### 1. Install the Google Cloud CLI

Download and install the CLI for your OS from the [official install guide](https://cloud.google.com/sdk/docs/install).

After installation, verify it works:

```bash
gcloud --version
```

### 2. Initialize the CLI

Run the following command and follow the prompts to log in and select your Google Cloud project:

```bash
gcloud init
```

This will ask you to:
- Sign in to your Google account
- Select or create a Google Cloud project
- Set a default region (optional)

### 3. Set up application default credentials

This allows the local server to authenticate with Google Cloud:

```bash
gcloud auth application-default login
```

A browser window will open asking you to sign in. Once complete, credentials are saved locally and the server will use them automatically.

> Make sure the project you selected in `gcloud init` has the **Cloud Speech-to-Text API** enabled. You can verify at [console.cloud.google.com](https://console.cloud.google.com) under **APIs & Services → Enabled APIs**.

---

## 🎙️ Speech-to-Text Server Setup

The app uses a local Node.js server to communicate with the Google Cloud Speech-to-Text API. You must have this server running whenever you test audio transcription.

### 1. Navigate to the server folder

```bash
cd speech-server
```

### 2. Install server dependencies

```bash
npm install
```

### 3. Add your API key

Open `speech-server/server.js` and replace the placeholder with your Google Cloud API key:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

### 4. Find your local IP address

The Android emulator cannot reach `localhost` — you must use your machine's local network IP.

```bash
# Mac/Linux
ipconfig getifaddr en0

# Windows
ipconfig | findstr IPv4
```

### 5. Update the IP in the Expo app

Open `src/utils/transcribeAudio.ts` and update the server URL with your local IP:

```typescript
const SERVER_URL = 'http://YOUR_LOCAL_IP:3000/transcribe';
// e.g. http://192.168.1.42:3000/transcribe
```

### 6. Start the server

```bash
node server.js
```

You should see:

```
Server running on port 3000
```

Keep this terminal open while testing. The server must be running for transcription to work.

---

## ▶️ Running the App

With your Android emulator open and the speech server running, start the Expo dev server:

```bash
npx expo start
```

Then press `a` to open on the Android emulator.
