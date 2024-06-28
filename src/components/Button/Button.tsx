import React, { ButtonHTMLAttributes } from 'react';

import classNames from 'classnames';

import { IconType } from 'react-icons';

import style from './Button.module.css';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'primary';
  size?: 'normal' | 'sm';
  loading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
}

const Button: React.FC<IButtonProps> = ({
  children,
  variant = 'primary',
  size = 'normal',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  const { className, onClick, ...rest } = props;

  const rootClassName = classNames(className, style.root, {
    [style['variant-outline']]: variant === 'outline',
    [style['variant-primary']]: variant === 'primary',
    [style['size-normal']]: size === 'normal',
    [style['size-sm']]: size === 'sm',
  });

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
};

export default Button;
