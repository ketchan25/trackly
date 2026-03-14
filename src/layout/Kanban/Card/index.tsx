import { useSortable } from '@dnd-kit/react/sortable';

interface CardProps {
    data: { id: string; title: string };
    index: number;
    column: string;
}

export const Card = ({data, index, column}: CardProps) => {
    const {ref, isDragging} = useSortable({
        id: data.id,
        index,
        type: 'item',
        accept: 'item',
        group: column
    });

  return (
    <div className="card" ref={ref} data-dragging={isDragging}>
        <span className='task-title'>{data.title}</span>
    </div>
  );
}