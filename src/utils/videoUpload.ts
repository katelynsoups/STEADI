import {httpsCallable} from "firebase/functions";
import {functions} from "./gcipAuth";
import {getPID} from "./dataEntry";
import * as FileSystem from "expo-file-system/legacy";

interface UploadUrlResponse {
  signedUrl: string;
  fileName: string;
}

export async function uploadTugVideo(
  videoUri: string,
  onProgress?: (percentage: number) => void
): Promise<string> {
  const participantID = await getPID();
  if (!participantID) throw new Error("No participantID found for current user.");

  const getUploadUrl = httpsCallable<{participantID: string}, UploadUrlResponse>(
    functions,
    "getVideoUploadUrl"
  );
  const {data} = await getUploadUrl({participantID});
  const {signedUrl, fileName} = data;

  const uploadResult = await FileSystem.uploadAsync(signedUrl, videoUri, {
    httpMethod: "PUT",
    headers: {
      "Content-Type": "video/mp4",
    },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    sessionType: FileSystem.FileSystemSessionType.FOREGROUND, //possible fix to the reload issue during demo
  });

  if (uploadResult.status !== 200) {
    throw new Error(`Upload failed with status ${uploadResult.status}`);
  }

  return fileName;
}