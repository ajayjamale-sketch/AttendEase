import { ReactNode } from "react";
import { PublicNav } from "./PublicNav";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>{children}</main>
    </div>
  );
};
