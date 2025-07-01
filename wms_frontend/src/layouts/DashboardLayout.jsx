import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const layoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        layoutRef.current &&
        !layoutRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white transition-all bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg_1.webp")' }}
    >
      {/* Fixed Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content shifted right when sidebar is visible */}
      <div ref={layoutRef} className="flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="md:pl-64">
          <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        </div>

        {/* Main Content */}
        <main
          className="flex-1 pt-14 px-4 md:px-6 overflow-y-auto w-full md:pl-64"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="w-full max-w-screen-2xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
