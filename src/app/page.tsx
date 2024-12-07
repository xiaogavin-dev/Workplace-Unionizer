'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { useEffect } from 'react';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import './home.css';

interface User {
  displayName?: string;
  uid: string;
  email: string;
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user }: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  } = useAppSelector((state) => state.auth);

  // Redirect logged-in users to /search
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/search'); 
    }
  }, [isAuthenticated, isLoading, router]);

  // Render a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p> 
      </div>
    );
  }

  // Render home page only for unauthenticated users
  return (
    <>
      <HorizontalNavbar pageName="/" />
      <div className="page-container">
        {/* Background Image */}
        <div className="background"></div>

        {/* Main Content */}
        <main className="content">
          <div className="card">
            {!isAuthenticated && (
              <ul>
                <li>
                  <h1 className="header">Already have an account? </h1>
                  <Link href={"/auth/login"}>
                    <button className="login-button">Login</button>
                  </Link>
                </li>
                <li>
                  <h1 className="header">New to Unionizer?</h1>
                  <Link href={"/auth/signup"}>
                    <button className="signup-button">Create an account</button>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
