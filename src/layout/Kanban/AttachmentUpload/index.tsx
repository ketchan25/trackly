// src/FileUpload.js
import { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/lib/firebase';
import { storeTaskAttachment } from '../../../integrations/firebase/kanban';
import { useTaskStore } from '../../../stores/useTaskStore';
import "./attachmentupload.scss";

const AttachmentUpload = () => {
    const [progress, setProgress] = useState(0);
    const taskId = useTaskStore((state) => state.taskId);
    const [fileUploadCounter, setFileUploadCounter] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [currentUploadFilesLength, setCurrentUploadFilesLength] = useState(0);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const handleDrop = async (e: any) => {
        e.preventDefault();
        handleUploadAttachment(Array.from(e.dataTransfer.files));
    }

    const handleAttachmentSelection = async (e: any) => {
        e.preventDefault();
        handleUploadAttachment(Array.from(e.target.files));
    }

    const clearFileInput = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.value = '';
        }
    };

    const handleUploadAttachment = async (uploadAttachments: File[]): Promise<void> => {
        setCurrentUploadFilesLength(uploadAttachments.length);
        uploadAttachments.forEach(async (file: File) => {
            setUploading(true)
            setFileUploadCounter(fileUploadCounter + 1)

            const storageRef = ref(storage, `${taskId}/task-attachments/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )

                    setProgress(percent)
                },
                (error: Error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
                        storeTaskAttachment(taskId, { path: url, timestamp: (new Date()).toISOString() })

                        if (fileUploadCounter >= currentUploadFilesLength) {
                            setUploading(false)
                            setFileUploadCounter(0)
                            clearFileInput()
                        }
                    });
                }
            );
        })
    };

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    return (
        <>
            <div className="attachment-upload-container" onClick={handleClick} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <input ref={hiddenFileInput} type="file" style={{ display: "none" }} onChange={handleAttachmentSelection} multiple />
                {uploading ? <div>
                    {progress > 0 && uploading && <><progress value={progress} max="100" />{fileUploadCounter}/{currentUploadFilesLength}</>}
                </div> : <p>Drag and drop files here</p>}
            </div>
        </>
    );
};


export default AttachmentUpload;