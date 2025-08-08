import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, MailCheck } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import api, { projectUsersAPI } from '../../utils/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'already'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const apiKey = searchParams.get('apiKey');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        // Assuming backend exposes platform verification route at /auth/verify-email for platform users
        // and project-users verification at /project-users/verify-email with x-api-key
        if (apiKey) {
          await api.post('/project-users/verify-email', { token, email }, { headers: { 'x-api-key': apiKey } });
        } else {
          await api.post('/auth/verify-email', { token, email });
        }
        setStatus('success');
        setMessage('Your email has been verified successfully.');
      } catch (err) {
        const msg = err?.response?.data?.message || 'Verification link is invalid or expired.';
        if (/already/i.test(msg)) {
          setStatus('already');
          setMessage('Your email is already verified.');
        } else {
          setStatus('error');
          setMessage(msg);
        }
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center">
        {status === 'loading' && (
          <>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-base-content/60">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
            <h2 className="text-2xl font-bold">Email Verified</h2>
            <p className="text-base-content/60 mt-2">{message}</p>
            <Link to="/auth/login" className="btn btn-primary mt-6">Continue to Login</Link>
          </>
        )}
        {status === 'already' && (
          <>
            <MailCheck className="w-16 h-16 mx-auto text-info mb-4" />
            <h2 className="text-2xl font-bold">Already Verified</h2>
            <p className="text-base-content/60 mt-2">{message}</p>
            <Link to="/auth/login" className="btn btn-primary mt-6">Continue to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 mx-auto text-error mb-4" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-base-content/60 mt-2">{message}</p>
            <Link to="/auth/login" className="btn btn-ghost mt-6">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;