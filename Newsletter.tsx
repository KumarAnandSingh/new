import { FC } from 'react';
import Link from 'next/link';

interface NewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

const Newsletter: FC<NewsletterProps> = ({
  title = 'Stay updated with the latest AI tools',
  description = 'Join our newsletter to receive the latest updates, tips, and exclusive content.',
  buttonText = 'Subscribe',
  className = ''
}) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {buttonText}
          </button>
        </form>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
