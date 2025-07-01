import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, AtSign, Phone } from 'lucide-react';

export default function UnifiedAuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [reg, setReg] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    regUsername: '',
    regPassword: '',
    confirmPassword: '',
    role: ''
  });

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMessage(null);
    setSuccess(false);

    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

    useEffect(() => {
    setMessage(null);
    setSuccess(false);
  }, [location.pathname]);

  const validateEmailFormat = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateLogin = () => {
    const errs = {};
    if (!username || username.length < 4) errs.username = 'Username must be at least 4 characters.';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs = {};
    if (!reg.firstname) errs.firstname = 'First name is required.';
    if (!reg.lastname) errs.lastname = 'Last name is required.';
    if (!reg.phone || reg.phone.length < 9 || !/^\d+$/.test(reg.phone)) errs.phone = 'Valid phone number is required.';
    if (!reg.email || !validateEmailFormat(reg.email)) errs.email = 'Please enter a valid email address.';
    if (!reg.regUsername || reg.regUsername.length < 4) errs.regUsername = 'Username must be at least 4 characters.';
    if (!reg.regPassword || reg.regPassword.length < 6) errs.regPassword = 'Password must be at least 6 characters.';
    if (reg.regPassword !== reg.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!reg.role) errs.role = 'Please select a role.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', username.trim());
      formData.append('password', password);

      const res = await API.post('/api/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = res?.data?.access_token;
      if (!token) throw new Error("No access token received.");

      if (rememberMe) {
        localStorage.setItem('remembered_username', username);
      } else {
        localStorage.removeItem('remembered_username');
      }

      localStorage.removeItem('remembered_password');

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        token: token,
        usl_username: res.data.username,
        usl_firstname: res.data.firstname,
        usl_lastname: res.data.lastname,
        usl_email: res.data.email,
        role: res.data.role?.toLowerCase(),
        permissions: res.data.permissions || []
      }));
      localStorage.setItem("permissions", JSON.stringify(res.data.permissions || []));

      setSuccess(true);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 1000);
    } catch (err) {
      setSuccess(false);
      const detail = err.response?.data?.detail || err.message;
      if (detail === "Account is pending approval.") {
        setMessage("Your account is pending approval by the administrator.");
      } else if (detail === "Incorrect username or password" || detail === "Invalid credentials") {
        setMessage("Incorrect username or password.");
      } else {
        setMessage(detail || "Login failed. Please try again.");
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const res = await API.post('/api/register', {
        firstname: reg.firstname,
        lastname: reg.lastname,
        phone: reg.phone,
        email: reg.email,
        username: reg.regUsername,
        password: reg.regPassword,
        role: reg.role
      });
      setSuccess(true);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setSuccess(false);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setMessage(detail.map(e => `${e.loc[1]}: ${e.msg}`).join('\n'));
      } else {
        setMessage(detail || 'Registration failed.');
      }
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
      {errors[props.name] && (
        <div className="text-sm text-white font-medium px-1 animate-fade-in-down">
          {errors[props.name]}
        </div>
      )}
    </div>
  );

  const linkStyle = "font-medium text-white hover:text-yellow-200 underline underline-offset-4 transition bg-transparent border-none p-0 shadow-none";

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/bg_org.png")' }}
    >
      <style>{`
        @keyframes bounceInfinite {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl rounded-3xl p-10 space-y-8 border border-white/30">
        <div className="flex items-center justify-center space-x-4">
  {['W', 'M', 'S'].map((char, i) => (
    <div
      key={char}
      className="w-14 h-14 text-white text-2xl font-bold rounded-full flex items-center justify-center shadow-xl animate-bounce"
      style={{
        backgroundImage:
          i === 0
            ? 'linear-gradient(135deg, #00f5a0, #00d9f5)'
            : i === 1
              ? 'linear-gradient(135deg, #ff61e6, #7a5fff)'
              : 'linear-gradient(135deg, #ffa800, #ff3d00)',
        boxShadow:
          i === 0
            ? '0 0 12px 4px rgba(0, 245, 160, 0.6)'
            : i === 1
              ? '0 0 12px 4px rgba(255, 97, 230, 0.6)'
              : '0 0 12px 4px rgba(255, 61, 0, 0.6)',
        animationDelay: `${i * 0.2}s`
      }}
    >
      {char}
    </div>
  ))}
</div>

<h2
  className="text-5xl font-extrabold text-transparent bg-clip-text 
             bg-gradient-to-r from-[#00f5a0] via-[#ff61e6] to-[#ffa800] 
             text-center tracking-wider drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] 
             animate-pulse leading-[1.35] pb-[2px]"
>
  SmartLogiX
  <span
    className="inline-block align-super -translate-y-[2px] text-sm font-bold ml-1
               text-transparent bg-clip-text 
               bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500
               drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
  >
    CT
  </span>
</h2>





        <p className="text-base text-white/80 font-medium text-center">WMS & Transportation</p>

  {message && (
  <Alert variant={success ? 'default' : 'destructive'} className="bg-white/20 border border-white text-white">
    <AlertTitle className="font-bold text-lg">{success ? 'Success' : 'Error'}</AlertTitle>
    <AlertDescription
      role="alert"  // ✅ เพิ่มตรงนี้ หรือใช้ data-testid แทนก็ได้
      className="text-sm font-medium tracking-wide whitespace-pre-line"
    >
      {message}
    </AlertDescription>
  </Alert>
)}


        <div className="space-y-5">
          {isLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-5"
            >
                  {renderInput(User, {
              placeholder: 'Username',
              value: username,
              onChange: (e) => setUsername(e.target.value),
              name: 'username'
            })}

              {renderInput(Lock, {
                type: 'password',
                placeholder: 'Enter your password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                name: 'password'
              })}
              <div className="flex items-center justify-between text-sm text-white">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-yellow-400 w-4 h-4"
                  />
                  Remember Me
                </label>
                <button type="button" onClick={() => navigate('/forgot-password')} className={linkStyle}>
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] hover:brightness-110 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center text-sm text-white">
                Don’t have an account?{' '}
                <button type="button" onClick={() => navigate('/register')} className={linkStyle}>
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {renderInput(User, {
                  placeholder: 'First Name',
                  value: reg.firstname,
                  onChange: (e) => setReg({ ...reg, firstname: e.target.value }),
                  name: 'firstname'
                })}
                {renderInput(User, {
                  placeholder: 'Last Name',
                  value: reg.lastname,
                  onChange: (e) => setReg({ ...reg, lastname: e.target.value }),
                  name: 'lastname'
                })}
              </div>
              {renderInput(Phone, {
                placeholder: 'Phone Number',
                value: reg.phone,
                onChange: (e) => setReg({ ...reg, phone: e.target.value }),
                name: 'phone'
              })}
              {renderInput(AtSign, {
                type: 'email',
                placeholder: 'Valid Email Address',
                value: reg.email,
                onChange: (e) => setReg({ ...reg, email: e.target.value }),
                name: 'email'
              })}
              {renderInput(User, {
                placeholder: 'Create a Username',
                value: reg.regUsername,
                onChange: (e) => setReg({ ...reg, regUsername: e.target.value }),
                name: 'regUsername'
              })}

              {renderInput(Lock, {
                type: 'password',
                placeholder: 'Create a Password',
                value: reg.regPassword,
                onChange: (e) => setReg({ ...reg, regPassword: e.target.value }),
                name: 'regPassword'
              })}
              {renderInput(Lock, {
                type: 'password',
                placeholder: 'Confirm Password',
                value: reg.confirmPassword,
                onChange: (e) => setReg({ ...reg, confirmPassword: e.target.value }),
                name: 'confirmPassword'
              })}
              <div className="space-y-1">
                <select
                  value={reg.role}
                  onChange={(e) => setReg({ ...reg, role: e.target.value })}
                  className="w-full mt-2 p-2 rounded-lg border bg-white text-red-800 font-medium shadow"
                >
                  <option value="">Select Role</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="driver">Driver</option>
                  <option value="delivery planning">Delivery Planning</option>
                </select>
                {errors.role && (
                  <div className="text-sm text-white font-medium px-1 animate-fade-in-down">
                    {errors.role}
                  </div>
                )}
              </div>
              <Button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-[#c9082a] via-[#f0650e] to-[#fccb00] hover:brightness-110 text-white font-bold py-2 rounded-xl shadow-lg transition"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Create Account'}
              </Button>
              <div className="text-center text-sm text-white">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className={linkStyle}>
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}