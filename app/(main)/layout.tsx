export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className='h-dvh w-full'>{children} </main>
    </>
  );
}
