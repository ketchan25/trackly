import React from 'react';
import {useSortable} from '@dnd-kit/react/sortable';
import {CollisionPriority} from '@dnd-kit/abstract';

interface ColumnProps {
    id: string;
    children: React.ReactNode;
    index: number;
}

export function Column({children, id, index}: ColumnProps) {
  const {isDropTarget, ref} = useSortable({
    id,
    index,
    type: 'column',
    accept: ['item', 'column'],
    collisionPriority: CollisionPriority.Low,
  });
  const style = isDropTarget ? {background: '#00000030'} : undefined;

  return (
    <div className="column" ref={ref} style={style}>
      <span className='task-header'>{id}</span>
      {children}
    </div>
  );
}