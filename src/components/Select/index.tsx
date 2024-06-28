import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

import classNames from 'classnames';

import {
  MdAddCircleOutline,
  MdClose,
  MdKeyboardArrowDown,
} from 'react-icons/md';

import { useField } from 'formik';
import Button from '../Button';
import Dropdown, { IDropdownDataItem, IDropdownRef } from '../Dropdown';

interface IItem {
  value: string;
  label?: React.ReactNode;
  isActive?: boolean;
}

interface IProps {
  className?: string;
  buttonClassName?: string;
  dropdownStyle?: React.CSSProperties;
  showClearField?: boolean;

  isRequired?: boolean;
  placeholder?: string;
  value?: string;
  name: string;
  hasFilter?: boolean;
  data:
    | {
        variant?: 'single' | 'array';
        fetch: () => Promise<IItem[]>;
        onAddFilter(filterText: string): Promise<void>;
      }
    | IItem[];
  label: string;
  onSelect?(value: IItem): void;
}

const Select: React.FC<IProps> = ({
  name,
  className,
  dropdownStyle,
  buttonClassName,
  isRequired,
  hasFilter = true,
  showClearField = false,
  value,
  label,
  placeholder,
  data,
  onSelect,
}) => {
  const [fieldProps, meta, helpers] = useField(name);

  const [isFocused, setIsFocused] = useState(false);

  const inputFilterRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<IDropdownRef>(null);

  const [parsedData, setParsedData] = useState<{
    filter: IDropdownDataItem[];
    complete: IDropdownDataItem[];
  }>({
    complete: [],
    filter: [],
  });

  const [inputFilterText, setInputFilterText] = useState('');

  useEffect(() => {
    (async () => {
      const format = (item: IItem): IDropdownDataItem => ({
        value: item.value,
        item: (
          <span className={item.isActive ? 'text-primary' : 'text-accent-6'}>
            {item.label || item.value}
          </span>
        ),
      });

      if (Array.isArray(data)) {
        const res = data.map(format);
        setParsedData({ filter: res, complete: res });
        return;
      }

      if (data.variant === 'array') {
        const res = (await data.fetch())
          .map(format)
          .filter(i => !fieldProps.value.includes(i.value));
        setParsedData({ filter: res, complete: res });
        return;
      }

      const res = (await data.fetch()).map(format);
      setParsedData({ filter: res, complete: res });
    })();
  }, [data, fieldProps.value, onSelect]);

  const changeFieldValue = useCallback(
    (payload: string) => {
      setParsedData(st => ({ complete: st.complete, filter: st.complete }));
      if (Array.isArray(data)) {
        helpers.setValue(value);
        return;
      }

      if (data.variant === 'array') {
        helpers.setValue([...fieldProps.value, payload]);
        return;
      }

      helpers.setValue(payload);
    },
    [data, fieldProps.value, helpers],
  );

  const onChangeFilter = useCallback(
    (text: string) => {
      if (Array.isArray(data)) return;

      setInputFilterText(text);

      // if (name === 'layers[1].title') console.log(text);

      setParsedData(st => {
        if (text.length === 0)
          return { complete: st.complete, filter: st.complete };

        const normalize = (txt: string): string =>
          txt.toLocaleLowerCase().replace(/ /g, '');

        const filter = st.complete.filter(i =>
          normalize(i.value).includes(normalize(text)),
        );

        if (!filter.length) {
          return {
            complete: st.complete,
            filter: [
              {
                item: (
                  <p className="flex items-center text-primary ml-1">
                    <MdAddCircleOutline size={16} />
                    &nbsp;&nbsp;Adicionar&nbsp;
                    <span className="underline">
                      {inputFilterRef.current?.value}
                    </span>
                  </p>
                ),
                onSelect: () => data.onAddFilter(inputFilterRef.current?.value),
                value: inputFilterRef.current?.value,
              },
            ],
          };
        }

        return {
          complete: st.complete,
          filter: [...filter],
        };
      });
    },
    [data],
  );

  const openSelect = useCallback(() => {
    setIsFocused(true);
    inputFilterRef.current?.focus();

    dropdownRef.current.open();
  }, []);
  const closeSelect = useCallback(() => {
    onChangeFilter('');

    inputFilterRef.current?.blur();
    setIsFocused(false);

    dropdownRef.current.close();
  }, [onChangeFilter]);
  const onSelectItem = useCallback(
    (item: IDropdownDataItem) => {
      setInputFilterText('');

      if (onSelect) onSelect(item);
      changeFieldValue(item.value);

      closeSelect();
    },
    [changeFieldValue, closeSelect, onSelect],
  );

  const fieldValue = useMemo(() => {
    if (!hasFilter) return value;

    if (!isFocused && !Array.isArray(data) && data.variant === 'single')
      return fieldProps.value;
    return value;
  }, [data, fieldProps.value, hasFilter, isFocused, value]);

  const placeholderValue = useMemo(() => {
    if (Array.isArray(data)) return '';
    if (data.variant === 'single' && !isFocused && fieldProps.value) return '';
    return placeholder;
  }, [data, fieldProps.value, isFocused, placeholder]);

  const onClickOutsideRef = useDetectClickOutside({
    onTriggered: closeSelect,
    // onTriggered: () => {
    //   inputFilterRef.current?.blur();
    //   setIsFocused(false);
    // },
  });

  return (
    <div className={classNames('relative', className)}>
      <div
        className={`flex items-center justify-between ${
          label || showClearField ? 'mb-2' : ''
        }`}
      >
        <label htmlFor={name} className="font-medium text-accent-6">
          {label}
          {isRequired && <span className="text-red ml-1">*</span>}
        </label>

        {showClearField && (
          <button
            type="button"
            className="flex items-center text-xs text-accent-3 hover:text-accent-4 transition"
            onClick={() => helpers.setValue('')}
          >
            <MdClose size={12} />
            &nbsp;Limpar Campo
          </button>
        )}
      </div>

      <div ref={onClickOutsideRef}>
        <Button
          onClick={openSelect}
          variant="outline"
          className={classNames('w-full h-10', buttonClassName)}
          size="sm"
          rightIcon={MdKeyboardArrowDown}
        >
          <div className={!hasFilter ? 'w-full text-left' : ''}>
            {fieldValue}
          </div>

          {hasFilter && (
            <input
              ref={inputFilterRef}
              type="input"
              className="w-full bg-transparent placeholder-accent-3"
              placeholder={placeholderValue}
              value={inputFilterText}
              onChange={e => onChangeFilter(e.target.value)}
            />
          )}
        </Button>
      </div>
      <Dropdown
        ref={dropdownRef}
        className="overflow-y-scroll no-scroll"
        containerStyle={{ ...dropdownStyle, maxHeight: 192 }}
        data={parsedData.filter}
        onSelect={onSelectItem}
      />
    </div>
  );
};

export default Select;
