import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/SecureAuthContext';
import Logo from '@/components/Logo';

interface NavItem {
  id: string;
  label: string;
  isRoute?: boolean;
  path?: string;
}

const Header = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', isRoute: true, path: '/' },
    { id: 'partners', label: 'Business Partners', isRoute: true, path: '/partners' },
    { id: 'contact', label: 'Contact', isRoute: true, path: '/contact' }
  ];

  // Update active page based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/partners') {
      setActivePage('partners');
    } else if (currentPath === '/contact') {
      setActivePage('contact');
    } else if (currentPath === '/') {
      setActivePage('home');
    }
  }, [location.pathname]);
  
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
  }, []);

  const handleNavClick = (item: NavItem) => {
    setActivePage(item.id);
    
    if (item.isRoute && item.path) {
      navigate(item.path);
    } else {
      // Handle scroll to section for non-route items
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <div className={`sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border/50 transition-all duration-300 ${mobileMenuOpen ? 'shadow-lg' : 'shadow-sm'}`}>
        <header className="max-w-7xl mx-auto px-4 xs:px-6 py-3 xs:py-4 pl-safe-left pr-safe-right">
          <div className="flex items-center justify-between min-h-[44px]">
            <Logo />

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
              <ToggleGroup 
                type="single" 
                value={activePage} 
                onValueChange={(value) => {
                  if (value) {
                    const item = navItems.find(nav => nav.id === value);
                    if (item) handleNavClick(item);
                  }
                }}
                className="bg-muted/50 p-1 rounded-xl border border-border/30 cosmic-glass"
              >
                {navItems.map((item) => (
                  <ToggleGroupItem 
                    key={item.id} 
                    value={item.id} 
                    className="nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </nav>

            {/* Mobile Menu Button - Enhanced */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="p-2 min-h-[44px] min-w-[44px] touch-manipulation hover:bg-muted/80 hover:shadow-glow focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Menu - Enhanced with better visual feedback */}
            {mobileMenuOpen && (
              <>
                {/* Mobile menu backdrop */}
                <div 
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                
                <div 
                  id="mobile-menu"
                  className="absolute top-full left-0 right-0 md:hidden bg-card/95 border-b border-border/50 shadow-xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto ios-scroll-fix cosmic-glass animate-in slide-in-from-top-2 duration-200"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation menu"
                >
                  <nav className="max-w-7xl mx-auto px-4 xs:px-6 py-6 space-y-3 pl-safe-left pr-safe-right" role="navigation">
                    {navItems.map((item, index) => (
                      <button
                        key={item.id}
                        className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-medium transform hover:scale-[1.02] ${
                          activePage === item.id
                            ? 'bg-gradient-primary text-primary-foreground shadow-glow scale-[1.02]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm'
                        }`}
                        onClick={() => {
                          handleNavClick(item);
                          setMobileMenuOpen(false);
                        }}
                        aria-current={activePage === item.id ? 'page' : undefined}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item.label}
                      </button>
                    ))}

                    {/* Mobile Action Buttons - Enhanced with always visible Open Account */}
                    <div className="pt-6 space-y-4 border-t border-border/50">
                      {user ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary cosmic-glass hover:scale-[1.02] transition-all duration-200"
                            onClick={() => {
                              navigate('/apply');
                              setMobileMenuOpen(false);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                          <Button 
                            variant="ghost"
                            className="w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02] transition-all duration-200"
                            onClick={handleSignOut}
                          >
                            Sign Out
                          </Button>
                          {/* Always show Open Account CTA even when logged in */}
                          <Button 
                            variant="premium"
                            className="w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02] transition-all duration-200 shadow-glow font-semibold"
                            onClick={() => {
                              navigate('/apply');
                              setMobileMenuOpen(false);
                            }}
                          >
                            Open New Account
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            onClick={() => {
                              window.open('https://business-bank-account.amanacorporate.com', '_blank', 'noopener,noreferrer');
                              setMobileMenuOpen(false);
                            }}
                            className="custom-gradient-button w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <LogIn className="h-4 w-4" />
                            Login
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary cosmic-glass hover:scale-[1.02] transition-all duration-200"
                            onClick={() => {
                              navigate('/track');
                              setMobileMenuOpen(false);
                            }}
                          >
                            Track Application
                          </Button>
                          <Button 
                            variant="premium"
                            className="w-full min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary hover:scale-[1.02] transition-all duration-200 shadow-glow font-semibold"
                            onClick={() => {
                              if (location.pathname.includes('partner')) {
                                navigate('/partners/apply');
                              } else {
                                navigate('/apply');
                              }
                              setMobileMenuOpen(false);
                            }}
                          >
                            {location.pathname.includes('partner') ? 'Become Partner' : 'Open Account'}
                          </Button>
                        </>
                      )}
                    </div>
                  </nav>
                </div>
              </>
            )}

            {/* Desktop Auth & CTA Buttons - Enhanced with Prominent Open Account */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/apply')}
                    className="min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 hover:shadow-glow"
                    aria-label="Apply for Business Account"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </Button>
                  {/* Always show Open Account CTA even when logged in */}
                  <Button 
                    variant="premium"
                    size="sm"
                    onClick={() => navigate('/apply')}
                    className="min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-105 animate-pulse"
                    aria-label="Open a new business account"
                  >
                    Open Account
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      window.open('https://business-bank-account.amanacorporate.com', '_blank', 'noopener,noreferrer');
                    }}
                    className="custom-gradient-button min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Login to business banking portal"
                  >
                    Login
                  </Button>
                  {/* Enhanced prominent Open Account button */}
                  <Button 
                    variant="premium"
                    size="sm"
                    onClick={() => {
                      if (location.pathname.includes('partner')) {
                        navigate('/partners/apply');
                      } else {
                        navigate('/apply');
                      }
                    }}
                    className="min-h-[40px] px-6 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-105 font-semibold"
                    aria-label={location.pathname.includes('partner') ? 'Become a partner' : 'Open a business account'}
                  >
                    {location.pathname.includes('partner') ? 'Become Partner' : 'Open Account'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;