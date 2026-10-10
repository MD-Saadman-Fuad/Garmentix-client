import React from 'react';
import authimage from '../assets/authImage.webp';
import Logo from '../Shared/Logo';

const AuthPageImage = () => {
  return (
   <div className='flex flex-col items-center'>
    <img
      src={authimage}
      alt="Authentication illustration"
      className='rounded-4xl h-155 w-155 mx-auto'
      loading="lazy"
      width={620}
      height={620}
    />
   </div>

  );
};

export default AuthPageImage;