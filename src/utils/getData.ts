import { doc, getDoc, getDocs, query, collection, type FirestoreDataConverter, type DocumentData} from 'firebase/firestore';
import { db, auth } from './gcipAuth';
import {getActiveSessionId} from '../utils/dataEntry';

export interface BloodPressure
{
    standingBP: string,
    lyingBP: string
}

export interface Assessment
{
    id : string,
    sessionNumber : string,
    date : string
}

async function getPID(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.participantID;
};


export async function getUserStudyData(id : string): 
Promise<[
    BloodPressure | null, 
    Object | null, 
    Object | null, 
    Object | null,
    string | null,
    string | null,
    Object | null,
    string | null,
    Object | null,
    number | null,
    number | null] 
    | null>
{
    const pid = await getPID();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid, "assessments", id));

    if(!docSnap.exists()) return null;

    const userData = docSnap.data();
    const bloodPressure = docSnap.data()?.bloodPressure as BloodPressure;
    const medications = docSnap.data()?.medications as Object;
    const hazards = docSnap.data()?.homeHazards as Object;
    const footNeuropathyTest = docSnap.data()?.footNeuropathyTest as Object;
    const depression = docSnap.data()?.mood?.depression as string;
    const lackPleasure = docSnap.data()?.mood?.lackPleasure as string;
    const screening = docSnap.data()?.screening as Object;
    const vitaminD = docSnap.data()?.VitaminD as string;
    const tugTests = docSnap.data()?.tugTest?.tug_tests as Object;
    const visionLeft = docSnap.data()?.vision?.left?.matched as number;
    const visionRight = docSnap.data()?.vision?.right?.matched as number;
    return [bloodPressure, medications, hazards, footNeuropathyTest, depression, lackPleasure, screening, vitaminD, tugTests, visionLeft, visionRight];
}

export async function getCompletedAssessments():Promise<Assessment[]>
{
    const assessments : Assessment[] = []

    const pid = await getPID();
    const docSnap = await getDocs(collection(db, "Users-StudyData", pid, "assessments"));
 
    docSnap.forEach((doc) =>
    {
        if (doc.data()?.completedAt != null && typeof doc.data()?.tugTest != "undefined" && doc.data()?.tugTest?.status as string == "completed")
        {
            assessments.push({id: doc.id as string, sessionNumber:doc.data()?.sessionNumber as string, date: doc.data()?.startedAt.toDate().toDateString() as string })
            console.log(doc.id, " = >", "assessment ", doc.data()?.sessionNumber)
        }
    })

    return assessments as Assessment[];
}

export async function getScreeningData(): Promise<Object | null>
{
    const pid = await getPID();
    const id = await getActiveSessionId();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid, "assessments", id));

    if(docSnap.exists() && docSnap.data()?.screening != "undefined")
        return docSnap.data()?.screening as Object;

    return null;
}

export async function getBloodPressure(): Promise<BloodPressure | null>
{
    const pid = await getPID();
    const id = await getActiveSessionId();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid, "assessments", id));

    if(docSnap.exists() && docSnap.data()?.bloodPressure != "undefined")
        return docSnap.data()?.bloodPressure as BloodPressure;

    return null;
}

export async function getHazards(): Promise<Object | null>
{
    const pid = await getPID();
    const id = await getActiveSessionId();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid, "assessments", id));

    if(docSnap.exists() && docSnap.data()?.homeHazards != "undefined")
        return docSnap.data()?.homeHazards as Object;

    return null;
}

export async function getFoot(): Promise<Object | null>
{
    const pid = await getPID();
    const id = await getActiveSessionId();
    const docSnap = await getDoc(doc(db, "Users-StudyData", pid, "assessments", id));

    if(docSnap.exists() && docSnap.data()?.footNeuropathyTest != "undefined")
        return docSnap.data()?.footNeuropathyTest as Object;

    return null;
}