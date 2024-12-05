'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { useEffect } from 'react';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import './home.css'

interface User {
  displayName?: string,
  uid: string,
  email: string
}
export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user }: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <HorizontalNavbar pageName="/" />
      <div className="page-container">
        {/* Background Image */}
        <div className="background"></div>

        {/* Main Content */}
        <main className="content">
          <div className="card">
            {isAuthenticated != null ? (
              user ? (
                user.displayName ? (
                  <div>Welcome to Unionizer {user.displayName}</div>
                ) : null
              ) : (
                <ul>
                  <li>
                    <h1 className="header">Already have an account? </h1>
                    <Link href={"/auth/login"}>
                      <button className="login-button">Login
                      </button>
                    </Link>
                  </li>
                  <li>
                    <h1 className="header">New to Unionizer?</h1>
                    <Link href={"/auth/signup"}>
                      <button className="signup-button">Create an account</button>
                    </Link>
                  </li>
                </ul>
              )
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
