import React, { useRef, useState } from 'react';

import classNames from 'classnames';

import { IconType } from 'react-icons';
import Dropdown, { IDropdownProps, IDropdownRef } from '../Dropdown';

export interface IListItemProps {
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  rightComponent?: {
    icon: IconType;
    onClick?: () => void;
    dropdown?: IDropdownProps;
  };
  showBottomIndicator?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  buttonClassName?: string;
}

const ListItem: React.FC<IListItemProps> = ({
  title,
  onClick,
  description,
  rightComponent,
  isActive,
  showBottomIndicator,
  buttonClassName,
  className,
}) => {
  const dropdownRef = useRef<IDropdownRef>(null);

  return (
    <>
      <li
        className={classNames(
          'flex justify-between items-center w-full relative',
          className,
        )}
      >
        <button
          type="button"
          onClick={onClick}
          className={`py-0.5 h-14 w-full
          ${isActive && 'bg-accent-1'} ${buttonClassName}
        `}
        >
          <div className="text-left">
            <strong className="text-accent-6 font-medium">{title}</strong>
            {description && <p className="text-accent-3">{description}</p>}
          </div>
        </button>
        {rightComponent && (
          <>
            <button
              type="button"
              onClick={() => {
                if (rightComponent?.onClick) rightComponent.onClick();
                if (rightComponent?.dropdown) dropdownRef?.current.toggle();
              }}
            >
              <rightComponent.icon size={20} className="text-accent-6" />
            </button>
            {rightComponent?.dropdown && (
              <Dropdown
                ref={dropdownRef}
                containerStyle={{ width: 152, right: 12, top: 24 }}
                {...rightComponent.dropdown}
              />
            )}
          </>
        )}
      </li>

      {showBottomIndicator && (
        <div style={{ height: 1 }} className="bg-accent-2 mt-2 w-full" />
      )}
    </>
  );
};

export default ListItem;
