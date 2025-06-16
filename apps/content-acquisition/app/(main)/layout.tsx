export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className='max-w-full'>{children} </main>
    </>
  );
}
