// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\ui\Avatar.jsx
import React from 'react';
import { cn } from '../../utils/cn';
import { useProTheme } from '../../utils/useProTheme';

/**
 * Avatar Component
 * 
 * A versatile avatar component that can display user images, 
 * initials, or fallback icons with various sizes and styles.
 * 
 * Props:
 * @param {string} src - Image source URL
 * @param {string} alt - Alternative text for the image
 * @param {string} initials - Initials to display when no image is available (max 2 characters)
 * @param {string} size - Size of the avatar (xs, sm, md, lg, xl)
 * @param {string} shape - Shape of the avatar (circle, square, rounded)
 * @param {string} status - Online status (online, offline, busy, away)
 * @param {string} className - Additional CSS classes
 * @param {boolean} border - Whether to show a border
 */
const Avatar = ({
  src,
  alt = 'User',
  initials,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  border = false,
  ...props
}) => {
  const { isPro, theme } = useProTheme();
  
  // Size classes for the avatar
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };
  
  // Shape classes for the avatar
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };
  
  // Status indicator classes
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };
  
  // Border styles
  const borderClass = border ? isPro ? 'border-2 border-yellow-300' : 'border-2 border-blue-300' : '';
  
  // Get user's initials from alt text if not provided
  const getInitials = () => {
    if (initials && initials.length <= 2) return initials.toUpperCase();
    
    if (alt && alt !== 'User') {
      return alt
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return 'U';
  };
  
  return (
    <div className="relative inline-flex">
      {src ? (
        // Image avatar
        <img
          src={src}
          alt={alt}
          className={cn(
            'object-cover',
            sizeClasses[size] || sizeClasses.md,
            shapeClasses[shape] || shapeClasses.circle,
            borderClass,
            className
          )}
          {...props}
        />
      ) : (
        // Initials avatar
        <div
          className={cn(
            'flex items-center justify-center',
            sizeClasses[size] || sizeClasses.md,
            shapeClasses[shape] || shapeClasses.circle,
            borderClass,
            isPro ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800',
            className
          )}
          {...props}
        >
          {getInitials()}
        </div>
      )}
      
      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full',
            statusClasses[status] || statusClasses.offline,
            {
              'w-2 h-2': size === 'xs',
              'w-2.5 h-2.5': size === 'sm',
              'w-3 h-3': size === 'md',
              'w-3.5 h-3.5': size === 'lg',
              'w-4 h-4': size === 'xl',
            },
            'ring-2 ring-white'
          )}
        />
      )}
    </div>
  );
};

/**
 * Avatar Group Component
 * 
 * Displays a group of avatars with an optional count indicator.
 * 
 * Props:
 * @param {Array} avatars - Array of avatar props
 * @param {number} max - Maximum number of avatars to display
 * @param {string} size - Size of avatars (xs, sm, md, lg, xl)
 * @param {string} shape - Shape of avatars (circle, square, rounded)
 * @param {number} offset - Overlap offset for avatars (-4, -8, -12, etc.)
 */
export const AvatarGroup = ({
  avatars = [],
  max = 3,
  size = 'md',
  shape = 'circle',
  offset = -4,
  className = '',
  ...props
}) => {
  const { isPro } = useProTheme();
  
  // Calculate how many avatars to show and if we need a count
  const visibleCount = Math.min(avatars.length, max);
  const remainingCount = avatars.length - visibleCount;
  const hasMore = remainingCount > 0;
  
  // Determine offset class
  const offsetClass = `ml-[${offset}px]`;
  
  // Size classes for the count indicator
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };
  
  return (
    <div className={cn('flex', className)} {...props}>
      {avatars.slice(0, visibleCount).map((avatar, index) => (
        <div
          key={index}
          className={cn(index !== 0 ? offsetClass : '', 'relative')}
          style={{ marginLeft: index !== 0 ? `${offset}px` : '0' }}
        >
          <Avatar
            size={size}
            shape={shape}
            {...avatar}
          />
        </div>
      ))}
      
      {/* Display count for additional avatars */}
      {hasMore && (
        <div
          className="relative"
          style={{ marginLeft: `${offset}px` }}
        >
          <div
            className={cn(
              'flex items-center justify-center',
              sizeClasses[size] || sizeClasses.md,
              shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-lg' : '',
              isPro ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            )}
          >
            +{remainingCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
