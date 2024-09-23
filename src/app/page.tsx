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
  return (
    <main className="min-w-full flex justify-center ">
      <div className="max-w-fit content-center">
        {
          user != null ? (
            user.displayName ?
              (
                <h1>
                  Welcome to unionizer {user.displayName}
                </h1>
              ) :
              (<h1>
                Welcome to unionizer {user.email}
              </h1>))
            :
            <ul className="p-3 border-2 rounded-lg shadow-lg">
              <li>
                <Button className="min-w-56 m-2">
                  <Link href={"/auth/login"}>Login</Link>
                </Button>
              </li>
              <li>
                <Button className="min-w-56 m-2">
                  <Link href={"/auth/signup"}>Create an account</Link>
                </Button>
              </li>

            </ul>
        }
      </div>
    </main>
  );
}