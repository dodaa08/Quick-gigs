
"use client";


import { useUser } from "@clerk/nextjs";
import Header from "./header/header"
import { User } from "@clerk/nextjs/server";

import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { ethers } from "ethers";
import abi from "../../contract.json";


function Landing() {
    const {isLoaded, isSignedIn} = useUser();
    const [mounted, setMounted] = useState(false);

    async function loadABI(): Promise<ethers.Contract | null> {
      try {
        // Fetch the contract ABI from the contract.json file
       
        const Contractabi = abi.abi; // ABI extracted from the JSON file
        const contractAddress = "0x102Df7040d2ae787d1C4223e23991B84c198D3E8";
    
        console.log(abi);
    
        if ((window as any).ethereum) {
          // Initialize the provider
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
    
          // Get the user's wallet address
          const userAddress = await signer.getAddress();
          console.log(`Connected: ${userAddress}`);
    
          // Instantiate the contract with ABI and signer
          const contract = new ethers.Contract(contractAddress, Contractabi, signer);
           const transaction = await contract.register();
           console.log(transaction.hash);
          return contract;
        } else {
          alert("Please install MetaMask!");
          throw new Error("MetaMask not found");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        throw error;
      }
    }
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
                <h1 className="mb-10 text-xl mt-5">Solution for simplifying the gig work...</h1>
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
                <button className="text-center bg-blue-700 py-1 rounded-xl text-2xl text-white px-4 py-3  hover:bg-blue-500 transition duration-200"  onClick={loadABI}>Log-In</button>
              </Link>
            </div>
          )}

          

         </div>
        </>
    )
}

export default Landing
