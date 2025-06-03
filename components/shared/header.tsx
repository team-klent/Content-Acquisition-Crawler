import DarkMainLogo from '@/public/images/MainLogo_DarkMode_Transparent.png';
import Image from 'next/image';

const Header = ({ children }: Readonly<{ children?: React.ReactNode }>) => {
  return (
    <div className='max-w-full bg-[#000000] px-[1.55rem] py-[0.20rem] flex flex-row'>
      <Image
        src={DarkMainLogo}
        alt='Innodata Main Logo'
        width={176}
        height={40}
      />
    </div>
  );
};

export default Header;
