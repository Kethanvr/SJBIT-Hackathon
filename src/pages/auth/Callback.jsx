import { useTranslation } from 'react-i18next'; // Import useTranslation
import StatusIcon from '../../components/auth/StatusIcon';
import CallbackLogo from '../../components/auth/CallbackLogo';
import CallbackFooter from '../../components/auth/CallbackFooter.jsx';
import CallbackMessage from '../../components/auth/CallbackMessage';
import { useAuthCallback } from '../../hooks/useAuthCallback';

export default function Callback() {
  const { t } = useTranslation('auth'); // Initialize useTranslation with 'auth' namespace
  const { status, redirectUrl } = useAuthCallback();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 shadow-xl">
        <CallbackLogo />
        <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <StatusIcon status={status} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {status === 'processing' ? t('callback.status.processing') :
           status === 'success' ? t('callback.status.success') :
           t('callback.status.default')}
        </h2>
        <CallbackMessage status={status} redirectUrl={redirectUrl} />
        <CallbackFooter />
      </div>
    </div>
  );
}
