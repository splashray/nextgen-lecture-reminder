
import React from 'react';
import { SignInForm } from '@/components/auth/sign-in-form';
import { GraduationCap } from 'lucide-react';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-700 mb-2">NextGen Lecture Reminder</h1>
        <p className="text-gray-600">Sign in to access your personalized dashboard</p>
      </div>
      <SignInForm />
    </div>
  );
};

export default AuthPage;
