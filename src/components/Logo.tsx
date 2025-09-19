import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-3 transition-opacity hover:opacity-80 cursor-pointer"
      aria-label="Go to home page"
    >
      <div className="h-10 w-10 flex items-center justify-center">
        <img 
          src="/lovable-uploads/5ccffe54-41ae-4fc6-9a3a-3843049b907b.png" 
          alt="Amana Corporate Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        AMANA <span className="text-muted-foreground">CORPORATE</span>
      </span>
    </Link>
  );
};

export default Logo;