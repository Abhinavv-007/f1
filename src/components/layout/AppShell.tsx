import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-[9.5rem] md:pt-[6.75rem]">
        {children}
      </main>
      <Footer />
    </>
  );
}
