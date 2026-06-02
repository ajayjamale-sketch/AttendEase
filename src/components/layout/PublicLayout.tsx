import { ReactNode } from "react";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </div>
  );
};
