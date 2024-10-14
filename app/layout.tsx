'use client'

import { useState, useEffect } from "react";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getAvailableRewards, getUserByEmail } from "@/utils/db/actions";
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({

  children,

}: Readonly<{
  children: React.ReactNode
}>){

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setTotalEarnings] = useState(0);

  useEffect(() => {

    // fetch total earning of user from the db when the component is mounted. Do when we have authenticatio and db function
    const fetchTotalEarnings = async() => {

      try {
        
        const userEmail = localStorage.getItem('userEmail');

        if(userEmail){

          const user = await getUserByEmail(userEmail);

          if(user){
            
            const availableRewards = await getAvailableRewards(user.id);
            setTotalEarnings(typeof availableRewards === 'number' ? availableRewards : 0);

          }
        }
      } catch (error) {

        console.error("Error fetching total earning:", error)
        
      }
    };

    fetchTotalEarnings();

  }, []);

  return (

    <html lang="en">

      <body className={inter.className}>

        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* header */}
            <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} /*totalEarnings={totalEarnings}*//>

            <div className="flex flex-1 "> {/*Flex container for main content area. Sidebar on left and main content on the right */}

              {/* sidebar */}
              <Sidebar open={sidebarOpen} />

              {/* main content */}
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                <Analytics/>
                {children}
              </main>

            </div>

          </div>

          <Toaster />
        </AuthProvider>

        
      </body>

    </html>
  )

}
