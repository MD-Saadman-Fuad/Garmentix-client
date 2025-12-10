import React from 'react';
import authimage from '../assets/authImage.png';
import Logo from '../Shared/Logo';

const AuthPageImage = () => {
  return (
   <div className='flex flex-col items-center'>
    <img src={authimage} alt="Authentication" className='rounded-4xl h-155 w-155 mx-auto' />
   </div>

  );
};

export default AuthPageImage;