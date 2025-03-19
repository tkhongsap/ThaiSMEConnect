import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import LangToggle from './LangToggle';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['/api/auth/me'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <span className="text-primary text-2xl font-bold">AI Content Pro</span>
              </a>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${isActive('/') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  {t('nav.home')}
                </a>
              </Link>
              <Link href="/features">
                <a className={`${isActive('/features') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  {t('nav.features')}
                </a>
              </Link>
              <Link href="/pricing">
                <a className={`${isActive('/pricing') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  {t('nav.pricing')}
                </a>
              </Link>
              <Link href="/examples">
                <a className={`${isActive('/examples') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  {t('nav.examples')}
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LangToggle />
            
            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              {!isLoading && user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/dashboard">
                    <a className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      {t('nav.dashboard')}
                    </a>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href="/profile">
                          <a className="w-full">{t('nav.profile')}</a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/content-generator">
                          <a className="w-full">{t('nav.contentGenerator')}</a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        {t('nav.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <a className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out">
                      {t('nav.login')}
                    </a>
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center sm:hidden">
              <button 
                type="button" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`${isActive('/') ? 'bg-gray-50 border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              {t('nav.home')}
            </a>
          </Link>
          <Link href="/features">
            <a className={`${isActive('/features') ? 'bg-gray-50 border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              {t('nav.features')}
            </a>
          </Link>
          <Link href="/pricing">
            <a className={`${isActive('/pricing') ? 'bg-gray-50 border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              {t('nav.pricing')}
            </a>
          </Link>
          <Link href="/examples">
            <a className={`${isActive('/examples') ? 'bg-gray-50 border-primary text-primary' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              {t('nav.examples')}
            </a>
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!isLoading && user ? (
              <>
                <Link href="/dashboard">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                    {t('nav.dashboard')}
                  </a>
                </Link>
                <Link href="/content-generator">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300">
                    {t('nav.contentGenerator')}
                  </a>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="block pl-3 pr-4 py-2 border-l-4 border-primary text-primary text-base font-medium bg-gray-50">
                    {t('nav.login')}
                  </a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
