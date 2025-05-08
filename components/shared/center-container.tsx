import React from 'react';

const CenterContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-dvh w-full flex justify-center items-center'>
      {children}
    </div>
  );
};

export default CenterContainer;
