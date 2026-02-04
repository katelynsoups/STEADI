import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './gcipAuth';

async function getPID(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.participantID;
};

export async function enterBP(standing: string, lying: string): Promise<void> {
    const pid = await getPID();
    await updateDoc(doc(db, "Users-StudyData", pid), {
        bloodPressure: {
            standingBP: standing,
            lyingBP: lying
        }
    });
    return;
};

export async function enterVitaminD(vitamin: string): Promise<void> {
    const pid = await getPID();
    await updateDoc(doc(db, "Users-StudyData", pid), {
        VitaminD: vitamin
    });
    return;
};

export async function enterHazards(hazards: Map<string, boolean>): Promise<void> {
    const pid = await getPID();
    await setDoc(doc(db, "Users-StudyData", pid), {
        homeHazards: Object.fromEntries(hazards)
    }, { merge: true });
    return;
};