# Digital STEADI

A mobile application digitizing the CDC STEADI fall-risk framework for older adults. This is a UCF Computer Science Senior Design project built in partnership with the UCF Healthy Aging Lab.

[![Demo Video](https://img.shields.io/badge/Watch%20Demo-YouTube-red?logo=youtube)](https://www.youtube.com/watch?v=4m2G0pMqjnY)
[![GitHub](https://img.shields.io/badge/GitHub-katelynsoups%2FSTEADI-black?logo=github)](https://github.com/katelynsoups/STEADI)

---

## 🎬 Demo

[![Digital STEADI Demo](https://img.youtube.com/vi/4m2G0pMqjnY/maxresdefault.jpg)](https://www.youtube.com/watch?v=4m2G0pMqjnY)

---

## 📚 Background

**Problem Statement**

Falls are the leading cause of injury and injury-related deaths in older adults in the United States. The CDC developed an evidence-based framework to combat this issue — **Stopping Elderly Accidents, Deaths, and Injuries ([STEADI](https://www.cdc.gov/steadi/index.html))** — but many older adults in underserved communities lack access to or awareness of this resource.

The [UCF Healthy Aging Lab](https://nursing.ucf.edu/research-faculty/research-areas/healthy-aging-lab/) has been researching modifiable fall-risk factors in older adults using the STEADI framework. Their first round of testing revealed significant difficulties with the paper-based process and participant understanding.

**Solution**

Digital STEADI is an accessible, intuitive mobile application that digitizes the STEADI framework, data collection, and fall-risk analysis. Its first purpose is to support the UCF Healthy Aging Lab's research — with the long-term goal of scaling to the general public as a fall-prevention resource.

**Sponsor:** UCF Healthy Aging Lab

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) or a physical Android/iOS device
- JDK 17
- Gradle

---

## 🚀 Getting Started

### 1. Fork & Clone the Repository

Navigate to the [original repo](https://github.com/katelynsoups/STEADI) and fork it to your own account or a UCF Enterprise org.

```bash
git clone https://github.com/<your-org>/STEADI.git
cd STEADI
```

Add the original repo as an upstream remote to pull in future updates:

```bash
git remote add upstream https://github.com/katelynsoups/STEADI.git
git remote -v
```

To pull changes from the original repo later:

```bash
git fetch upstream
git merge upstream/main
```

### 2. Install Dependencies

From the project root, install all dependencies:

```bash
npm install --legacy-peer-deps
```

> ⚠️ **Note:** We are using --legacy-peer-deps` due to an out-of-sync React DOM version. Additionally, by the time this project is inherited, many tools may be outdated — get a local build and EAS build working with the legacy tools *before* attempting to update package versions.

---

## 📲 Running the App

### Expo Go (Fastest, Development Preview)

Install [Expo Go](https://expo.dev/client) on your Android or iOS device, then run:

```bash
npx expo start
```

Scan the QR code with Expo Go to launch the app. Hot reloading is enabled by default.

> ⚠️ Expo Go runs a sandboxed version of the app and does not support all native modules.

### Local Dev Build (Recommended for Most Development)

Faster than an EAS build, but does not produce a downloadable file:

```bash
npx expo run:android
```

### EAS Builds (For Testing & Distribution)

Install the EAS CLI:

```bash
npm install -g eas-cli
```

Log in to your Expo account:

```bash
eas login
```

Configure the build (first time only):

```bash
eas build:configure
```

**Preview build** (standalone `.apk`, recommended for demos):

```bash
eas build --profile preview --platform android
```

**Development build** (for native feature testing):

```bash
eas build --profile development --platform android
```

**Production build** (for app store submission, `.aab`):

```bash
eas build --profile production --platform android
```

EAS builds run in the cloud and typically take 10–20 minutes. View build status and download links at [expo.dev](https://expo.dev).

#### iOS Builds

An Apple developer account from the lab is available for iOS builds. You must register your test device via EAS — device registration can take up to 72 hours.

---

## ☁️ Google Cloud Environment

Access to the Google Cloud environment is managed by UCF Cybersecurity.

The cloud environment handles:
- **Async processing** (especially where secrets are involved)
- **Service accounts** for the workstation
- **Temporary storage** for user-uploaded videos
- **Firebase** (under the same Google project) — where study data lives for researcher access

> ⚠️ The current environment is for **development only**. Before moving to production or public use, create separate environments.

### Cloud Functions

Functions are managed via [Cloud Run > Services](https://console.cloud.google.com/) in the Google Cloud Console. Use the Google Cloud CLI to edit and deploy. Each function lives in its own folder with its own `npm` initialization.

| Function | Purpose |
|---|---|
| `getvideouploadurl` | Gait analysis pipeline — generates signed upload URLs |
| `call-vision` | Medication screening — calls Google Vision API to extract text from medication images |
| `vision-server` | Vision exam — transcribes audio via Google Speech-to-Text |
| `orchestrator` | Event-based trigger example (kept for reference) |
| `pdf-gen` | PDF generation example (kept for reference) |

**Logs:** Use [Logs Explorer](https://console.cloud.google.com/logs) in the Cloud Console to trace function execution and debug errors.

**Permissions:** Each function uses its own service account with only the permissions required for that task.

---

## 🖥️ Workstation (Gait Analysis)

A remote lab workstation handles gait analysis processing using **MMPose** and **MotionBERT**. Acess to the Workstation is protected, if you are inheriting this project you will need documentation from your sponsor in order to make changes on the workstation.

```
Mobile Device → Cloud Function (getVideoUploadURL) → GCS Bucket
                                                          ↓
                                                   Workstation (Cron Job)
                                                          ↓
                                              tug_pipeline.py → Firestore DB
```

## 🔭 Vision Test

The vision assessment uses [`expo-video-audio-extractor`](https://github.com/) to convert the user's `.mp4` recording into a `.wav` audio file, which is then sent to the Google Speech-to-Text API. Install via Node.js per the package's GitHub instructions.

> This was chosen as a simpler alternative to `ffmpeg` for a student project context.

---

## 🔮 Future Direction

### Planned Features

- Push notifications when a report is ready
- Confirm which eye is being tested during the vision exam
- Medication screening follow-up for users on the same medications year over year
- "Resume assessment" modal on login if an assessment is in progress
- Bluetooth blood pressure device integration
- Spatial metrics from gait analysis
- Embedded PDF viewer in-app (not just downloadable)
- Gait recording embedded in-app with real-time framing feedback
- Handling person identification if someone walks through during gait recording
- Expanding depression screening
- Adapting to user font size settings
- Add help feature to navigation menu
- Community center implementation mode

### Asynchronicity

Currently, the app awaits each processing response before continuing. For scale or cases where real-time feedback is less critical, consider switching to event-based GCP triggers and expanding the `orchestrator` function to manage the pipeline asynchronously, or implement a [Google Workflow](https://cloud.google.com/workflows).

> ⚠️ Any additional data sent to the cloud for background processing must be evaluated carefully against HIPAA requirements — use protected buckets and restricted TTLs.

### Translation

The first half of the app has been translated into Spanish. Finish the translation in `i18next/locales` and record Spanish versions of the instruction videos.

### Instruction Videos

Re-record all instruction videos: horizontal orientation, consistent quality.

### Stress Testing

Conduct user error testing at every feature before any public release.

---

## 📄 License

This project was developed as a UCF Senior Design project in partnership with the UCF Healthy Aging Lab. Please contact the project contacts above for licensing and usage questions.
