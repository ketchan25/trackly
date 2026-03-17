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

  const style = isDropTarget ? { background: '#00000030' } : undefined;

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const value = event.target.value;
    setInputValue(value);
    console.log(value);
  }

  return (
    <div className="column" ref={ref} style={style}>
      <span className='task-header'>{id}</span>
      {(cardData).map((item: { id: string; title: string }, index: number) => (
          <Card key={item.id} data={item} index={index} column={id} />
      ))}
      <div className="add-new-task">
        <form>
          <div className='button-add'>
            <input placeholder="Enter task name..." onChange={handleInputChange} value={inputValue} />
            <button type="submit" onClick={(e) => {
              e.preventDefault();
              const datum = { title: inputValue, category: id, position: (cardData.length + 1) * 1000 };
              insertTask({ category: id, data: datum });
              setInputValue('');
            }}>+ Add new task</button>
          </div>
        </form>
      </div>
    </div>
  );
}