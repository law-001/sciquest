import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User, Sparkles } from 'lucide-react';
import  Card  from '../components/Card';
import  Input  from '../components/Input';
import  Button  from '../components/Button';

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#fdf6e3] dark:bg-stone-900">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Left side: Text & Illustration */}
          <div className="md:col-span-2 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-100 text-secondary-600 mb-6 shadow-warm animate-bounce-in">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">
              Let's get in <span className="text-secondary-500">touch!</span>
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
              Have questions about the platform? Found a bug in your experiment?
              Or just want to say hi? We'd love to hear from you!
            </p>

            <div className="hidden md:block bg-white dark:bg-stone-800 p-6 rounded-3xl border border-orange-100 dark:border-stone-700 shadow-card relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-100 rounded-full opacity-50" />
              <Sparkles className="w-8 h-8 text-accent-500 mb-4 relative z-10" />
              <p className="font-bold text-stone-800 dark:text-stone-200 relative z-10">
                "Science is a collaborative effort. Don't hesitate to reach out!"
              </p>
            </div>
          </div>

          {/* Right side: Form */}
          <div className="md:col-span-3">
            <Card className="p-8 md:p-10 shadow-xl border-0 ring-1 ring-orange-100">
              {isSubmitted ? (
                <div className="text-center py-12 animate-bounce-in">
                  <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-secondary-500 ml-1" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 mb-8">
                    Thanks for reaching out. Our team of scientists will get
                    back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6">
                    Send us a message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      placeholder="Albert Einstein"
                      icon={<User className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="albert@physics.lab"
                      icon={<Mail className="w-5 h-5" />}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 font-heading">
                      Your Message
                    </label>
                    <textarea
                      className="w-full rounded-xl border-2 border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-4 py-3 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all min-h-150px resize-y"
                      placeholder="Tell us what's on your mind..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}