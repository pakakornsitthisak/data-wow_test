'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

function Sidebar() {
  const pathname = usePathname();
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Check localStorage for userMode, or fallback to pathname
    const userMode = localStorage.getItem('userMode') || 'user';
    const adminByPath = pathname.startsWith('/admin') || pathname === '/history';
    setIsAdminMode(userMode === 'admin' || adminByPath);
  }, [pathname]);

  const handleSwitchMode = () => {
    const newMode = isAdminMode ? 'user' : 'admin';
    localStorage.setItem('userMode', newMode);
    if (isAdminMode) {
      window.location.href = '/user';
    } else {
      window.location.href = '/admin';
    }
  };

  const navItems: Array<{
    href: string;
    label: string;
    icon: string;
    onClick?: () => void;
  }> = [
    ...(isAdminMode
      ? [
          { href: '/admin', label: 'Home', icon: '/svg/home.svg' },
          { href: '/history', label: 'History', icon: '/svg/history.svg' },
        ]
      : []),
    {
      href: '#',
      label: isAdminMode ? 'Switch to User' : 'Switch to Admin',
      icon: '/svg/switch_to_user.svg',
      onClick: handleSwitchMode,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdminMode ? 'Admin' : 'User'}
        </h1>
      </div>
      <nav className="flex-1 p-4 flex flex-col min-h-0">
        <ul className="space-y-2 shrink-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    type="button"
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={`w-5 h-5 ${
                          isActive ? 'opacity-100' : 'opacity-60'
                        }`}
                      />
                    </div>
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={`w-5 h-5 ${
                          isActive ? 'opacity-100' : 'opacity-60'
                        }`}
                      />
                    </div>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-4 pb-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => {
              // Handle logout logic here
              console.log('Logout clicked');
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-gray-700 hover:bg-gray-100 text-left"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <Image
                src="/svg/log_out.svg"
                alt="Log out"
                width={20}
                height={20}
                className="w-5 h-5 opacity-60"
              />
            </div>
            <span>Log out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
