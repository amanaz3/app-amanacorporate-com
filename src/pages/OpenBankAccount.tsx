import React from 'react';
import { Menu } from 'lucide-react';

const OpenBankAccount = () => {
  return (
    <div className="animate-slide-up-slow">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border/50 transition-all duration-300 shadow-sm">
        <header className="max-w-7xl mx-auto px-4 xs:px-6 py-3 xs:py-4 pl-safe-left pr-safe-right">
          <div className="flex items-center justify-between min-h-[44px]">
            <a 
              className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer" 
              aria-label="Go to home page" 
              href="/"
            >
              <div className="h-10 w-10 flex items-center justify-center">
                <img 
                  src="https://amanacorporate.com/uploads/company-logos/amana-corporate.png" 
                  alt="Amana Corporate Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                AMANA <span className="text-muted-foreground">CORPORATE</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
              <div 
                role="group" 
                dir="ltr" 
                className="flex items-center justify-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/30 cosmic-glass" 
                tabIndex={0} 
                style={{ outline: 'none' }}
              >
                <button 
                  type="button" 
                  data-state="on" 
                  role="radio" 
                  aria-checked="true" 
                  className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" 
                  aria-label="Navigate to Home" 
                  tabIndex={-1}
                >
                  Home
                </button>
                <button 
                  type="button" 
                  data-state="off" 
                  role="radio" 
                  aria-checked="false" 
                  className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" 
                  aria-label="Navigate to Business Partners" 
                  tabIndex={-1}
                >
                  Business Partners
                </button>
                <button 
                  type="button" 
                  data-state="off" 
                  role="radio" 
                  aria-checked="false" 
                  className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" 
                  aria-label="Navigate to Contact" 
                  tabIndex={-1}
                >
                  Contact
                </button>
              </div>
            </nav>

            <div className="md:hidden">
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target hover:text-accent-foreground h-9 text-xs p-2 min-h-[44px] min-w-[44px] touch-manipulation hover:bg-muted/80 hover:shadow-glow focus-visible:ring-2 focus-visible:ring-primary rounded-lg" 
                aria-expanded="false" 
                aria-controls="mobile-menu" 
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-primary text-primary-foreground hover:bg-primary/90 interactive-hover-scale shadow-md hover:shadow-lg h-10 py-2 text-sm custom-gradient-button min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary" 
                aria-label="Login to business banking portal"
              >
                Login
              </button>
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-gradient-primary text-primary-foreground shadow-md h-9 rounded-md text-xs min-h-[40px] px-6 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-105 font-semibold" 
                aria-label="Open a business account"
              >
                Open Account
              </button>
            </div>
          </div>
        </header>
      </div>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Open Your Business Bank Account</h1>
            <p className="text-center text-muted-foreground">
              Start your business banking journey with Amana Corporate
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenBankAccount;