
import React from 'react';
import { ProfileForm } from '@/components/profile/profile-form';

const StudentProfile: React.FC = () => {
  return <ProfileForm isStudent={true} />;
};

export default StudentProfile;
