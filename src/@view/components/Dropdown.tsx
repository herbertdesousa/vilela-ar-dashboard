import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import { useDetectClickOutside } from 'react-detect-click-outside';
import classNames from 'classnames';

export interface IDropdownRef {
  open(): void;
  close(): void;
  toggle(): void;
}

export interface IDropdownDataItem {
  value: string;
  item: React.ReactNode;
  onSelect?(): void;
  disabled?: boolean;
}

export interface IDropdownProps {
  className?: string;
  // children?: React.ReactNode;
  data: IDropdownDataItem[];
  containerStyle?: React.CSSProperties;
  onSelect?(value: IDropdownDataItem): void;
  onOpen?(): void;
  onClose?(): void;
}

const Dropdown: React.ForwardRefRenderFunction<IDropdownRef, IDropdownProps> = (
  { className, data, onSelect, onOpen, onClose, containerStyle },
  ref,
) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const rootClassName = classNames(
    'rounded bg-accent-0 border border-accent-2 mt-1 w-full absolute tranistion',
    { 'opacity-1': isOpened },
    { 'opacity-0': !isOpened },
    className,
  );

  useImperativeHandle(ref, () => ({
    open() {
      openDropdown();
    },
    close() {
      closeDropdown();
    },
    toggle() {
      if (isOpened) closeDropdown();
      else openDropdown();
    },
  }));

  const closeDropdown = useCallback(() => {
    if (onClose) onClose();
    setIsOpened(false);
  }, [onClose]);
  const openDropdown = useCallback(() => {
    if (onOpen) onOpen();
    setIsVisible(true);
    setTimeout(() => setIsOpened(true), 50);
  }, [onOpen]);
  const onClickOutsideRef = useDetectClickOutside({
    onTriggered: closeDropdown,
  });

  if (!isVisible) return <></>;
  return (
    <div
      ref={onClickOutsideRef}
      className={rootClassName}
      style={{
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04)',
        zIndex: 1000,
        ...containerStyle,
      }}
      onTransitionEnd={() => setIsVisible(isOpened)}
    >
      <ul className="py-1 max-w-full">
        {data.map(item => (
          <li key={item.value}>
            <button
              type="button"
              onClick={() => {
                if (onSelect) onSelect(item);
                if (item.onSelect) item.onSelect();
                closeDropdown();
              }}
              disabled={item?.disabled || false}
              className={`
                py-2 pl-2 cursor-pointer w-full flex items-start text-left
                ${item?.disabled ? '' : 'hover:bg-accent-1'}
              `}
            >
              {item.item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default forwardRef(Dropdown);
