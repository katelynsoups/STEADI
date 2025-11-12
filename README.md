# STEADI (Expo Project)

This is a basic [Expo](https://expo.dev) project built with React Native. The goal of this README is to help you set up your development environment so you can run the app locally using **Expo Go** (or an Android emulator via Android Studio).

---

## ✅ Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (comes with `npx expo`)

---

## 📦 Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/STEADI.git
   cd STEADI

2. Install Dependencies
    ```bash
    npm install
    npm install firebase --legacy-peer-deps 
    npm install dotenv

3. Secrets
    create .env file and get API key from google proj environment
    run this command to load in environment vars:
    ```bash
    npm install dotenv

4. Start the Expo Dev Server
    ```bash
    npx expo start
     or
    npx expo start --go

5. Choose how to run the app:
    I am currently running in GO mode (you can switch modes with s if you didnt include --go)
    Press a to open on Android Emulator (requires Android Studio emulator open and running)
