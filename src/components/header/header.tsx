
'use client'
import Link from "next/link"
import { useClerk } from '@clerk/nextjs'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";


export default function Header(){
    const { signOut } = useClerk()
    return(
        <>
        <div className="flex justify-between bg-black h-18 text-black rounded">
            <div className="mt-5 ml-5 flex">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4nxWJFT7giBQyh5p6n572vt4GGIARkHFjIw&s" alt="" className="h-10" />
                <h1 className="text-white ml-5 mt-2">CryptoSea</h1>
            </div>
            <div className="flex flex-row justify-evenly gap-12 cursor-pointer mt-5 text-xl  text-white  h-12">
            <div className="flex justify-center  align-center items-center  gap-4 mb-5 mr-10">

          
                <Link href="/">
                <h1 className="text-l transition duration-200 hover:bg-blue-400 hover:scale-110 hover:text-black py-2 px-4 rounded-xl ">Home</h1>
                </Link>
             

            
                
                <Link href="/">
                <h1 className="text-l transition duration-200 hover:bg-blue-400 hover:scale-110 hover:text-black py-2 px-4 rounded-xl ">Contact</h1>
                </Link>
              
              
                <SignedOut>
                <Link href="/sign-up">
                <h1 className="text-xl transition duration-200 hover:bg-blue-400 hover:scale-110 hover:text-black py-2 px-4 rounded-xl ">Sign up</h1>
                </Link >
            
                </SignedOut>

               

                
                <SignInButton>
                <UserButton />
                </SignInButton>
            </div>
              
            </div>
        </div>
        </>
    )
}