import React, { useEffect, useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaHome, FaHistory } from "react-icons/fa";
import { BsQrCodeScan } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";
import { ROUTES } from "../../utils/constants";
import { cn } from "../../utils/cn";

/**
 * Bottom Navigation Component
 * 
 * A persistent navigation bar fixed to the bottom of the screen for mobile-first navigation.
 * This component highlights the current route and provides quick access to key app features.
 */
const BottomNav = () => {
  const { t, i18n } = useTranslation("bottomNav", {
    useSuspense: false // Disable suspense mode to prevent the error
  });
  const location = useLocation();
  const { isPro, theme } = useProTheme();
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Don't render until translations are ready
  if (!i18n.isInitialized) {
    return null;
  }

  // Handle scroll behavior to show/hide the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show nav if:
      // 1. Scrolling up
      // 2. At top of page
      // 3. At bottom of page
      const isScrollingUp = prevScrollPos > currentScrollPos;
      const isAtTop = currentScrollPos < 10;
      const isAtBottom = window.innerHeight + currentScrollPos >= document.documentElement.scrollHeight - 10;
      
      const shouldBeVisible = isScrollingUp || isAtTop || isAtBottom;
      
      setHasScrolled(true);
      setPrevScrollPos(currentScrollPos);
      setVisible(shouldBeVisible);
    };

    let rafId;
    const throttledScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [prevScrollPos]);

  // Check if a path is active (includes partial path matching)
  const isActive = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get the appropriate classes for a nav item based on its active state
  const getNavItemClasses = (path) => cn(
    "flex flex-col items-center space-y-1 transition-colors duration-200",
    isActive(path) ? theme.navActive : theme.navInactive,
    isActive(path) && "font-medium"
  );

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-lg z-30 transition-transform duration-300",
        !visible && "translate-y-full"
      )}
    >
      <div className="flex justify-around items-center h-16">
        {/* Home Button */}
        <Link
          to={ROUTES.HOME}
          className={getNavItemClasses(ROUTES.HOME)}
          aria-label={t('navigation.home')}
        >
          <FaHome className="text-2xl" />
          <span className="text-xs">{t('navigation.home')}</span>
        </Link>

        {/* Scanner Button (elevated in UI) */}
        <Link
          to={ROUTES.SCANNER}
          className={cn(
            "flex flex-col items-center",
            isActive(ROUTES.SCANNER) ? theme.navActive : theme.navInactive
          )}
          aria-label={t('navigation.scan')}
        >
          <div className="relative -mt-8 mb-1">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
              theme.scanBg,
              "transition-transform hover:scale-105 active:scale-95"
            )}>
              <BsQrCodeScan className={`text-2xl ${theme.iconNav}`} />
            </div>
          </div>
          <span className="text-xs">{t('navigation.scan')}</span>
        </Link>

        {/* History Button */}
        <Link
          to={ROUTES.HISTORY}
          className={getNavItemClasses(ROUTES.HISTORY)}
          aria-label={t('navigation.history')}
        >
          <FaHistory className="text-2xl" />
          <span className="text-xs">{t('navigation.history')}</span>
        </Link>

        {/* Account Button */}
        <Link
          to={ROUTES.ACCOUNT}
          className={getNavItemClasses(ROUTES.ACCOUNT)}
          aria-label={t('navigation.account')}
        >
          <FiUser className="text-2xl" />
          <span className="text-xs">{t('navigation.account')}</span>
        </Link>
      </div>
      
      {/* Add safe area padding for newer iOS devices */}
      <div className="h-safe-bottom bg-white" />
    </nav>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(BottomNav);