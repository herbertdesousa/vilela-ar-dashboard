import React from 'react';

import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames';

import { MdHome, MdDescription, MdLogout } from 'react-icons/md';

import { useAuthManager } from '@/@view/managers/AuthManager';

const pages = [
  {
    href: '/',
    Icon: MdHome,
  },
  {
    href: '/documents',
    Icon: MdDescription,
  },
];

export function Nav() {
  const { pathname } = useRouter();
  const { signOut } = useAuthManager();

  return (
    <div className="h-screen w-16 border-r border-accent-2 flex flex-col items-center py-6">
      <Image src="/logo.svg" height={40} width={40} />

      <ul className="mt-12">
        {pages.map(({ href, Icon }) => (
          <li key={href}>
            <Link href={href}>
              <div
                className={classNames(
                  'w-16 h-16 flex items-center justify-center text-accent-4 cursor-pointer hover:text-accent-6 transition',
                  pathname === href && 'bg-accent-1',
                )}
              >
                <Icon size={20} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <button
        id="logout-btn"
        type="button"
        className="mt-auto"
        onClick={signOut}
      >
        <MdLogout />
      </button>
    </div>
  );
}
