// Frontend optimization script for Studify.in
// This script implements performance optimizations for the Next.js frontend

// Next.js config optimizations
const nextConfig = {
  // Enable image optimization
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable compression
  compress: true,
  
  // Enable static optimization
  reactStrictMode: true,
  
  // Configure build optimization
  swcMinify: true,
  
  // Configure webpack for bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Only run in production build
    if (!dev) {
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 30,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: 'shared',
            minChunks: 2,
            priority: 10,
          },
        },
      };
      
      // Add bundle analyzer in analyze mode
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
    }
    
    return config;
  },
};

// Component optimizations
const optimizationGuide = `
# Frontend Optimization Guide for Studify.in

## Component Optimizations

### 1. Implement Code Splitting

Use dynamic imports for large components:

\`\`\`jsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Use if component is client-side only
});
\`\`\`

### 2. Implement Lazy Loading for Images

Use Next.js Image component with priority flag for above-the-fold images:

\`\`\`jsx
import Image from 'next/image';

// For critical above-the-fold images
<Image 
  src="/hero-image.jpg" 
  alt="Hero" 
  width={1200} 
  height={600} 
  priority 
/>

// For below-the-fold images (lazy loaded by default)
<Image 
  src="/content-image.jpg" 
  alt="Content" 
  width={800} 
  height={400} 
/>
\`\`\`

### 3. Implement Memoization for Expensive Components

Use React.memo and useMemo for components that don't need frequent re-renders:

\`\`\`jsx
import { memo, useMemo } from 'react';

// For components
const OptimizedComponent = memo(function Component(props) {
  // Component code
});

// For expensive calculations
function ParentComponent() {
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(a, b);
  }, [a, b]);
  
  return <ChildComponent value={expensiveValue} />;
}
\`\`\`

### 4. Implement Virtualization for Long Lists

Use react-window or react-virtualized for long lists:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

## CSS Optimizations

### 1. Purge Unused CSS

Configure Tailwind to purge unused CSS:

\`\`\`js
// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  // other config
};
\`\`\`

### 2. Optimize CSS Delivery

Use CSS Modules or styled-components to avoid unused CSS:

\`\`\`jsx
// With CSS Modules
import styles from './Button.module.css';

function Button() {
  return <button className={styles.button}>Click me</button>;
}
\`\`\`

## JavaScript Optimizations

### 1. Implement Tree Shaking

Ensure imports are specific:

\`\`\`jsx
// Bad
import * as Utils from '../utils';

// Good
import { specificFunction } from '../utils';
\`\`\`

### 2. Defer Non-Critical JavaScript

Use the defer attribute for non-critical scripts:

\`\`\`jsx
// In _document.js
<script
  src="https://example.com/analytics.js"
  defer
/>
\`\`\`

## API and Data Fetching Optimizations

### 1. Implement SWR for Data Fetching

Use SWR for efficient data fetching with caching:

\`\`\`jsx
import useSWR from 'swr';

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>Hello {data.name}!</div>;
}
\`\`\`

### 2. Implement API Response Caching

Add cache headers to API responses:

\`\`\`js
// In API route handler
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  res.status(200).json({ data: 'cached data' });
}
\`\`\`

## SEO Optimizations

### 1. Implement Proper Meta Tags

Use Next.js Head component for meta tags:

\`\`\`jsx
import Head from 'next/head';

function Page() {
  return (
    <>
      <Head>
        <title>Page Title | Studify.in</title>
        <meta name="description" content="Page description" />
        <meta property="og:title" content="Page Title | Studify.in" />
        <meta property="og:description" content="Page description" />
        <meta property="og:image" content="https://studify.in/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {/* Page content */}
    </>
  );
}
\`\`\`

### 2. Implement Structured Data

Add JSON-LD structured data for better SEO:

\`\`\`jsx
import Head from 'next/head';

function ArticlePage({ article }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": article.image,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Studify.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://studify.in/logo.png"
      }
    },
    "datePublished": article.date,
    "description": article.description
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {/* Article content */}
    </>
  );
}
\`\`\`
`;

// Export the configuration and optimization guide
module.exports = {
  nextConfig,
  optimizationGuide
};
