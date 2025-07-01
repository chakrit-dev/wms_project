// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/bg_org.png")' }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-10 space-y-8 border border-white/30 text-white text-center">
        {/* 🔒 Icon + 403 */}
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="text-yellow-300 w-16 h-16 animate-pulse drop-shadow-lg" />
          <h1 className="text-6xl font-black tracking-wide text-white drop-shadow-md">403</h1>
          <h2 className="text-2xl font-bold text-yellow-200 drop-shadow-sm animate-glow">
            Unauthorized Access
          </h2>
        </div>

        {/* 📄 Description */}
        <p className="text-sm text-white/80 leading-relaxed">
          You do not have permission to view this page.
        </p>

        {/* 🔙 Back Button */}
        <Button
          className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] text-white font-bold text-base py-2 rounded-xl shadow-lg hover:brightness-110"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </Button>

        {/* 🌟 Glow Animation */}
        <style>{`
          @keyframes glow {
            0%, 100% {
              text-shadow: 0 0 6px #fde047, 0 0 12px rgba(253, 224, 71, 0.4);
            }
            50% {
              text-shadow: 0 0 10px #facc15, 0 0 20px rgba(250, 204, 21, 0.6);
            }
          }
          .animate-glow {
            animation: glow 2.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
