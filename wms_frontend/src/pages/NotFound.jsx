import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/bg_org.png")' }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl max-w-md w-full p-10 text-center text-white space-y-6">
        {/* 🚫 Icon + Code */}
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="text-yellow-300 w-16 h-16 animate-pulse drop-shadow-lg" />
          <h1 className="text-6xl font-black tracking-wide text-white drop-shadow-md">404</h1>
          <h2
            className="text-3xl font-extrabold text-transparent bg-clip-text 
                       bg-gradient-to-r from-yellow-300 via-orange-300 to-red-500 
                       drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] animate-pulse"
          >
            Oops! Page Not Found
          </h2>
        </div>

        {/* 📄 Description */}
        <p className="text-sm text-white/80 leading-relaxed font-medium">
          It seems like the page you’re looking for doesn’t exist,<br />
          has been moved, or is currently unavailable.
        </p>

        {/* 🔙 Back Button */}
        <Button
          className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] text-white font-semibold text-base py-2 rounded-xl shadow-lg hover:brightness-110 transition"
          onClick={() => navigate('/login')}
        >
          ← Return to Login
        </Button>
      </div>
    </div>
  );
}
