
"use client";

import { useUser } from "@clerk/nextjs";
import Header from "./header/header"
import { User } from "@clerk/nextjs/server";

import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";

function Landing() {
    const {isLoaded, isSignedIn} = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true)
    },[]);

    if (!mounted) {
        return null;
      }
    return (
        <>
         <div>
            
            <div className="flex flex-col justify-center  align-center items-center justify-evenly mt-12">
                <h1 className="mb-10 text-3xl">Looking for gigs ?</h1>
            <div className="flex ">
                <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzdiNzdiZ285NmdoMG40c2xhamtucGsyOHZ3anB5cWxnNnY1dmgyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2WMhNcyFOWP280/giphy.webp" alt="" className="h-64 rounded-xl" />
            </div>
                <h1 className="mb-10 text-xl mt-5">Solution anything and everything.</h1>
            </div>

            {isLoaded && isSignedIn && (
            <div className="mt-6 flex justify-center items-center ">
              <Link
                href="/onboarding"
              >
                 <button className="text-center bg-blue-700 py-1 rounded-xl text-2xl text-white px-4 py-3  hover:bg-blue-500 transition duration-200" >Explore Jobs📇</button>
                
              </Link>
            </div>
          )}
          {isLoaded && !isSignedIn && (
            <div className="mt-6  flex justify-center items-center ">
              <Link
                href="/sign-in" 
              >
                <button className="text-center bg-blue-700 py-1 rounded-xl text-2xl text-white px-4 py-3  hover:bg-blue-500 transition duration-200" >Log-In</button>
              </Link>
            </div>
          )}

          

         </div>
        </>
    )
}

export default Landing
