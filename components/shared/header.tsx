import Image from 'next/image';

const Header = ({ children }: Readonly<{ children?: React.ReactNode }>) => {
  return (
    <div className='max-w-full bg-[#000000] px-[1.55rem] py-[0.275rem] flex flex-row'>
      <Image
        src='/images/MainLogo_DarkMode_Transparent.png'
        alt='Innodata Main Logo'
        width={176}
        height={40}
      />
      {children}
    </div>
  );
};

export default Header;
