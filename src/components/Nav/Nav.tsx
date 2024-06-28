import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { MdAttachMoney, MdHome, MdDescription } from 'react-icons/md';

import style from './Nav.module.css';

const pages = [
  {
    href: '/',
    Icon: MdHome,
  },
  {
    href: '/finance',
    Icon: MdAttachMoney,
  },
  {
    href: '/documents',
    Icon: MdDescription,
  },
];

const Nav: React.FC = () => {
  const { push, pathname } = useRouter();

  return (
    <div className={style.root}>
      <Image src="/logo.svg" height={40} width={40} />

      <ul className={style.pages}>
        {pages.map(({ href, Icon }) => (
          <li key={href}>
            <Link href={href}>
              <div
                className={
                  pathname === href ? style['active-page'] : style.page
                }
              >
                <Icon size={20} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
