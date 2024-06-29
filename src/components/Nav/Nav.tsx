import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { MdAttachMoney, MdHome, MdDescription, MdLogout } from 'react-icons/md';

import { useAuthManager } from '@/@view/managers/AuthManager';
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
  const { pathname } = useRouter();
  const { signOut } = useAuthManager();

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

      <button type="button" className="mt-auto" onClick={signOut}>
        <MdLogout />
      </button>
    </div>
  );
};

export default Nav;
