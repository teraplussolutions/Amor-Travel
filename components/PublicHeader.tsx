import { HeaderTopBar } from "@/components/HeaderTopBar";
import { PublicHeaderNav } from "@/components/PublicHeaderNav";

export function PublicHeader() {
  return (
    <header className="site-header">
      <HeaderTopBar />
      <PublicHeaderNav />
    </header>
  );
}
