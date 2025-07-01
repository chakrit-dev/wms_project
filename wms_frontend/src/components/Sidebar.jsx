import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarItems } from './SidebarItems';

export default function Sidebar({ isOpen = false, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSidebarOpen]);

  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : {};
  const userName = `${user?.usl_firstname || 'Unknown'} ${user?.usl_lastname || ''}`.trim();
  const userEmail = user?.usl_email || 'unknown@example.com';
  const userRole = user?.role?.toLowerCase() || '';

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  const visibleMenuItems = SidebarItems.filter(item =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 w-64 h-screen z-40 flex flex-col justify-between
        bg-black/60 backdrop-blur-md text-white/90 px-4 py-6 border-r border-white/10 shadow-xl
        overflow-y-auto transform md:transform-none transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      style={{ willChange: 'transform' }}
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-yellow-300 tracking-wider mb-6">⚙️ SmartLogiX</h2>

        <nav className="flex flex-col gap-1">
          {visibleMenuItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => {
                  navigate(path);
                  if (window.innerWidth < 768 && setSidebarOpen) setSidebarOpen(false);
                }}
                className={`relative flex items-center gap-3 py-2 px-3 rounded-xl text-left text-sm transition-all duration-200 ease-in-out font-medium
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-inner'
                      : 'hover:bg-white/10 hover:text-yellow-300 text-white/80'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-orange-400 rounded-r-md shadow-md" />
                )}
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10 mt-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold flex items-center justify-center text-sm shadow-lg">
            {getInitial(userName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-yellow-200 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
