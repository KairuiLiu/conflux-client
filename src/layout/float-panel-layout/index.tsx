function FloatPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-grow items-center justify-center px-2">
      {children}
    </main>
  );
}

export default FloatPanelLayout;
