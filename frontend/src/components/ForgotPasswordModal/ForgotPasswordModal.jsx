import React, { useState } from 'react';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose, onBackToLogin }) => {
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('Verification code sent to your email!');
        setStep('code');
        startResendTimer();
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to send code. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setSuccess('Code verified! Please enter your new password.');
        setStep('reset');
      } else {
        const errorText = await response.text();
        setError(errorText || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword, confirmPassword }),
      });

      if (response.ok) {
        setSuccess('Password reset successfully!');
        setTimeout(() => {
          onClose();
          onBackToLogin();
        }, 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('New code sent to your email!');
        startResendTimer();
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to resend code.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-overlay" onClick={onClose}>
      <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fp-close-btn" onClick={onClose}>&times;</button>
        
        <div className="fp-header">
          <h2>Reset Password</h2>
          <p>Enter your email and we'll send you a verification code</p>
        </div>

        {error && <div className="fp-error">{error}</div>}
        {success && <div className="fp-success">{success}</div>}

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="fp-form">
            <div className="fp-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="fp-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            <button type="button" className="fp-back-btn" onClick={onBackToLogin}>
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Code Verification */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="fp-form">
            <div className="fp-form-group">
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
              <small>Check your email for the code (expires in 5 minutes)</small>
            </div>
            <button type="submit" className="fp-submit-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              type="button"
              className="fp-resend-btn"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
            <button type="button" className="fp-back-btn" onClick={() => setStep('email')}>
              Back
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="fp-form">
            <div className="fp-form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="fp-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="fp-submit-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;