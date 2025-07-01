import React from 'react';

export default function DashboardWelcome() {
  const user = JSON.parse(localStorage.getItem('user'));
  const fullName = `${user?.usl_firstname || 'Unknown'} ${user?.usl_lastname || ''}`.trim();
  const role = user?.role?.toUpperCase();

  const roleColor = {
    admin: 'text-red-400',
    warehouse: 'text-yellow-400',
    'delivery planning': 'text-green-400',
    driver: 'text-blue-400'
  }[user?.role?.toLowerCase()] || 'text-white';

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-white px-6">
      <h1 className="text-4xl font-bold mb-2 drop-shadow">Welcome to SmartLogiX</h1>
      <h2 className="text-2xl font-semibold mb-4">👋 Hello, <span className="text-yellow-300">{fullName}</span></h2>
      <p className={`text-lg font-medium ${roleColor}`}>
        You are logged in as <strong>{role}</strong>
      </p>
      <p className="mt-4 text-sm text-white/80 max-w-lg text-center">
        Use the menu on the left to access the modules available for your role. If you believe your access level is incorrect, please contact the system administrator.
      </p>
    </div>
  );
}
