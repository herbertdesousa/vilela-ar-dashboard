import classNames from 'classnames';
import React from 'react';

interface IBreadCrumbProps {
  data: {
    label: string;
    onClick?(): void;
    active?: boolean;
  }[];
  className?: string;
}

const BreadCrumb: React.FC<IBreadCrumbProps> = ({ data, className }) => {
  return (
    <ul className={classNames('flex', className)}>
      {data.map((item, index) => (
        <li key={item.label}>
          <button
            type="button"
            className={`font-merriweather flex ${
              !item.active
                ? 'text-accent-3 font-normal'
                : 'text-accent-6 font-semibold'
            }`}
            onClick={item.onClick}
          >
            {item.label}
            {data.length - 1 !== index && <p className="mx-2">/</p>}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BreadCrumb;
