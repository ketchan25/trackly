import { DragDropProvider } from "@dnd-kit/react";
import { Card } from "./Card";
import { useState } from "react";
import { move } from '@dnd-kit/helpers';
import { Column } from "./Card/DragAndDrop/Column";
import './kanban.scss';

interface KanbanItems {
    [key: string]: {
        id: string;
        title: string;
    }[];
}

export const Kanban = () => {
    const [items, setItems] = useState<KanbanItems>({
        "in-progress": [
            { id: '1', title: 'Moving cards not working' },
            { id: '2', title: 'Chat messaging not working' },
            { id: '3', title: 'Issue 3' }
        ],
        "to-do": [
            { id: '4', title: 'Issue 4' },
            { id: '5', title: 'Issue 5' }
        ],
        "done": [],
    });

    const [columnOrder, setColumnOrder] = useState<string[]>(() => Object.keys(items));

    console.log(columnOrder);

    return (
        <DragDropProvider
            onDragOver={(event) => {
                const { source } = event.operation;

                if (source?.type === 'column') return;

                setItems((items) => move(items, event));
            }}
            onDragEnd={(event) => {
                const { source } = event.operation;

                if (event.canceled || source?.type !== 'column') return;

                setColumnOrder((columns) => move(columns, event));
            }}
        >
            <div className="kanban-container">
                {columnOrder.map((column: string, columnIndex: number) => (
                    <Column key={column} id={column} index={columnIndex}>
                        {(items[column]).map((item: { id: string; title: string }, index: number) => (
                            <Card key={item.id} data={item} index={index} column={column} />
                        ))}
                    </Column>
                ))}
            </div>
        </DragDropProvider>
    );
}