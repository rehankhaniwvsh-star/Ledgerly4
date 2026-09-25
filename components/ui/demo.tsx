import React, { useState } from 'react';
import { SignInPage, Testimonial } from '@/components/ui/sign-in';

export const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    name: 'Sarah Chen',
    handle: '@sarahdigital',
    text: 'Amazing platform! The user experience is seamless and the billing features are exactly what our studio needed.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    name: 'Marcus Johnson',
    handle: '@marcustech',
    text: 'This service transformed how our team handles invoices and clients. Clean design, powerful features, and fast payments.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    name: 'David Martinez',
    handle: '@davidcreates',
    text: "I've tried many billing platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
  },
];

export const SignInPageDemo: React.FC<{
  onSignInSuccess?: (email: string) => void;
  onGoogleSignIn?: () => void;
  onNavigateHome?: () => void;
  onCreateAccount?: () => void;
  onResetPassword?: () => void;
}> = ({
  onSignInSuccess,
  onGoogleSignIn,
  onNavigateHome,
  onCreateAccount,
  onResetPassword,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get('email') as string) || '';
    const password = (formData.get('password') as string) || '';
    console.log('Sign In submitted:', { email, passwordLength: password.length });

    if (onSignInSuccess) {
      onSignInSuccess(email);
    } else {
      showNotification(`Signed in successfully as ${email}`);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Continue with Google clicked');
    if (onGoogleSignIn) {
      onGoogleSignIn();
    } else {
      showNotification('Google Sign-In initiated');
    }
  };

  const handleResetPassword = () => {
    if (onResetPassword) {
      onResetPassword();
    } else {
      showNotification('Password reset link sent to your registered email address.');
    }
  };

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      showNotification('Navigating to Account Registration...');
    }
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      {/* Optional Top Nav / Back button for demo */}
      {onNavigateHome && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/80 backdrop-blur-md border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            ← Back to Home
          </button>
        </div>
      )}

      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-bounce bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium">
          {notification}
        </div>
      )}

      <SignInPage
        title={<span className="font-semibold tracking-tight text-foreground">Welcome Back</span>}
        description="Access your workspace and continue managing your invoices effortlessly"
        heroImageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
