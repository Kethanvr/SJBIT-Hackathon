import { useProTheme } from '../../utils/useProTheme';

const LoadingSpinner = ({ label = 'Loading...', className = '' }) => {
  const { isPro } = useProTheme();
  return (
    <div className={`flex justify-center items-center ${className}`} aria-label={label} role="status">
      <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isPro ? 'border-yellow-400' : 'border-blue-600'}`} />
    </div>
  );
};

export default LoadingSpinner;
