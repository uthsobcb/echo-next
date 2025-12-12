# Echo Design Guide

## Overview

Echo is a compassionate AI-powered journaling companion with a clean, calming, and modern design philosophy. This guide outlines the design system, UI patterns, and brand guidelines for the Echo platform.

## Brand Identity

### Mission
"Duolingo for your mind" - Echo makes mental wellness and self-reflection accessible, engaging, and habit-forming through intelligent journaling.

### Personality
- **Empathetic** - Understanding and non-judgmental
- **Supportive** - Encouraging growth and self-awareness  
- **Intelligent** - AI-powered insights and personalization
- **Calming** - Peaceful and stress-reducing experience
- **Approachable** - Simple and user-friendly

---

## Color Palette

### Primary Colors
```css
/* Main Brand Blue */
--primary-blue: #4A90E2;        /* Primary CTA and accent color */
--primary-blue-hover: #357ABD;  /* Hover state for primary blue */

/* Indigo Variations */
--indigo-800: #1e3a8a;         /* Navigation text and headings */
--indigo-600: #2563eb;         /* Interactive elements */

/* Cyan Variations */  
--cyan-900: #164e63;           /* Navigation links */
--cyan-700: #0e7490;           /* Navigation hover states */
```

### Secondary Colors
```css
/* Background Colors */
--background-primary: #f0f8ff;   /* AliceBlue - main background */
--background-card: #ffffff;      /* White cards and containers */
--background-secondary: #f8f9fa; /* Light gray sections */
--background-overlay: rgba(255, 255, 255, 0.9); /* Semi-transparent overlays */

/* Text Colors */
--text-primary: #333333;        /* Main text color */
--text-secondary: #555555;      /* Secondary text */
--text-muted: #777777;         /* Muted text and descriptions */
--text-light: #aaaaaa;         /* Light text and metadata */
```

### Accent Colors
```css
/* Gradient Colors */
--gradient-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-blue: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
--gradient-warm: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%);

/* Status Colors */
--success: #22c55e;            /* Success states */
--warning: #f59e0b;            /* Warning states */
--error: #ef4444;              /* Error states */
--info: #3b82f6;               /* Information states */
```

### Mood-Based Colors
```css
/* Mood Visualization */
--mood-empty: #e6f0fa;         /* No data */
--mood-light: #c6dbef;         /* Light mood intensity */
--mood-medium: #9ecae1;        /* Medium mood intensity */
--mood-strong: #6baed6;        /* Strong mood intensity */
--mood-intense: #2171b5;       /* Intense mood activity */
```

---

## Typography

### Font Stack
```css
/* Primary Font */
body {
  font-family: Arial, Helvetica, sans-serif;
}

/* Custom Fonts */
.font-handwriting {
  font-family: 'sophie', cursive;  /* For personal, handwritten feel */
}

.font-sacramento {
  font-family: 'Sacramento', cursive; /* For elegant headings */
}

.font-inter {
  font-family: 'Inter', sans-serif; /* Modern, clean alternative */
}
```

### Typography Scale
```css
/* Headings */
.text-3xl { font-size: 1.875rem; }    /* 30px - Main headings */
.text-2xl { font-size: 1.5rem; }      /* 24px - Section headings */  
.text-xl { font-size: 1.25rem; }      /* 20px - Subsection headings */
.text-lg { font-size: 1.125rem; }     /* 18px - Large body text */

/* Body Text */
.text-base { font-size: 1rem; }       /* 16px - Default body text */
.text-sm { font-size: 0.875rem; }     /* 14px - Small text */
.text-xs { font-size: 0.75rem; }      /* 12px - Metadata and captions */

/* Font Weights */
.font-extrabold { font-weight: 800; } /* Brand name and hero text */
.font-bold { font-weight: 700; }      /* Important headings */
.font-semibold { font-weight: 600; }  /* Button text and emphasis */
.font-medium { font-weight: 500; }    /* Subheadings */
.font-normal { font-weight: 400; }    /* Body text */
```

---

## Layout & Spacing

### Container Widths
```css
/* Responsive Containers */
.container-narrow { max-width: 600px; }   /* Email templates, forms */
.container-medium { max-width: 768px; }   /* Content pages */  
.container-wide { max-width: 1024px; }    /* Dashboard layouts */
.container-full { max-width: 1280px; }    /* Landing pages */

/* Navigation Container */
.nav-container { 
  max-width: 66.666667%; /* lg:w-2/3 */
  width: 100%;
  margin: 0 auto;
}
```

### Spacing System
```css
/* Margin/Padding Scale (Tailwind-based) */
.spacing-xs { margin/padding: 0.25rem; }   /* 4px */
.spacing-sm { margin/padding: 0.5rem; }    /* 8px */
.spacing-md { margin/padding: 0.75rem; }   /* 12px */
.spacing-lg { margin/padding: 1rem; }      /* 16px */
.spacing-xl { margin/padding: 1.25rem; }   /* 20px */
.spacing-2xl { margin/padding: 1.5rem; }   /* 24px */
.spacing-3xl { margin/padding: 2rem; }     /* 32px */
.spacing-4xl { margin/padding: 2.5rem; }   /* 40px */
```

### Grid System
```css
/* Common Grid Layouts */
.grid-2-col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  padding: 0.75rem 1.875rem;          /* 12px 30px */
  border-radius: 0.5rem;              /* 8px */
  font-size: 1rem;                    /* 16px */
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  color: #2563eb;                     /* Blue-600 */
  border: 1px solid #2563eb;
  background: transparent;
  padding: 0.625rem 1.25rem;         /* 10px 20px */
  border-radius: 0.75rem;            /* 12px */
  font-size: 0.875rem;               /* 14px */
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #dbeafe;               /* Blue-50 */
  color: #1d4ed8;                    /* Blue-700 */
}
```

#### Icon Button
```css
.btn-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;                       /* 8px */
  padding: 0.5rem 1rem;             /* 8px 16px */
  border-radius: 0.5rem;             /* 8px */
  transition: all 0.2s ease;
}

.btn-icon:hover .icon {
  transform: scale(1.1);
}
```

### Cards

#### Basic Card
```css
.card {
  background: white;
  border-radius: 0.75rem;            /* 12px */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.5rem;                   /* 24px */
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

#### Feature Card (Landing Page)
```css
.feature-card {
  background: white;
  border-radius: 1rem;               /* 16px */
  padding: 2rem;                     /* 32px */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

#### Entry Card
```css
.entry-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.5rem;             /* 24px */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2.5rem;                   /* 40px */
  margin: 1rem 0;                    /* 16px vertical */
  backdrop-filter: blur(10px);
}
```

### Navigation

#### Main Navigation
```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;                     /* 16px */
  background: #f9fafb;              /* Gray-50 */
  border-radius: 0.75rem;            /* 12px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin: 0.75rem;                   /* 12px */
}

.nav-link {
  color: #164e63;                    /* Cyan-900 */
  font-size: 0.875rem;               /* 14px */
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #0e7490;                    /* Cyan-700 */
}
```

#### Mobile Menu
```css
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 50;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-content {
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  width: 80%;
  height: 100%;
  padding: 1.5rem;
  overflow-y: auto;
}
```

### Forms

#### Input Fields
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;             /* 12px 16px */
  border: 1px solid #d1d5db;         /* Gray-300 */
  border-radius: 0.5rem;             /* 8px */
  font-size: 1rem;                   /* 16px */
  transition: all 0.2s ease;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.input-field:invalid {
  border-color: #ef4444;             /* Red-500 */
}
```

#### Form Labels
```css
.form-label {
  display: block;
  font-size: 0.875rem;               /* 14px */
  font-weight: 500;
  color: #374151;                    /* Gray-700 */
  margin-bottom: 0.5rem;             /* 8px */
}
```

### Profile & Avatar

#### Profile Avatar
```css
.avatar {
  border-radius: 50%;
  border: 2px solid #d1d5db;         /* Gray-300 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-small {
  width: 2rem;                       /* 32px */
  height: 2rem;
}

.avatar-medium {
  width: 3.125rem;                   /* 50px */
  height: 3.125rem;
}

.avatar-large {
  width: 4rem;                       /* 64px */
  height: 4rem;
}
```

#### Badge System
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;                       /* 8px */
  padding: 0.375rem 0.75rem;         /* 6px 12px */
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border-radius: 1rem;               /* 16px */
  font-size: 0.75rem;                /* 12px */
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}
```

---

## UI Patterns

### Loading States
```css
.loading-spinner {
  border: 3px solid #f3f4f6;        /* Gray-100 */
  border-top: 3px solid #4A90E2;
  border-radius: 50%;
  width: 3rem;                       /* 48px */
  height: 3rem;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4A90E2;
  font-size: 1.125rem;               /* 18px */
  font-weight: 600;
  margin-left: 1rem;                 /* 16px */
}
```

### Animations
```css
/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

/* Slide Right Animation */
@keyframes slideRight {
  from { 
    transform: translateX(-100%);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-right {
  animation: slideRight 0.3s ease-out;
}

/* Hover Lift Effect */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

### Status Indicators
```css
.status-indicator {
  display: inline-block;
  width: 0.75rem;                    /* 12px */
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;              /* 8px */
}

.status-online {
  background: #22c55e;              /* Green-500 */
}

.status-offline {
  background: #6b7280;              /* Gray-500 */
}

.status-busy {
  background: #f59e0b;              /* Amber-500 */
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* xs: 0px - 475px */
/* sm: 476px - 640px */
/* md: 641px - 768px */
/* lg: 769px - 1024px */
/* xl: 1025px - 1280px */
/* 2xl: 1281px+ */

@media (max-width: 640px) {
  .container {
    width: 100% !important;
    padding: 1.25rem !important;     /* 20px */
  }
  
  .grid-responsive {
    grid-template-columns: 1fr !important;
  }
  
  .text-responsive {
    font-size: 1.375rem !important;  /* 22px */
  }
  
  .nav-desktop {
    display: none !important;
  }
  
  .nav-mobile {
    display: block !important;
  }
}
```

### Mobile-Specific Patterns
```css
/* Mobile Navigation */
.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;                      /* 12px */
  padding: 0.75rem;                  /* 12px */
  color: #d1d5db;                    /* Gray-300 */
  border-radius: 0.5rem;             /* 8px */
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background: rgba(55, 65, 81, 0.5); /* Gray-700 with opacity */
  color: white;
}

/* Touch-Friendly Buttons */
.btn-touch {
  min-height: 2.75rem;               /* 44px - iOS minimum */
  min-width: 2.75rem;
  padding: 0.75rem 1.5rem;           /* 12px 24px */
}
```

---

## Email Templates

### Email Container
```css
.email-container {
  background: linear-gradient(135deg, #f6f9fc 0%, #f1f4f8 100%);
  padding: 3.125rem 1.25rem;         /* 50px 20px */
  text-align: center;
  font-family: Arial, sans-serif;
}

.email-content {
  max-width: 37.5rem;                /* 600px */
  background: white;
  padding: 2.5rem;                   /* 40px */
  border-radius: 0.9375rem;          /* 15px */
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.08);
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.email-header {
  background: #4A90E2;
  padding: 1.25rem;                  /* 20px */
  border-radius: 0.625rem;           /* 10px */
  margin-bottom: 1.875rem;           /* 30px */
}

.email-title {
  color: white;
  margin: 0;
  font-size: 1.75rem;                /* 28px */
  letter-spacing: 0.0625rem;         /* 1px */
}
```

### Email Responsive Design
```css
@media only screen and (max-width: 600px) {
  .email-container {
    width: 100% !important;
    padding: 1.25rem !important;     /* 20px */
  }

  .email-insight-box {
    display: block !important;
    width: 100% !important;
    margin-bottom: 0.9375rem !important; /* 15px */
  }

  .email-cta-button {
    display: block !important;
    width: 100% !important;
    text-align: center !important;
  }

  .email-header-text {
    font-size: 1.375rem !important;  /* 22px */
  }
}
```

---

## Content Guidelines

### Voice & Tone
- **Warm and encouraging**: "You're doing great! Keep journaling!"
- **Non-judgmental**: Avoid clinical language or diagnostic terms
- **Supportive**: Focus on growth and self-compassion  
- **Personal**: Use "you" and "your" to create connection
- **Conversational**: Write as a caring friend would speak

### Microcopy Examples
```
// Button Text
"Start Journaling" (not "Submit Entry")
"View My Progress" (not "See Data")
"Chat with Echo" (not "Open Chatbot")

// Success Messages  
"Entry saved! Echo is analyzing your mood..." 
"Welcome to Echo! Ready to start your journey?"
"Profile updated successfully. Keep being awesome!"

// Error Messages
"Oops! Something went wrong. Please try again."
"We couldn't save your entry. Check your connection."
"Entry not found. It might have been deleted."

// Empty States
"No entries yet. Ready to write your first one?"
"Your chat history will appear here once you start talking with Echo."
"No todos right now. Echo might suggest some based on your next entry!"
```

### Emoji Usage
Echo uses emojis thoughtfully to add warmth and personality:

```
📊 - Reports and analytics
🌟 - Achievements and highlights  
💫 - Encouragement and motivation
📖 - Journaling and entries
🤖 - AI-related features
🌈 - Mood and emotions
☁️ - Echo brand (cloud theme)
✨ - Magic and AI insights
💡 - Tips and suggestions
🎉 - Celebrations and milestones
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Important UI elements meet AAA standards (7:1 ratio)
- Never rely solely on color to convey information

### Focus Management
```css
.focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Implement ARIA labels for interactive elements
- Ensure keyboard navigation works for all features
- Provide alt text for all images and icons

---

## Performance Guidelines

### Image Optimization
- Use WebP format when possible, with fallbacks
- Implement responsive images with `srcset`
- Lazy load images below the fold
- Optimize avatar images (32px, 50px, 64px sizes)

### Loading States
- Show skeleton screens for content areas
- Display progress indicators for long operations
- Implement optimistic UI updates where appropriate

### CSS Optimization
- Use CSS custom properties for consistent theming
- Minimize layout shifts with proper sizing
- Implement smooth transitions (max 300ms)
- Use hardware acceleration for animations (`transform`, `opacity`)

---

This design guide serves as the foundation for maintaining consistency and quality across the Echo platform. It should be referenced when implementing new features, updating existing components, or creating marketing materials.
