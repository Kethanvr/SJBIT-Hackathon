import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import { getRedirectUrl, parseHashParams } from '../utils/authUtils';

export function useAuthCallback() {
  const [status, setStatus] = useState('processing');
  const [redirectUrl, setRedirectUrl] = useState(getRedirectUrl());
  const navigate = useNavigate();

  useEffect(() => {
    setRedirectUrl(getRedirectUrl());
    const { type, accessToken, refreshToken, errorDescription } = parseHashParams();

    const processAuth = async () => {
      if (errorDescription) {
        setStatus('error');
        return;
      }
      if (type === 'signup' || type === 'recovery' || type === 'invite' || type === 'magiclink') {
        if (accessToken && refreshToken) {
          try {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (sessionError) {
              setStatus('error');
            } else {
              setStatus('success');
              navigate('/');
            }
          } catch {
            setStatus('error');
          }
        } else if (type === 'signup' || type === 'recovery') {
          setStatus('success');
        } else {
          setStatus('unknown');
        }
      } else if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          if (sessionError) {
            setStatus('error');
          } else {
            setStatus('success');
            navigate('/');
          }
        } catch {
          setStatus('error');
        }
      } else {
        setStatus('unknown');
      }
    };
    processAuth();
  }, [navigate]);

  return { status, redirectUrl };
}
