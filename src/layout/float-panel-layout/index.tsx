function FloatPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-grow items-stretch justify-center px-2 sm:items-center">
      {children}
    </main>
  );
}

export default FloatPanelLayout;
