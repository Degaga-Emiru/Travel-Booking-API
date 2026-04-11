import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post('/auth/verify-otp', { email, otp });
      if (data.success) {
        toast.success('OTP verified successfully!');
        // Usually returns a reset token, pass it to ResetPassword
        const resetToken = data.data?.resetToken;
        navigate('/reset-password', { state: { resetToken, email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await axios.post('/auth/resend-otp', { email });
      if (data.success) {
        setTimeLeft(300);
        toast.success('New OTP sent');
      }
    } catch (err) {
      toast.error('Failed to resend OTP');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Verify OTP</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg border-t-4 border-primary-600 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP Code</label>
              <div className="mt-1">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center tracking-[1em] font-mono text-2xl"
                  placeholder="------"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6 || timeLeft === 0}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`text-sm font-medium ${timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary-600 hover:text-primary-500'}`}
            >
              {timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : 'Resend OTP'}
            </button>
          </div>
          <div className="mt-4 text-center">
             <Link to="/login" className="text-xs text-gray-500 hover:text-primary-600">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
