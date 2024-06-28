/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { useField } from 'formik';
import { MdCheck } from 'react-icons/md';
import classNames from 'classnames';

interface ICheckboxProps {
  name: string;
  label: string;
  containerClassName?: string;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  name,
  label,
  containerClassName,
}) => {
  const [fieldProps, meta, helpers] = useField(name);

  return (
    <div className={classNames('flex items-center', containerClassName)}>
      {!fieldProps.value && (
        <button
          id={name}
          type="button"
          className="h-5 w-5 rounded border border-accent-2 bg-accent-1"
          onClick={() => helpers.setValue(true)}
        />
      )}
      {fieldProps.value && (
        <button
          id={name}
          type="button"
          className="flex items-center justify-center h-5 w-5 rounded bg-primary"
          onClick={() => helpers.setValue(false)}
        >
          <MdCheck size={16} className="text-accent-0" />
        </button>
      )}
      <label htmlFor={name} className="ml-3">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
