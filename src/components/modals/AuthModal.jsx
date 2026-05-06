import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles } from "lucide-react";

import Button from "../Button";
import Input from "../Input";

export function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      onClose();
    }, 1200);
  };

  const decorativeHeight = isLogin ? "h-54" : "h-60";
  const circleHeight = isLogin ? "h-52" : "h-72";

  return (
    <div className="modal-backdrop">
      <div
        className="bg-white dark:bg-stone-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-bounce-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Background Elements */}
        <div
          className={`
            absolute top-0 left-0 w-full 
            ${decorativeHeight}
            bg-linear-to-br from-primary-100 to-accent-100 
            opacity-60 transition-all duration-500
          `}
        />

        <div
          className={`
            absolute -top-12 -right-12 
            w-40 ${circleHeight}
            bg-secondary-100 rounded-full blur-3xl 
            opacity-60 transition-all duration-500
          `}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 hover:bg-white/70 rounded-full transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-10 pb-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 mb-4 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-2 mt-4">
              {isLogin ? "Welcome back, scientist!" : "Start your journey!"}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium">
              {isLogin
                ? "Ready to continue your experiments?"
                : "Join the lab and start learning science the fun way."}
            </p>
          </div>

          {/* Form */}
          <div
            className={`
            transition-all duration-500
            ${
              isLogin
                ? "max-h-95 overflow-hidden"
                : "max-h-105 overflow-y-auto pr-2"
            }
          `}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Full Name"
                  placeholder="Marie Curie"
                  icon={<User className="w-5 h-5" />}
                  required
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="marie@science.lab"
                icon={<Mail className="w-5 h-5" />}
                // required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-5 h-5" />}
                // required
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
              )}

              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-6"
                isLoading={isLoading}
              >
                {isLogin ? "Enter Lab" : "Create Account"}
              </Button>
            </form>
          </div>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
