// app/fonts.ts
import localFont from 'next/font/local';

export const leagueSpartan = localFont({
  src: [
    {
      path: '../public/fonts/League_Spartan_Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/League_Spartan_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/League_Spartan_Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-league-spartan',
  display: 'swap',
});
