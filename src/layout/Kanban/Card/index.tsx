import { useSortable } from '@dnd-kit/react/sortable';
import { useTaskStore } from '../../../stores/useTaskStore'; 
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestoreDb } from '../../../firebase/lib/firebase';

interface CardProps {
    data: { id: string; title: string };
    index: number;
    column: string;
}

export const Card = ({data, index, column}: CardProps) => {
    const openPreview = useTaskStore((state) => state.openPreview);
    const [latestAttachment, setLatestAttachment] = useState("");

    const {ref, isDragging} = useSortable({
        id: data.id,
        index,
        type: 'item',
        accept: 'item',
        group: column
    }); 

     const handleClick = () => {
        openPreview(data.id);
    };

    useEffect(() => {
        const q = query(collection(firestoreDb, "boards", "chan", "tasks", data.id, "attachments"), orderBy("timestamp", "desc"), limit(1));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((data) => {
                setLatestAttachment(data.data().path);
            })
        })

        return () => unsubscribe();
    }, [data.id])

  return (
    <div className="card" ref={ref} data-dragging={isDragging} onClick={handleClick}>
        {latestAttachment && (<div className='attachment-wrapper'><img className="attachments" src={latestAttachment}></img></div>)}
        <div className='task'>
            <span className='task-title'>{data.title}</span>
        </div>
        
    </div>
  );
}