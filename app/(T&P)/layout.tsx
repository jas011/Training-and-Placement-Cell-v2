import Navbar from "@/app/components/Navbar";
import { ReactNode } from "react";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mt-36 relative">{children}</div>
    </>
  );
}
