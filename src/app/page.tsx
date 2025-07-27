"use client";

import { ThemeProvider } from '@/context/ThemeContext';
import ProfileSection from '@/components/ProfileSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import ThemeSelector from '@/components/ThemeSelector';
import BlogSection from '@/components/BlogSection';
import Badge from '@/components/Badge';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';

const App = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

const MainContent = () => {
  return (
    <>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold logo">DevSpace.me</h1>
        <ThemeSelector />
      </header>

      <main className="container mx-auto px-4 py-8">
        <ProfileSection theme={{
          bg: '',
          text: '',
          primary: '',
          secondary: ''
        }} />
        <ProjectsSection theme={{
          bg: '',
          text: '',
          primary: '',
          secondary: ''
        }} />
        <BlogSection theme={{
          bg: '',
          text: '',
          primary: '',
          secondary: ''
        }} />
        <ContactSection theme={{
          bg: '',
          text: '',
          primary: '',
          secondary: ''
        }} />
      </main>

      <footer className="container mx-auto px-4 py-6 text-center">
        <p>© {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
      </footer>

      <div className='fixed bottom-8 right-8 z-50'>
        <Link href="/home">
          <Badge className="w-[180px]">
            <Marquee autoFill pauseOnHover>
              • Create Your Own &nbsp;&nbsp;
            </Marquee>
          </Badge>
        </Link>
      </div>
    </>
  );
};

export default App;