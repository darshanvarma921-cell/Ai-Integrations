import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { BelowFold } from "@/components/landing/below-fold";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080D]">
      <Navbar />
      <Hero />
      <TrustStrip />
      <BelowFold />
    </main>
  );
}
