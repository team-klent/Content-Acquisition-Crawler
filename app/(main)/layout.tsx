import { SignedIn, SignOutButton, UserButton } from '@clerk/nextjs';

export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedIn>
        <header className='flex justify-end items-center p-4 gap-4 h-16'>
          <UserButton />
          <SignOutButton />
        </header>
      </SignedIn>
      <main>{children} </main>
    </>
  );
}
