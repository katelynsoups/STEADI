import { doc, getDoc, type FirestoreDataConverter, type DocumentData} from 'firebase/firestore';
import { db, auth } from './gcipAuth';

export interface BloodPressure
{
    standingBP: string,
    lyingBP: string
}

async function getPID(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.participantID;
};


export async function getUserStudyData(): 
Promise<[
    BloodPressure | null, 
    Object | null, 
    Object | null, 
    Object | null,
    string | null,
    string | null] 
    | null>
{
    const pid = await getPID();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid));

    if(!docSnap.exists()) return null;

    const userData = docSnap.data();
    const bloodPressure = docSnap.data()?.bloodPressure as BloodPressure;
    const medications = docSnap.data()?.medications as Object;
    const hazards = docSnap.data()?.homeHazards as Object;
    const footNeuropathyTest = docSnap.data()?.footNeuropathyTest as Object;
    const depression = docSnap.data()?.mood?.depression as string;
    const lackPleasure = docSnap.data()?.mood?.lackPleasure as string;
    console.log("User Data: ", userData);
    return [bloodPressure, medications, hazards, footNeuropathyTest, depression, lackPleasure];
}