import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import { CollisionPriority } from '@dnd-kit/abstract';
import { insertTask } from '../../../../../integrations/firebase/kanban';
import { Card } from '../..';

interface ColumnProps {
    id: string;
    index: number;
    cardData: { id: string; title: string }[];
}

export function Column({ id, index, cardData }: ColumnProps) {
    const { isDropTarget, ref } = useSortable({
        id,
        index,
        type: 'column',
        accept: ['item', 'column'],
        collisionPriority: CollisionPriority.Low,
    });

    const [isEditMode, setEditMode] = useState(false);

    const style = isDropTarget ? { background: '#00000030' } : undefined;

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        console.log(value);
    }

    return (
        <>
            <div className="column" ref={ref} style={style}>
                <div className='card-header'><span>{id}</span></div>
                <div className='card-container'>
                    {(cardData).map((item: { id: string; title: string }, index: number) => (
                        <Card key={item.id} data={item} index={index} column={id} />
                    ))}
                </div>
                <div className='new-task-container'>
                {isEditMode ? (
                    <>
                        <input placeholder="Enter task name..." onChange={handleInputChange} value={inputValue} />
                        <button className='button-save' onClick={(e) => {
                            e.preventDefault();
                            const datum = { title: inputValue, category: id, position: (cardData.length + 1) * 1000 };
                            insertTask({ category: id, data: datum });
                            setInputValue('');
                        }}>Save</button>
                    </>) : (
                    <button className='button-add' type="submit" onClick={(e) => {
                        e.preventDefault();
                        setEditMode(true);

                    }}>+ Add new task</button>
                )}
                </div>
            </div>
        </>
    );
}