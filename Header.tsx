import { FC, useState } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-0 right-0 bg-white dark:bg-gray-800 w-full h-auto shadow-xl p-5" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-primary-600">Studify.in</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="block py-2 px-4 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link href="/ai-tools" className="block py-2 px-4 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                AI Tools
              </Link>
            </li>
            <li>
              <Link href="/tutorials" className="block py-2 px-4 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Tutorials
              </Link>
            </li>
            <li>
              <Link href="/productivity" className="block py-2 px-4 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Productivity
              </Link>
            </li>
            <li>
              <Link href="/community" className="block py-2 px-4 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Community
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link href="/login" className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded text-center">
            Sign In
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Toggle theme:</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Studify.in
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-primary-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/ai-tools" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Tools
              </Link>
              <Link href="/tutorials" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Tutorials
              </Link>
              <Link href="/productivity" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Productivity
              </Link>
              <Link href="/community" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Community
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <ThemeSwitcher className="text-gray-500 dark:text-gray-400" />
            <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
