/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Home Page - Warm Cream & Elegant Tones
        home: {
          primary: '#2C3E50',    // Deep Charcoal
          secondary: '#B0DB9C',   // Soft Sage Green (your specified color)
          accent: '#34495E',      // Steel Blue Gray
          light: '#F9F8F6',      // Warm Cream (your specified color)
          cream: '#F9F8F6',      // Main background color
          text: '#2C3E50',       // Dark text
          muted: '#7F8C8D',      // Muted gray
          gradient: 'from-slate-800 via-gray-700 to-slate-900',
        },
        
        // Properties Page - Forest & Emerald (Nature & Growth)
        properties: {
          primary: '#065f46',     // Forest Green
          secondary: '#10b981',   // Emerald
          accent: '#047857',      // Dark Emerald
          light: '#ecfdf5',      // Mint
          text: '#374151',       // Charcoal
          gradient: 'from-emerald-900 via-green-800 to-teal-900',
        },
        
        // Property Detail - Royal Purple & Gold (Premium & Luxury)
        detail: {
          primary: '#581c87',     // Royal Purple
          secondary: '#eab308',   // Golden Yellow
          accent: '#7c2d12',      // Bronze
          light: '#faf5ff',      // Lavender Mist
          text: '#1f2937',       // Graphite
          gradient: 'from-purple-900 via-violet-800 to-indigo-900',
        },
        
        // Auth Pages - Midnight & Rose Pink (Trust & Security)
        auth: {
          primary: '#1e1b4b',     // Midnight Blue
          secondary: '#9F8383',   // Rose Pink (your specified color)
          accent: '#312e81',      // Deep Indigo
          light: '#f0fdfa',      // Cyan Mist
          text: '#111827',       // Almost Black
          gradient: 'from-indigo-900 via-blue-900 to-rose-600',
        },
        
        // New Auth Pages - Modern Dark Theme with Rose Pink
        'auth-new': {
          primary: '#0f172a',     // Slate 900
          secondary: '#9F8383',   // Rose Pink (your specified color)
          accent: '#1e293b',      // Slate 800
          light: '#f8fafc',      // Slate 50
          text: '#ffffff',       // Pure White for better contrast
          muted: '#cbd5e1',      // Slate 300 (lighter for better visibility)
          gradient: 'from-slate-900 via-slate-800 to-rose-600',
        },
        
        // Agent Pages - Crimson & Rose (Energy & Success)
        agent: {
          primary: '#be123c',     // Crimson
          secondary: '#f43f5e',   // Rose
          accent: '#881337',      // Dark Rose
          light: '#fdf2f8',      // Rose Mist
          text: '#374151',       // Ash Gray
          gradient: 'from-rose-900 via-pink-800 to-red-900',
        },
        
        // Admin Pages - Charcoal & Rich Gold (Power & Control)
        admin: {
          primary: '#374151',     // Charcoal
          secondary: '#B8860B',   // Dark Golden Rod (darker, more visible)
          accent: '#1f2937',      // Dark Charcoal
          light: '#f8fafc',      // Cool Gray
          text: '#111827',       // Jet Black
          gradient: 'from-gray-900 via-slate-800 to-yellow-900',
        },
        
        // Profile & Settings - Amber & Copper (Warmth & Personal)
        profile: {
          primary: '#d97706',     // Amber
          secondary: '#b45309',   // Copper
          accent: '#92400e',      // Bronze
          light: '#fffbeb',      // Cream
          text: '#1f2937',       // Dark Brown
          gradient: 'from-amber-900 via-orange-800 to-yellow-900',
        },
        
        // Wishlist - Magenta & Fuchsia (Love & Desire)
        wishlist: {
          primary: '#a21caf',     // Magenta
          secondary: '#c026d3',   // Fuchsia
          accent: '#701a75',      // Dark Magenta
          light: '#fdf4ff',      // Magenta Mist
          text: '#374151',       // Soft Black
          gradient: 'from-fuchsia-900 via-purple-800 to-pink-900',
        },
        
        // Dashboard - Teal & Rich Gold (Analytics & Data)
        dashboard: {
          primary: '#0f766e',     // Teal
          secondary: '#B8860B',   // Dark Golden Rod (darker, more visible)
          accent: '#134e4a',      // Dark Teal
          light: '#f0fdfa',      // Aqua Mist
          text: '#1e293b',       // Ocean Gray
          gradient: 'from-teal-900 via-cyan-800 to-yellow-900',
        },
        
        // Error Pages - Sunset & Coral (Attention & Warmth)
        error: {
          primary: '#dc2626',     // Sunset Red
          secondary: '#fb7185',   // Coral Pink
          accent: '#991b1b',      // Dark Red
          light: '#fef2f2',      // Blush
          text: '#1f2937',       // Charcoal
          gradient: 'from-red-900 via-pink-800 to-orange-900',
        },
        
        // Common System Colors (Neutral & Functional)
        beige: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#ebe7df',
          300: '#D7C097',  // Your specified color
          400: '#c9b380',
          500: '#b8a169',
          600: '#a08c5a',
          700: '#87754c',
          800: '#6f5f40',
          900: '#5a4d35',
        },
        sage: {
          50: '#f6f9f4',
          100: '#e9f2e4',
          200: '#d4e5ca',
          300: '#B0DB9C',  // Previous sage color
          400: '#9BC53D',
          500: '#8FBC8F',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // New beautiful fonts for different sections
        hero: ['Montserrat', 'sans-serif'],           // Bold, modern for hero sections
        elegant: ['Crimson Text', 'serif'],          // Elegant for testimonials
        clean: ['Nunito Sans', 'sans-serif'],        // Clean for body text
        modern: ['Space Grotesk', 'sans-serif'],     // Modern for features
        luxury: ['Cormorant Garamond', 'serif'],     // Luxury for property titles
        tech: ['Source Code Pro', 'monospace'],      // Tech for stats/numbers
      },
      backgroundImage: {
        // Home Page - Luxury Real Estate with Warm Cream Theme
        'home-hero': "linear-gradient(135deg, rgba(44, 62, 80, 0.85), rgba(52, 73, 94, 0.8)), url('https://images.unsplash.com/photo-1715168437311-18b9ec0830c1?w=1920&h=1080&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE0fHxyZWFsJTIwZXN0YXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww')",
        'home-stats': "linear-gradient(135deg, rgba(249, 248, 246, 0.95), rgba(249, 248, 246, 0.9)), url('https://media.istockphoto.com/id/2249890999/photo/luxury-modern-dining-room-interior-with-accent-wall-and-unique-decor.webp?a=1&b=1&s=612x612&w=0&k=20&c=9ZclAWwb7LbMkQ63SQu2ytI4M4to3zWSMBlCJWGv3rw=')",
        'home-types': "linear-gradient(135deg, rgba(44, 62, 80, 0.3), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1631706714247-5dc6542027ef?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'home-featured': "linear-gradient(135deg, rgba(249, 248, 246, 0.95), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop')",
        'home-features': "linear-gradient(135deg, rgba(230, 126, 34, 0.1), rgba(249, 248, 246, 0.95)), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=1080&fit=crop')",
        'home-testimonials': "linear-gradient(135deg, rgba(249, 248, 246, 0.92), rgba(255, 255, 255, 0.88)), url('https://media.istockphoto.com/id/468993368/photo/house.webp?a=1&b=1&s=612x612&w=0&k=20&c=1onYbmXiB-eeClpOUsmiDdnCeSwhYNwMjqX9l2jNnro=')",
        'home-cta': "linear-gradient(135deg, rgba(44, 62, 80, 0.8), rgba(52, 73, 94, 0.75)), url('https://images.unsplash.com/photo-1684864706908-4ed39012b5b1?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg5fHxncmV5JTIwcmVhbCUyMGVzdGF0ZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D')",
        'home-how-it-works': "linear-gradient(135deg, rgba(249, 248, 246, 0.85), rgba(255, 255, 255, 0.8)), url('https://images.unsplash.com/photo-1688592286809-881bbb6f66cb?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyZXklMjByZWFsJTIwZXN0YXRlJTIwaW1hZ2VzfGVufDB8fDB8fHww')",
        'home-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23E67E22\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        
        // Properties Page - Nature & Growth
        'properties-hero': "linear-gradient(135deg, rgba(6, 95, 70, 0.9), rgba(4, 120, 87, 0.8)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')",
        'properties-pattern': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%2310b981\" fill-opacity=\"0.06\"%3E%3Cpath d=\"M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Property Detail - Royal Purple & Gold
        'detail-hero': "linear-gradient(135deg, rgba(88, 28, 135, 0.9), rgba(124, 45, 18, 0.8)), url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=1080&fit=crop')",
        'detail-pattern': "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23eab308\" fill-opacity=\"0.04\"%3E%3Cpath d=\"M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Auth Pages - Midnight & Rich Gold
        'auth-hero': "linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(49, 46, 129, 0.9)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop')",
        'auth-new': "linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.9)), url('https://plus.unsplash.com/premium_photo-1676983352797-a12800a05dfb?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        'auth-pattern': "url('data:image/svg+xml,%3Csvg width=\"50\" height=\"50\" viewBox=\"0 0 50 50\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23B8860B\" fill-opacity=\"0.08\"%3E%3Ccircle cx=\"25\" cy=\"25\" r=\"8\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Agent Pages - Crimson & Rose
        'agent-hero': "linear-gradient(135deg, rgba(190, 18, 60, 0.9), rgba(136, 19, 55, 0.8)), url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop')",
        'agent-pattern': "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23f43f5e\" fill-opacity=\"0.07\"%3E%3Cpolygon points=\"15,0 30,15 15,30 0,15\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Admin Pages - Charcoal & Rich Gold
        'admin-hero': "linear-gradient(135deg, rgba(55, 65, 81, 0.95), rgba(31, 41, 55, 0.9)), url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop')",
        'admin-pattern': "url('data:image/svg+xml,%3Csvg width=\"70\" height=\"70\" viewBox=\"0 0 70 70\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23B8860B\" fill-opacity=\"0.08\"%3E%3Crect width=\"35\" height=\"35\" x=\"0\" y=\"0\"/%3E%3Crect width=\"35\" height=\"35\" x=\"35\" y=\"35\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Profile - Amber & Copper
        'profile-hero': "linear-gradient(135deg, rgba(217, 119, 6, 0.9), rgba(146, 64, 14, 0.8)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop')",
        'profile-pattern': "url('data:image/svg+xml,%3Csvg width=\"45\" height=\"45\" viewBox=\"0 0 45 45\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23b45309\" fill-opacity=\"0.06\"%3E%3Cpath d=\"M22.5 22.5L45 0v45z\"/%3E%3Cpath d=\"M22.5 22.5L0 45V0z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Wishlist - Magenta & Fuchsia
        'wishlist-hero': "linear-gradient(135deg, rgba(162, 28, 175, 0.9), rgba(112, 26, 117, 0.8)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop')",
        'wishlist-pattern': "url('data:image/svg+xml,%3Csvg width=\"35\" height=\"35\" viewBox=\"0 0 35 35\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23c026d3\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M17.5 17.5c0-4.8-3.9-8.7-8.7-8.7s-8.7 3.9-8.7 8.7 3.9 8.7 8.7 8.7 8.7-3.9 8.7-8.7z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Dashboard - Teal & Rich Gold
        'dashboard-hero': "linear-gradient(135deg, rgba(15, 118, 110, 0.9), rgba(19, 78, 74, 0.8)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop')",
        'dashboard-pattern': "url('data:image/svg+xml,%3Csvg width=\"55\" height=\"55\" viewBox=\"0 0 55 55\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23B8860B\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M27.5 0L55 27.5L27.5 55L0 27.5z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Error Pages - Sunset & Coral
        'error-hero': "linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(153, 27, 27, 0.8)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')",
        'error-pattern': "url('data:image/svg+xml,%3Csvg width=\"25\" height=\"25\" viewBox=\"0 0 25 25\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23fb7185\" fill-opacity=\"0.09\"%3E%3Cpath d=\"M12.5 0L25 12.5L12.5 25L0 12.5z\"/%3E%3C/g%3E%3C/svg%3E')",
        
        // Gradient Overlays
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-home': '0 0 30px rgba(249, 115, 22, 0.2)',
        'glow-properties': '0 0 30px rgba(16, 185, 129, 0.2)',
        'glow-detail': '0 0 30px rgba(234, 179, 8, 0.2)',
        'glow-auth': '0 0 30px rgba(6, 182, 212, 0.2)',
        'glow-agent': '0 0 30px rgba(244, 63, 94, 0.2)',
        'glow-admin': '0 0 30px rgba(59, 130, 246, 0.2)',
        'glow-profile': '0 0 30px rgba(180, 83, 9, 0.2)',
        'glow-wishlist': '0 0 30px rgba(192, 38, 211, 0.2)',
        'glow-dashboard': '0 0 30px rgba(20, 184, 166, 0.2)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
