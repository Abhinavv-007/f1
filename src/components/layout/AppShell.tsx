import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* Offset for fixed navbar + general container sizing */}
      <main className="flex-1 w-full flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
