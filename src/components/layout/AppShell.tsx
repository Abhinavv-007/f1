import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-32 md:pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
