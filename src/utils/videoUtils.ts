import {ref, getDownloadURL} from "firebase/storage";
import {doc, getDoc} from "firebase/firestore";
import{ storage, db, auth} from "./gcipAuth";

export interface VideoMeta {
    title:string;
    storagePath: string;
}

export async function getVideoURL(screenId: string): Promise<string | null> {
    console.log('Current user:', auth.currentUser);

    const snap = await getDoc(doc(db, 'video-metadata', screenId));
    console.log('Firestore fetch done');

    if (!snap.exists()) return null;
    const { storagePath } = snap.data();
    console.log('Storage path from Firestore:', storagePath);
    
    try {
        const url = await getDownloadURL(ref(storage, storagePath));
        console.log('Storage fetch done, url:', url);
        return url;
    } catch (e) {
        console.log('Storage error:', e);
        return null;
    }
}