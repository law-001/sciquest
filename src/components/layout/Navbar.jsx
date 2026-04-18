import React, { useState } from 'react';
import Logo  from '../Logo';          // Adjust path if needed
import Button from '../Button';

export function Navbar({ 
  currentView, 
  onNavigate, 
  isLoggedIn, 
  onLoginClick, 
  onLogoutClick 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Lessons', view: 'lessons' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view) => {
    onNavigate(view);
    setIsMenuOpen(false);        // Close mobile menu after click
  };

  return (
    <nav className="bg-primary-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div>
              <Logo className="animate-[spin_5s_linear_infinite] text-orange-500" />
            </div>
            <div>
              <span className="font-heading font-black text-2xl tracking-tight">SciQuest</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-bold font-heading transition-colors hover:text-primary-600 
                  ${currentView === item.view ? 'text-primary-600' : 'text-stone-700'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Button variant="outline" onClick={onLogoutClick} size = 'sm'>
                Logout
              </Button>
            ) : (
              <Button onClick={onLoginClick} size ='sm'>
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            variant="ghost"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#57534E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12v12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#57534E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-stone-200">
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-left transition-colors ${
                    currentView === item.view ? 'text-primary-600 font-bold' : 'text-zinc-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-stone-200">
                {isLoggedIn ? (
                  <Button 
                    onClick={onLogoutClick}
                    className="w-full"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button 
                    onClick={onLoginClick}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl"
                  >
                    Login / Sign Up
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}