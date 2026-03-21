
import "./previewtask.scss";
import { useTaskStore } from "../../stores/useTaskStore"; 
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { firestoreDb } from "../../firebase/lib/firebase";
import AttachmentUpload from "../Kanban/AttachmentUpload";
import EditableHeader from "../../components/EditableHeader";

export const PreviewTask = () => {
    const isOpen = useTaskStore((state) => state.isOpen);
    const closePreview = useTaskStore((state) => state.closePreview);
    const taskId = useTaskStore((state) => state.taskId);
    const attachmentPaths = useTaskStore((state) => state.attachmentPaths);
    const [taskData, setTaskData] = useState<DocumentData | undefined>(undefined);
    const storeAttachmentPath = useTaskStore((state) => state.storeAttachmentPath);
    const clearAttachmentPaths = useTaskStore((state) => state.clearAttachmentPaths);

    useEffect(() => {
        if (!taskId) return; 

        const query = doc(firestoreDb, "boards", "chan", "tasks", taskId);

        const unsubscribe = onSnapshot(query, (querySnapshot) => setTaskData(querySnapshot.data()), (error) => {
            console.error("Error fetching boards: ", error);
        });
        
        return () => unsubscribe();
    }, [taskId]);

    useEffect(() => {
        if (!taskId) return; 

        clearAttachmentPaths();

        const query = collection(firestoreDb, "boards", "chan", "tasks", taskId, "attachments");

        const unsubscribe = onSnapshot(query, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const changeData = change.doc.data();
                    storeAttachmentPath(changeData.path);
                }
            })
        })

        return () => unsubscribe();
    }, [taskId])

    return (
        <>
            {isOpen
                &&
                <div className="preview-task">
                    <div className='preview-task-header'>
                        <div className="header-left">
                        </div>
                        <div className="header-center"></div>
                        <div className="header-right">
                            <button className="button-close" onClick={closePreview}>x</button>
                        </div>
                    </div>
                    <div className="preview-task-content-container">
                        <EditableHeader label={taskData?.title}></EditableHeader>
                        <div style={{ borderTop: "1px solid rgb(225, 224, 236)"}}>
                            <p>Attachments</p>
                            <AttachmentUpload/>
                            <div className="attachment-container">
                                {attachmentPaths.map((data) => (
                                    <div className="attachment-wrapper"><img className="attachments" src={data}></img></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
        
    );
}