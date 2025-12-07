import { ReactNode } from 'react';
import { ManagerSidebar } from './ManagerSidebar';
import { TopNavbar } from './TopNavbar';
import { Footer } from './Footer';
import { SidebarProvider } from '@/contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex flex-col">
        <div className="flex flex-1">
          <ManagerSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNavbar />
            <main className="flex-1 overflow-auto">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};
