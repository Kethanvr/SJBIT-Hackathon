// Utility functions for auth callback logic

export function getRedirectUrl() {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost
    ? 'http://localhost:5173/auth'
    : 'https://mediscan.kethanvr.me/auth';
}

export function parseHashParams() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  return {
    type: hashParams.get('type'),
    accessToken: hashParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token'),
    errorDescription: hashParams.get('error_description'),
  };
}

/**
 * Update the user's password using Supabase auth.
 * @param {string} newPassword
 * @returns {Promise<{error: any}>}
 */
export async function updateUserPassword(newPassword) {
  try {
    const { error } = await window.supabase.auth.updateUser({ password: newPassword });
    return { error };
  } catch (error) {
    return { error };
  }
}
