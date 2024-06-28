import { useField } from 'formik';
import React, { useEffect } from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

interface IDatePickerProps {
  name: string;
  label: string;
  isRequired?: boolean;
  className?: string;
}

registerLocale('ptBR', ptBR);

const DatePickerComponent: React.FC<IDatePickerProps> = ({
  name,
  isRequired,
  label,
  className,
}) => {
  const [fieldProps, meta, helpers] = useField(name);

  useEffect(() => {
    const startValue = new Date(meta.value || Date.now());

    helpers.setValue(startValue);
  }, []);

  return (
    <div className={className}>
      <label htmlFor={name} className="font-medium text-accent-6">
        {label}
        {isRequired && <span className="text-red ml-1">*</span>}
      </label>

      <DatePicker
        className="border border-accent-2 transition rounded py-2 px-4 w-full text-accent-6 mt-2"
        onChange={(date: Date) => helpers.setValue(date)}
        selected={new Date(meta.value)}
        dateFormat="dd/MM/yyyy"
        locale={ptBR}
      />
    </div>
  );
};

export default DatePickerComponent;
