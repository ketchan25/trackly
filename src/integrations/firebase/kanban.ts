import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { errorHandler } from "../../firebase/lib/helpers";
import { firestoreDb } from "../../firebase/lib/firebase";
import { nanoid } from "nanoid";

interface TaskDatum {
    title?: string;
    category?: string;
    position?: number;
}

interface TaskData {
    category: string;
    data: TaskDatum;
}

interface UpdateTaskData {
    [key: string]: unknown;
}

interface InsertTaskAttachmentData {
    path: string,
    timestamp: string,
}

export const insertTask = async (data: TaskData): Promise<void> => {
    try {
        const document = doc(firestoreDb, "boards", "chan", "tasks", nanoid());
        const datum = await setDoc(document, data.data)

        return datum;
    } catch (e) {
        errorHandler(e, "firebase-insert-task")
    }
}

export const updateTask = async (id: string, data: UpdateTaskData): Promise<void> => {
    try {
        const document = doc(firestoreDb, "boards", "chan", "tasks", id);
        const datum = await updateDoc(document, data)

        return datum;
    } catch (e) {
        errorHandler(e, "firebase-update-task")
    }
}

export const storeTaskAttachment = async (taskId: string | null, data: InsertTaskAttachmentData): Promise<void> => {
    try {
        if (! taskId) {
            return;
        }

        const document = doc(firestoreDb, "boards", "chan", "tasks", taskId, "attachments", nanoid());
        const datum = await setDoc(document, data)

        return datum;
    } catch (e) {
        errorHandler(e, "firebase-insert-task-attachment")
    }
}

export const deleteTask = async (id: string) => {
    try {
        const docRef = doc(firestoreDb, "boards", "chan", "tasks", id);
        await deleteDoc(docRef);

        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error removing document: ", error);
    }
};