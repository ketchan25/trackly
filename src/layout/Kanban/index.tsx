import { DragDropProvider } from "@dnd-kit/react";
import { useEffect, useState } from "react";
import { move } from '@dnd-kit/helpers';
import { Column } from "./Card/DragAndDrop/Column";
import './kanban.scss';
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDb } from "../../firebase/lib/firebase";
import { updateTask } from "../../integrations/firebase/kanban";

interface KanbanItems {
    [key: string]: {
        id: string;
        title: string;
        category: string;
        position: number;
    }[];
}

export const Kanban = () => {
    const [items, setItems] = useState<KanbanItems>({
        "in-progress": [],
        "to-do": [],
        "done": [],
    });

    const [columnOrder, setColumnOrder] = useState<string[]>(() => Object.keys(items));

    useEffect(() => {
        const q = query(collection(firestoreDb, "boards", "chan", "tasks"), orderBy('position', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                console.log(change.doc.data());
                if (change.type === "added") {
                    const changeData = change.doc.data();
                    const newData = { id: change.doc.id, ...changeData };

                    setItems((prevItems) => {
                        if (prevItems[changeData.category].some(item => item.id === newData.id)) {
                            return prevItems[changeData.category];
                        }

                        return { ...prevItems, [changeData.category]: [...prevItems[changeData.category], newData] };
                    });
                } else if (change.type === "modified") {
                    const changeData = change.doc.data();
                    const updatedData = { id: change.doc.id, ...changeData };

                    setItems((prevItems) => {
                        Object.keys(prevItems).forEach(item => {
                            prevItems[item] = prevItems[item].filter(i => i.id !== updatedData.id);
                        });

                        return { ...prevItems, [changeData.category]: [...prevItems[changeData.category], updatedData] };
                    });
                }
            });


            if (querySnapshot.empty) {
                console.log("No active boards found.");
                return;
            }
        }, (error) => {
            console.error("Error fetching boards: ", error);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [firestoreDb]);

    return (
        <DragDropProvider
            onDragOver={(event) => {
                const { source } = event.operation;

                if (source?.type === 'column') return;

                setItems((items) => move(items, event));
            }}
            onDragEnd={(event) => {
                const { source } = event.operation;

                const itemSource = (source as any);

                const underPosition = items[itemSource.group][itemSource.index - 1]?.position ?? items[itemSource.group][itemSource.index]?.position
                const overPosition = items[itemSource.group][itemSource.index]?.position ?? 1000;
                const newPosition = (underPosition + overPosition) / (underPosition == overPosition ? 4 : 2);

                updateTask(itemSource.id, { category: itemSource.group, position: newPosition });

                if (event.canceled || (itemSource.type !== 'column')) return;

                setColumnOrder((columns) => move(columns, event));
            }}
        >
            <div className="kanban-container">
                {columnOrder.map((column: string, columnIndex: number) => (
                    <Column key={column} id={column} index={columnIndex} cardData={items[column].sort((a, b) => a?.position - b?.position)} />
                ))}
            </div>
        </DragDropProvider>
    );
}