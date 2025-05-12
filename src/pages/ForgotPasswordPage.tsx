
import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">NextGen Lecture Reminder</h1>
        <p className="text-gray-600">Reset your password</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
