import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './gcipAuth';
import { usePathname } from 'expo-router';


export async function updateSaveStatus(): Promise<void> {
    await updateDoc(doc(db, "Users-AppData", auth.currentUser!.uid), {
        saveStatus: usePathname()
    });
    return;
}

export async function getSaveStatus(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.saveStatus;
}