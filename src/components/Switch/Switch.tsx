import React, { useEffect, useRef, useState } from 'react';

import { useField } from 'formik';

import classNames from 'classnames';

import style from './Switch.module.css';

interface ISwitchProps {
  name: string;
  label: string;
  data: {
    option1: {
      label: string;
      value: string;
    };
    option2: {
      label: string;
      value: string;
    };
  };
  isRequired?: boolean;
  containerClassName?: string;
}

const Switch: React.FC<ISwitchProps> = ({
  name,
  isRequired,
  label,
  data,
  containerClassName,
}) => {
  const [fieldProps, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  const option1ButtonRef = useRef<HTMLButtonElement>(null);
  const option2ButtonRef = useRef<HTMLButtonElement>(null);
  const [optionButtonMeasures, setOptionButtonMeasures] = useState({
    width: 0,
    height: 0,
  });

  const [switchIndicatorLeft, setSwitchIndicatorLeft] = useState(0);

  const compareHigher = (a: number, b: number): number => {
    return a > b ? a : b;
  };

  useEffect(() => {
    setSwitchIndicatorLeft(
      meta.value === data.option1.value
        ? 2
        : 2 + optionButtonMeasures.width + 4,
    );
  }, [data.option1.value, meta.value, optionButtonMeasures.width]);

  useEffect(() => {
    if (option1ButtonRef.current && option2ButtonRef.current) {
      const higher = compareHigher(
        option1ButtonRef.current?.offsetWidth,
        option2ButtonRef.current?.offsetWidth,
      );
      setOptionButtonMeasures({
        width: higher + 64,
        height: option1ButtonRef.current?.offsetHeight + 16,
      });
    }
  }, []);

  const onChangeValue = (value: string) => {
    helpers.setValue(value);
  };

  return (
    <div className={classNames(containerClassName, 'relative')}>
      <label htmlFor={name} className="font-medium text-accent-6">
        {label}
        {isRequired && <span className="text-red ml-1">*</span>}
      </label>

      <div
        className={style['switch-indicator']}
        style={{
          width: optionButtonMeasures.width,
          height: optionButtonMeasures.height,
          transform: `translateX(${switchIndicatorLeft}px)`,
        }}
      />
      <div
        className={style['switch-bg']}
        style={{
          width: optionButtonMeasures.width * 2 + 4 + 4,
          height: optionButtonMeasures.height + 4,
        }}
      />
      <div
        className="bg-transparent z-10 mt-2 pl-0.5"
        style={{
          width: optionButtonMeasures.width * 2 + 4 + 4,
          height: optionButtonMeasures.height + 4,
        }}
      >
        <button
          ref={option1ButtonRef}
          type="button"
          className={classNames(style.switch, 'rounded-tl rounded-bl mr-1')}
          style={{
            width:
              optionButtonMeasures.width ||
              option1ButtonRef.current?.offsetWidth,
            height:
              optionButtonMeasures.height ||
              option1ButtonRef.current?.offsetHeight,
            zIndex: 10,
          }}
          onClick={() => helpers.setValue(data.option1.value)}
        >
          {data.option1.label}
        </button>
        <button
          ref={option2ButtonRef}
          type="button"
          className={classNames(style.switch, 'rounded-tr rounded-br')}
          style={{
            width:
              optionButtonMeasures.width ||
              option2ButtonRef.current?.offsetWidth,
            height:
              optionButtonMeasures.height ||
              option2ButtonRef.current?.offsetHeight,
            zIndex: 10,
          }}
          onClick={() => helpers.setValue(data.option2.value)}
        >
          {data.option2.label}
        </button>
      </div>
    </div>
  );
};

export default Switch;
