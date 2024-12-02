'use client'
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import HorizontalNavbar from '@/components/horizontal-navbar/horizontal-navbar';
import useSeconds from "../hooks/redirectSeconds"

interface User {
  displayName?: string,
  uid: string,
  email: string
}
export default function Login() {
  const router = useRouter();
  const { secondsRemaining } = useSeconds('/search', 5);
  const { isAuthenticated, isLoading, user }: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  } = useAppSelector(state => state.auth)

  // if (isAuthenticated && user) {
  //   router.push("/community");
  // }
  useEffect(() => {
    console.log(user)
  }, [user])
  return (<>
    <HorizontalNavbar pageName="/" />
    <main className="min-w-full flex justify-center">
      <div className="max-w-fit content-center ">
        {isAuthenticated != null ?
          (user ? (
            user.displayName ?
              (
                <div>
                  Welcome to unionizer {user.displayName}
                  <br/>
                  Redirecting in {secondsRemaining} {secondsRemaining > 1 ? 'seconds' : 'second'}...
                </div>
              ) : null)
            :
            <ul className="p-3 border-2 rounded-lg shadow-lg">
              <li>
                <Link href={"/auth/login"}>
                  <Button className="min-w-56 m-2 hover:bg-blue-700">
                    Login
                  </Button>
                </Link>

              </li>
              <li>
                <Link href={"/auth/signup"}>
                  <Button className="min-w-56 m-2 hover:bg-blue-700">
                    Create an account
                  </Button>
                </Link>
              </li>

            </ul>) :
          <></>
        }
      </div>
    </main>
  </>
  );
}