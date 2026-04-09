import { doc, getDoc, setDoc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from './gcipAuth';

export async function getPID(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    return (await getDoc(docRef)).data()?.participantID;
};

//logic for multiple assessment sessions
export async function startNewSession(): Promise<string> {
    const pid = await getPID();

    const userDataRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    const userData = (await getDoc(userDataRef)).data();
    const nextSessionNumber = (userData?.totalSessions ?? 0) + 1;
    const sessionId = `assessment${nextSessionNumber}`;

    await setDoc(doc(db, "Users-StudyData", pid, "assessments", sessionId), {
        sessionNumber: nextSessionNumber,
        startedAt: Timestamp.now(),
        completedAt: null,
    });

    await updateDoc(userDataRef, {
        activeSessionId: sessionId,
        totalSessions: nextSessionNumber,
    });

    return sessionId;
}

//get active session id for paused assessment
export async function getActiveSessionId(): Promise<string> {
    const docRef = doc(db, "Users-AppData", auth.currentUser!.uid);
    const sessionId = (await getDoc(docRef)).data()?.activeSessionId;
    if (!sessionId) throw new Error("No active session found. Call startNewSession() first.");
    return sessionId;
}

//update timestamp when a user completes the assessment
export async function completeSession(): Promise<void> {
    const pid = await getPID();
    const sessionId = await getActiveSessionId();

    await updateDoc(
        doc(db, "Users-StudyData", pid, "assessments", sessionId),
        { completedAt: Timestamp.now() }
    );

    // Clear the active session ID so it can't be accidentally written to
    await updateDoc(doc(db, "Users-AppData", auth.currentUser!.uid), {
        activeSessionId: null,
    });
}

//helper to get a reference to the active session document
async function getActiveSessionRef() {
    const pid = await getPID();
    const sessionId = await getActiveSessionId();
    return doc(db, "Users-StudyData", pid, "assessments", sessionId);
}

export async function enterBP(standing: string, lying: string): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await updateDoc(sessionRef, {
        bloodPressure: {
            standingBP: standing,
            lyingBP: lying
        }
    });
    return;
};

export async function enterVitaminD(vitamin: string): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        VitaminD: vitamin
    }, { merge: true });
};

export async function enterHazards(hazards: Map<string, boolean>): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        homeHazards: Object.fromEntries(hazards)
    }, { merge: true });
    return;
};

export async function enterFootTest(footTest: Map<number, boolean>): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        footNeuropathyTest: Object.fromEntries(footTest)
    },{ merge: true });
    return;
}

export async function enterMedication(medications: Map<string, boolean>): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        medications: Object.fromEntries(medications)
    }, { merge: true });
    return;
};

export async function enterVisionTest(transcription: string): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        visionTranscription: transcription
    }, { merge: true });
    return;
};

export async function enterMood(pleasure: string, depress: string): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await updateDoc(sessionRef, {
        mood: {
            lackPleasure: pleasure,
            depression: depress
        }
    });
    return;
};

export async function enterScreeningResponse(questionId: string, answer: string): Promise<void> {
    const sessionRef = await getActiveSessionRef();
    await setDoc(sessionRef, {
        screening: {
            [questionId]: answer
        }
    }, { merge: true });
}