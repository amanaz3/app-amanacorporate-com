import React from 'react';
import { Menu, Phone, Mail, MapPin, Clock } from 'lucide-react';
import BankAccountApplicationForm from '@/components/forms/BankAccountApplicationForm';
const OpenBankAccount = () => {
  return <div className="animate-slide-up-slow">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 border-b border-border/50 transition-all duration-300 shadow-sm">
        <header className="max-w-7xl mx-auto px-4 xs:px-6 py-3 xs:py-4 pl-safe-left pr-safe-right">
          <div className="flex items-center justify-between min-h-[44px]">
            <a className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer" aria-label="Go to home page" href="/">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src="https://amanacorporate.com/uploads/company-logos/amana-corporate.png" alt="Amana Corporate Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                AMANA <span className="text-muted-foreground">CORPORATE</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center" role="navigation" aria-label="Main navigation">
              <div role="group" dir="ltr" className="flex items-center justify-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/30 cosmic-glass" tabIndex={0} style={{
                outline: 'none'
              }}>
                <a href="https://amanacorporate.com/" target="_self" type="button" data-state="on" role="radio" aria-checked="true" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Home" tabIndex={-1}>
                  Home
                </a>
                <a href="https://amanacorporate.com/partners" type="button" data-state="off" role="radio" aria-checked="false" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Business Partners" tabIndex={-1}>
                  Business Partners
                </a>
                <a href="https://amanacorporate.com/contact" type="button" data-state="off" role="radio" aria-checked="false" className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-transparent h-10 nav-pill-item data-[state=on]:bg-card data-[state=on]:shadow-glow data-[state=on]:text-primary transition-all duration-200 min-h-[40px] px-4 text-fluid-sm font-medium touch-manipulation hover:bg-card/80 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg" aria-label="Navigate to Contact" tabIndex={-1}>
                  Contact
                </a>
              </div>
            </nav>

            <div className="md:hidden">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target hover:text-accent-foreground h-9 text-xs p-2 min-h-[44px] min-w-[44px] touch-manipulation hover:bg-muted/80 hover:shadow-glow focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open mobile menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-primary text-primary-foreground hover:bg-primary/90 interactive-hover-scale shadow-md hover:shadow-lg h-10 py-2 text-sm custom-gradient-button min-h-[40px] px-4 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary" aria-label="Login to business banking portal">
                Login
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target bg-gradient-primary text-primary-foreground shadow-md h-9 rounded-md text-xs min-h-[40px] px-6 touch-manipulation focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 shadow-glow hover:shadow-xl hover:scale-105 font-semibold" aria-label="Open a business account">
                Open Account
              </button>
            </div>
          </div>
        </header>
      </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
            <div className="space-y-6">
              <div className="text-center">
                
                
              </div>
              
              <BankAccountApplicationForm />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="w-full bg-muted/30 border-t border-border/50">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <a className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer" aria-label="Go to home page" href="/">
                    <div className="h-10 w-10 flex items-center justify-center">
                      <img src="https://amanacorporate.com/uploads/company-logos/amana-corporate.png" alt="Amana Corporate Logo" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                      AMANA <span className="text-muted-foreground">CORPORATE</span>
                    </span>
                  </a>
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed max-w-md">
                    UAE business banking specialists providing 100% guaranteed company formation and corporate bank account opening services across Dubai, Abu Dhabi, and the UAE.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <a href="tel:+97142637666" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <span>+971 4 263 7666</span>
                    </a>
                    <a href="mailto:info@amanacorporate.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span>info@amanacorporate.com</span>
                    </a>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span>Wafi Residence Office Block - LHEU, Umm Hurair 2, Al Razi Street Dubai Healthcare City, Dubai, UAE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Services</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/apply">Business Banking</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/about">Bank Services</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/track">Track Application</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/start-business-bank-account-uae">UAE Banking</a></li>
                  </ul>
                </nav>
                
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Company</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/about">About Us</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/contact">Contact</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/faq">FAQ</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/partners">Partners</a></li>
                  </ul>
                </nav>
                
                <nav className="space-y-4">
                  <h4 className="font-semibold text-foreground text-sm">Legal & Compliance</h4>
                  <ul className="space-y-3">
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/privacy">Privacy Policy</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/terms">Terms of Service</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/cookies">Cookie Policy</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/compliance">Compliance</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/disclaimer">Disclaimer</a></li>
                    <li><a className="text-sm text-muted-foreground hover:text-primary transition-colors" href="/legal/aml-policy">AML Policy</a></li>
                  </ul>
                </nav>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Follow Us</h4>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <a href="https://ae.linkedin.com/company/amanacorporate" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://x.com/CorporateAmana" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Twitter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.01z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/AMANACorporateService" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/amanacorporate/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all duration-200" aria-label="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="m16.5 7.5h.01" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <h4 className="font-semibold text-foreground text-sm mb-2">Business Hours</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2 justify-center md:justify-end">
                      <Clock className="h-3 w-3" />
                      <span>Mon - Sat: 9:00 AM - 5:00 PM (UAE Time)</span>
                    </div>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  © 2025 <strong>AMANA CORPORATE SERVICES L.L.C.</strong> All rights reserved. | Licensed Corporate Services Provider in UAE
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>;
};
export default OpenBankAccount;