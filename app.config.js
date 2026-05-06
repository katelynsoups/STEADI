import 'dotenv/config';
import { withAppBuildGradle } from '@expo/config-plugins';

const withFixedBuildGradle = (config) => {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    
    config.modResults.contents = contents
      .replace(
        /reactNativeDir = new File\(\["node".*?'react-native\/package\.json'\].*?\)\.getParentFile\(\)\.getAbsoluteFile\(\)/,
        'reactNativeDir = new File(projectRoot, "node_modules/react-native")'
      )
      .replace(
        /hermesCommand = new File\(\["node".*?'react-native\/package\.json'\].*?\)\.getParentFile\(\)\.getAbsolutePath\(\) \+ "\/sdks\/hermesc\/%OS-BIN%\/hermesc"/,
        'hermesCommand = new File(projectRoot, "node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc").getAbsolutePath()'
      )
      .replace(
        /codegenDir = new File\(\["node".*?'@react-native\/codegen\/package\.json'.*?\].*?\)\.getParentFile\(\)\.getAbsoluteFile\(\)/,
        'codegenDir = new File(projectRoot, "node_modules/@react-native/codegen")'
      );
    
    return config;
  });
};

export default {
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
    web: {},
    extra: {
      eas: {
        projectId: "ff395ef2-c855-4583-973a-c0e11cbccfa5"
      },
      apiKey: process.env.API_KEY,
      visionApiKey: process.env.VISION_KEY,
    },
    plugins: [
      "expo-localization",
      "expo-font",
      "expo-router",
      [
        "expo-video",
        {
          supportsBackgroundPlayback: false,
          supportsPictureInPicture: false
        }
      ],
      withFixedBuildGradle
    ]
  }
};