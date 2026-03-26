import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './gcipAuth';
//import { usePathname } from 'expo-router';

//will now require routes to be specified on each call - required for the conditional screens
export async function updateSaveStatus(route: string): Promise<void> {
    await updateDoc(doc(db, "Users-AppData", auth.currentUser!.uid), {
        saveStatus: route
    });
}

export async function getSaveStatus(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.saveStatus;
}