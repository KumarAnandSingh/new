import { FC } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const HeroSection: FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}) => {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={primaryButtonLink}>
              <span className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-md shadow-md transition-colors inline-block">
                {primaryButtonText}
              </span>
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link href={secondaryButtonLink}>
                <span className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md transition-colors inline-block">
                  {secondaryButtonText}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
