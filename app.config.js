import 'dotenv/config';
import { withAppBuildGradle } from '@expo/config-plugins';

const withFixedBuildGradle = (config) => {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Fix reactNativeDir
    contents = contents.replace(
      `reactNativeDir = new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()`,
      `reactNativeDir = new File(projectRoot, "node_modules/react-native")`
    );

    // Fix hermesCommand
    contents = contents.replace(
      `hermesCommand = new File(["node", "--print", "require.resolve('hermes-compiler/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsolutePath() + "/hermesc/%OS-BIN%/hermesc"`,
      `hermesCommand = new File(projectRoot, "node_modules/hermes-engine/hermesc/%OS-BIN%/hermesc").getAbsolutePath()`
    );

    // Fix cliFile
    contents = contents.replace(
      `cliFile = new File(["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim())`,
      `cliFile = new File(projectRoot, "node_modules/@expo/cli/build/bin/cli")`
    );

    // Fix codegenDir
    contents = contents.replace(
      `codegenDir = new File(["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile().getAbsoluteFile()`,
      `codegenDir = new File(projectRoot, "node_modules/@react-native/codegen")`
    );

    config.modResults.contents = contents;
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