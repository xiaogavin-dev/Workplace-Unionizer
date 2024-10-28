import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function redirectSeconds(redirectTo, seconds = 5) {
    const [secondsRemaining, setSecondsRemaining] = useState(seconds);
    const router = useRouter();
  
    useEffect(() => {
        if(secondsRemaining === 0) 
            router.push('/search');
  
        const timer = setTimeout(() => {
            setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1);
            if (secondsRemaining === 1)
                router.push(redirectTo);
        }, 1000);
  
        return () => {
            clearInterval(timer);
        };
    }, [router, secondsRemaining, redirectTo]);
    return { secondsRemaining };
}