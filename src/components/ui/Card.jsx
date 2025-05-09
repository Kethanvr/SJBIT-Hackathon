// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\ui\Card.jsx
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { useProTheme } from '../../utils/useProTheme';

/**
 * Card Component
 * 
 * A versatile card component with multiple variants and theme support.
 * Can be composed with CardHeader, CardContent, and CardFooter.
 * 
 * Props:
 * @param {ReactNode} children - Card content
 * @param {string} variant - Card style variant: "default", "outlined", "elevated", "flat"
 * @param {boolean} hoverable - Whether the card should have hover effects
 * @param {boolean} clickable - Whether the card is clickable
 * @param {string} className - Additional CSS classes
 */
const Card = forwardRef(({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  className = '',
  ...props
}, ref) => {
  const { isPro, theme } = useProTheme();
  
  // Base styles for all cards
  const baseStyles = "rounded-lg overflow-hidden";
  
  // Variant-specific styles
  const variantStyles = {
    default: `bg-white border ${isPro ? 'border-yellow-100' : 'border-blue-100'}`,
    outlined: `bg-transparent border ${isPro ? 'border-yellow-200' : 'border-blue-200'}`,
    elevated: `bg-white shadow-md ${isPro ? 'shadow-yellow-100/50' : 'shadow-blue-100/50'}`,
    flat: 'bg-gray-50 border border-transparent',
  };
  
  // Interactive styles
  const interactiveStyles = cn({
    'transition-all duration-200': hoverable || clickable,
    'hover:shadow-lg': hoverable,
    'cursor-pointer active:scale-[0.98]': clickable,
    [`hover:border-${isPro ? 'yellow' : 'blue'}-300`]: hoverable && (variant === 'default' || variant === 'outlined'),
    [`hover:shadow-${isPro ? 'yellow' : 'blue'}-200/50`]: hoverable && variant === 'elevated',
  });

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant] || variantStyles.default,
        interactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card Header Component
 * 
 * A styled container for card headers, typically containing titles and actions.
 */
export const CardHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div 
    ref={ref}
    className={cn("px-6 py-4 border-b border-gray-100 flex justify-between items-center", className)} 
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Title Component
 * 
 * A styled title component for card headers.
 */
export const CardTitle = forwardRef(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn("font-semibold text-lg text-gray-800", className)}
    {...props}
  >
    {children}
  </Component>
));

CardTitle.displayName = 'CardTitle';

/**
 * Card Content Component
 * 
 * The main content area of a card.
 */
export const CardContent = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div 
    ref={ref}
    className={cn("px-6 py-4", className)} 
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 * 
 * A styled container for card footers, typically containing actions or metadata.
 */
export const CardFooter = forwardRef(({
  children,
  className = '',
  bordered = true,
  ...props
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      "px-6 py-3 flex items-center", 
      bordered && "border-t border-gray-100",
      className
    )} 
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

/**
 * Card Image Component
 * 
 * A component for displaying images within cards.
 */
export const CardImage = forwardRef(({
  src,
  alt = '',
  className = '',
  position = 'top',
  aspectRatio = '16/9',
  objectFit = 'cover',
  ...props
}, ref) => {
  const containerStyles = cn(
    'w-full overflow-hidden',
    {
      'aspect-video': aspectRatio === '16/9',
      'aspect-square': aspectRatio === '1/1',
      'aspect-[4/3]': aspectRatio === '4/3',
      'aspect-[21/9]': aspectRatio === '21/9',
    },
    className
  );
  
  const imgStyles = cn(
    'w-full h-full',
    {
      'object-cover': objectFit === 'cover',
      'object-contain': objectFit === 'contain',
      'object-fill': objectFit === 'fill',
      'object-none': objectFit === 'none',
    }
  );
  
  return position === 'top' ? (
    <div className={containerStyles}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={imgStyles}
        {...props}
      />
    </div>
  ) : (
    <div className={cn('mt-auto', containerStyles)}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={imgStyles}
        {...props}
      />
    </div>
  );
});

CardImage.displayName = 'CardImage';

/**
 * Card Badge Component
 * 
 * A small badge to display statuses or metadata in cards.
 */
export const CardBadge = forwardRef(({
  children,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const { isPro } = useProTheme();
  
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: isPro ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

CardBadge.displayName = 'CardBadge';

// Attach the sub-components to the Card component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Badge = CardBadge;

// Export the main Card component
export default Card;