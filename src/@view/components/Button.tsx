import React, { ButtonHTMLAttributes } from 'react';

import classNames from 'classnames';

import { IconType } from 'react-icons';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'primary';
  size?: 'normal' | 'sm';
  loading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
}

export function Button({
  children,
  variant = 'primary',
  size = 'normal',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}: Props) {
  const { className, onClick, ...rest } = props;

  const rootClassName = classNames(
    className,
    'flex items-center rounded transition-all font-medium whitespace-nowrap',
    {
      'border border-accent-2 hover:bg-accent-1 text-accent-6 bg-accent-0':
        variant === 'outline',
      'bg-primary hover:bg-dark-primary text-accent-0': variant === 'primary',
      'py-4': size === 'normal',
      'py-2 px-4': size === 'sm',
    },
  );

  return (
    <button
      type="button"
      className={rootClassName}
      onClick={e => {
        if (!loading && onClick) onClick(e);
      }}
      style={{
        justifyContent: RightIcon || LeftIcon ? 'space-between' : 'center',
      }}
      {...rest}
    >
      {LeftIcon && <LeftIcon className="mr-2" />}
      {!loading ? children : '...'}
      {RightIcon && <RightIcon className="ml-2" />}
    </button>
  );
}
