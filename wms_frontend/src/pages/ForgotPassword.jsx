import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AtSign } from 'lucide-react';

export default function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.post('/api/forgot-password', { email });
      console.log('Response:', res.data);
      setMessage("We’ve sent you a reset link. Please check your inbox.");
      setSuccess(true);
    } catch (error) {
      console.error('❌ Error:', error);
      setSuccess(false);
      const errMsg = error.response?.data?.detail;
      setMessage(
        errMsg === 'Email not found.'
          ? 'Email not found in the system.'
          : 'Failed to send reset link.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (Icon, props) => (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Icon className="h-5 w-5 text-red-500" />
        </div>
        <Input
          {...props}
          className="pl-10 py-2 bg-white text-red-900 placeholder:text-orange-500 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md transition duration-300"
        />
      </div>
    </div>
  );

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/bg_org.png")' }}
    >
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
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-10 space-y-8 border border-white/30 text-white">
        <div className="text-center space-y-2">
         <h2
  className="text-4xl font-extrabold text-transparent bg-clip-text 
             bg-gradient-to-r from-[#00f5a0] via-[#ff61e6] to-[#ffa800] 
             text-center tracking-wider drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] 
             animate-pulse leading-[1.3] pb-[2px]"
>
  Reset Password
</h2>

          <p className="text-sm text-white/80 font-medium">Enter your registered email</p>
        </div>

        {message && (
          <Alert
            variant={success ? 'default' : 'destructive'}
            className={`rounded-xl px-4 py-3 shadow-lg border-none text-white ${
              success
                ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-green-500'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500'
            }`}
          >
            <AlertTitle className="font-bold text-lg">
              {success ? '✅ Success' : '❌ Error'}
            </AlertTitle>
            <AlertDescription className="text-sm font-medium tracking-wide whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {renderInput(AtSign, {
          type: 'email',
          placeholder: 'Your Email Address',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          name: 'email'
        })}

        <div className="space-y-4">
          <Button
            onClick={handleRequest}
            disabled={loading || !email}
            className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] hover:brightness-110 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center text-sm">
         <button
  onClick={() => navigate('/login')}
  className="text-white underline underline-offset-4 hover:text-yellow-200 font-medium bg-transparent p-0 shadow-none border-none"
>
  ← Back to Login
</button>

          </div>
        </div>
      </div>
    </div>
  );
}
