import {onCall, HttpsError} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {Storage} from "@google-cloud/storage";

initializeApp();

const storage = new Storage();
const BUCKET_NAME = "walking-test-video-uploads";
const SERVICE_ACCOUNT = [
  "cloud-function-video-uploader",
  "@research-digital-steadi-dev.iam.gserviceaccount.com",
].join("");

export const getVideoUploadUrl = onCall(
  {serviceAccount: SERVICE_ACCOUNT},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be signed in.");
    }

    const participantID = request.data.participantID;
    if (!participantID || typeof participantID !== "string") {
      throw new HttpsError("invalid-argument", "participantID is required.");
    }

    const uid = request.auth.uid;
    const timestamp = Date.now();
    const fileName = `${uid}/${participantID}_${timestamp}.mp4`;

    const [signedUrl] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: timestamp + 15 * 60 * 1000,
        contentType: "video/mp4",
      });

    return {signedUrl, fileName};
  }
);
