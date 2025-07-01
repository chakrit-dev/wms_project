import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage('Passwords do not match');
      setSuccess(false);
      return;
    }

    setLoading(true);
    try {
      await API.post('/api/reset-password', { token, new_password: password });
      setSuccess(true);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setSuccess(false);
      setMessage(error.response?.data?.detail || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] px-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-white p-8 rounded-3xl w-full max-w-md space-y-6">

        <h2 className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-yellow-300 to-yellow-100 text-transparent bg-clip-text animate-glow">
          Reset Password
        </h2>

        <style>{`
          @keyframes glow {
            0%, 100% {
              text-shadow: 0 0 6px #fde047, 0 0 12px rgba(253, 224, 71, 0.5);
            }
            50% {
              text-shadow: 0 0 12px #facc15, 0 0 20px rgba(250, 204, 21, 0.7);
            }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>

        {message && (
          <Alert variant={success ? 'default' : 'destructive'} className="bg-white/10 border border-white/30 text-white">
            <AlertTitle className="font-bold text-lg">{success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription className="text-sm font-medium tracking-wide">{message}</AlertDescription>
          </Alert>
        )}

        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-4 py-2 bg-white text-red-900 placeholder:text-orange-500 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
        />

        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="pl-4 py-2 bg-white text-red-900 placeholder:text-orange-500 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
        />

        <Button
          className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] hover:brightness-110 text-white font-semibold py-2 rounded-xl shadow-lg transition"
          onClick={handleReset}
          disabled={loading || !password || !confirm}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </div>
  );
}

export default ResetPassword;
