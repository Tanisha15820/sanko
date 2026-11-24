import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import bgImg from '../../assets/images/bg.png';
import cardBgImg from '../../assets/images/card-bg.png';
import sankoLogo from '../../assets/images/sanko-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ userId, rememberMe });
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-6 font-sans select-none"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Centered Split Login Card */}
      <div className="w-full max-w-[780px] min-h-[480px] bg-white rounded-[26px] shadow-[0_24px_60px_rgba(15,52,128,0.14)] border border-white/80 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel with card-bg.png flush against the left edge */}
        <div
          className="w-full md:w-[38%] bg-cover bg-bottom bg-no-repeat p-7 sm:p-8 flex flex-col justify-start relative overflow-hidden min-h-[260px] md:min-h-full"
          style={{ backgroundImage: `url(${cardBgImg})` }}
        >
          {/* Logo + Divider + Tagline */}
          <div className="mt-4">
            <div className="flex items-center">
              <img
                src={sankoLogo}
                alt="Sanko Gosei Ltd."
                className="w-full max-w-[210px] h-auto object-contain object-left mix-blend-multiply"
              />
            </div>

            {/* Blue Horizontal Accent Bar */}
            <div className="w-9 h-[3px] bg-[#0b57d0] rounded-full mt-5 mb-4" />

            {/* Tagline */}
            <p className="text-[13.5px] text-[#64748b] font-medium leading-[1.45]">
              Building a smarter
              <br />
              tomorrow together
            </p>
          </div>
        </div>

        {/* Right Panel - Form Area */}
        <div className="w-full md:w-[62%] px-7 sm:px-12 py-8 sm:py-11 flex flex-col justify-center">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0b57d0] tracking-tight leading-tight">
              Welcome Back
            </h1>
            <p className="text-[14.5px] text-[#64748b] font-medium mt-1.5">
              Sign in to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User ID Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8ba1]">
                <User className="w-[18px] h-[18px]" strokeWidth={1.9} />
              </span>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full h-[50px] pl-11 pr-4 bg-[#f8fafd] border border-[#e6ecf5] rounded-xl text-[14px] font-medium text-[#1e293b] placeholder-[#8996ab] focus:outline-none focus:bg-white focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/12 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8ba1]">
                <Lock className="w-[18px] h-[18px]" strokeWidth={1.9} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[50px] pl-11 pr-11 bg-[#f8fafd] border border-[#e6ecf5] rounded-xl text-[14px] font-medium text-[#1e293b] placeholder-[#8996ab] focus:outline-none focus:bg-white focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/12 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c8ba1] hover:text-[#1e293b] transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.9} />
                ) : (
                  <Eye className="w-[18px] h-[18px]" strokeWidth={1.9} />
                )}
              </button>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 pb-2 text-[13px]">
              <label className="flex items-center gap-2.5 text-[#64748b] font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#cbd5e1] text-[#0b57d0] focus:ring-[#0b57d0]/20 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot-password"
                onClick={(e) => e.preventDefault()}
                className="text-[#2563eb] hover:text-[#0b57d0] font-semibold transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-[50px] rounded-xl bg-gradient-to-r from-[#0d5be1] to-[#0047c4] hover:from-[#0b50c9] hover:to-[#003da8] text-white font-semibold text-[15.5px] shadow-[0_8px_20px_rgba(11,87,208,0.28)] hover:shadow-[0_10px_24px_rgba(11,87,208,0.38)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.2} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
