import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ChatBot } from './ChatBot';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-background-dark">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
        <ChatBot />
      </main>
    </div>
  );
};