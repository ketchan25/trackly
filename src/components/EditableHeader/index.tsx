import { useState, useEffect, type BaseSyntheticEvent } from 'react';
import { updateTask } from '../../integrations/firebase/kanban';
import { useTaskStore } from '../../stores/useTaskStore';

const EditableHeader = ({ label }: {label: string}) => {
    const taskId = useTaskStore<string | null>((state) => state.taskId);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        setTitle(label);
    }, [label])

    const handleInputChange = (e: BaseSyntheticEvent) => {
        setTitle(e.target.value);
    };

    const handleOnBlur = (e: BaseSyntheticEvent) => {
        if (! taskId) return;

        setIsEditing(false)
        updateTask(taskId, {title: e.target.value})
    };

    return (
        <div>
            {isEditing ? (
                <textarea
                    value={title}
                    onChange={handleInputChange}
                    onBlur={handleOnBlur}
                    autoFocus
                    rows={1}
                    style={{ fontSize: '2rem', fontWeight: 'bold', width: '100%', resize: "none", wordWrap: "break-word" }}
                />
            ) : (
                <h1 onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
                    {title}
                </h1>
            )}
        </div>
    );
};

export default EditableHeader;