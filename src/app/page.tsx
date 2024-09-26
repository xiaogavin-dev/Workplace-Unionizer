'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks/redux";
import { Button } from "@/components/ui/button";
interface User {
  displayName?: string,
  uid: string,
  email: string
}
export default function Login() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user }: { 
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  } = useAppSelector(state => state.auth)

  // if (isAuthenticated && user) {
  //   router.push("/community");
  // }

  return (
    <main className="min-w-full flex justify-center ">
      <div className="max-w-fit content-center">
        {isAuthenticated != null ?
          (user ? (
            user.displayName ?
              (
                <h1>
                  Welcome to unionizer {user.displayName}
                </h1>
              ) : null)
            :
            <ul className="p-3 border-2 rounded-lg shadow-lg">
              <li>
                <Link href={"/auth/login"}>
                  <Button className="min-w-56 m-2">
                    Login
                  </Button>
                </Link>

              </li>
              <li>
                <Link href={"/auth/signup"}>
                  <Button className="min-w-56 m-2">
                    Create an account
                  </Button>
                </Link>
              </li>

            </ul>) :
          <></>
        }
      </div>
    </main>
  );
}