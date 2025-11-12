import 'dotenv/config';

export default{
  expo: {
    scheme: "digitalsteadi",
    name: "STEADI",
    slug: "STEADI",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.katelynsoups.STEADI"
    },
    web: {
    },
    extra: {
      eas: {
        projectId: "ff395ef2-c855-4583-973a-c0e11cbccfa5"
      },
      apiKey: process.env.API_KEY,
    },
    plugins: [
      [
        "expo-video",
        {
          supportsBackgroundPlayback: false,
          supportsPictureInPicture: false
        }
      ]
    ]
  }
}
