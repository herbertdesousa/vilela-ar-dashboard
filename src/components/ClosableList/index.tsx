import React, { useState } from 'react';
import { MdKeyboardArrowUp, MdAdd } from 'react-icons/md';

interface IClosableListProps {
  title: string;
  onAddBlock?(): void;
  containerClassName?: string;
  list?: {
    data: any[];
    renderItem(item: any, index: number, arr: any[]): React.ReactNode;
  };
}

const ClosableList: React.FC<IClosableListProps> = ({
  title,
  onAddBlock,
  list,
  containerClassName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={containerClassName}>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <strong className="font-merriweather text-2xl font-semibold mr-2">
            {title}
          </strong>
          <button
            type="button"
            onClick={() => setIsOpen(st => !st)}
            className={`transition transform-gpu ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`}
          >
            <MdKeyboardArrowUp size={20} />
          </button>
        </div>

        {onAddBlock && (
          <button
            type="button"
            className="flex items-center text-primary text-xs"
            onClick={onAddBlock}
          >
            <MdAdd size={12} className="mr-1" />
            Adicionar
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {list && (
            <ul>{list.data.map((...args) => list.renderItem(...args))}</ul>
          )}
          {children}
        </>
      )}
    </div>
  );
};

export default ClosableList;
