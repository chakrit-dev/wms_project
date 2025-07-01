import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Warehouse, ChevronDown, LogOut, KeyRound, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Navbar({ onToggleSidebar }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const userObj = JSON.parse(stored);
        const fullName = `${userObj.usl_firstname || ''} ${userObj.usl_lastname || ''}`.trim();
        setUsername(fullName || 'Guest');
        setEmail(userObj.usl_email || '');
      } else {
        setUsername('Guest');
        setEmail('');
      }
    } catch (err) {
      console.error('Error parsing user from localStorage', err);
      setUsername('Guest');
      setEmail('');
    }
  }, []);

  const hideNavbarPaths = ['/login', '/register', '/forgot-password'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname) || !location.pathname.startsWith('/dashboard');
  if (hideNavbar) return null;

  const getEmailInitial = (email) => {
    if (!email) return '?';
    const name = email.split('@')[0];
    const parts = name.split('.');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-xl border-b border-white/20 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 h-16 text-white">
        {/* 🔥 Logo + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden mr-2 p-1 rounded hover:bg-orange-500/40 transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
          >
            <Warehouse className="w-8 h-8 text-white drop-shadow" />
            <div className="text-left leading-none hidden sm:block">
              <h1 className="text-xl font-black tracking-wide drop-shadow text-white">
  SmartLogiX
  <span
    className="inline-block align-super -translate-y-[2px] ml-1 text-xs font-bold text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
  >
    CT
  </span>
</h1>

              <p className="text-xs font-medium text-orange-100 drop-shadow-sm">
                WMS & Transportation
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-orange-600 font-semibold shadow hover:brightness-110 transition">
              <Avatar className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-sm flex items-center justify-center shadow">
                {getEmailInitial(email)}
              </Avatar>
              <span className="text-sm hidden sm:inline-block">{username}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white rounded-lg shadow-xl text-sm text-gray-800 w-52 py-2 px-2 z-[100]">
              <DropdownMenu.Item
                className="hover:bg-orange-100 rounded-md px-3 py-2 cursor-pointer flex items-center gap-2"
                onClick={() => navigate('/forgot-password')}
              >
                <KeyRound className="w-4 h-4 text-orange-500" />
                Reset Password
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <DropdownMenu.Item
                className="hover:bg-red-100 text-red-600 rounded-md px-3 py-2 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login', { replace: true });
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
