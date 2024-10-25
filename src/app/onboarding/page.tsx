'use client'

import React, { useEffect, useState } from "react";
import { Home, Search, User, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TaskCard from "@/components/taskcard";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { ethers } from "ethers";
import abi from "../../../contract.json";
import { useToast } from "@/components/hooks/use-toast";



// Job interface
interface Job {
  uuid: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  location?: {
    name: string;
    stateCode: string;
    countryCode: string;
  };
  proposal?: Array<{
    user_id: string;
    proposal: string;
    status: string | null;
  }>;
  proposaluser?: Array<{
    user_id: string;
    name: string;
    key: string | null;
  }>;
  user_id: string;
  category: string;
  user: {
    name: string;
    walletkey: string;
  };
}
interface user{
  uuid: string;
  title: string;
  walletkey: string;
}
// Proposal interface


// Task interface


function Page() {
  const[id, setid] = useState();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setuser] = useState<user[]>([]);
  const [name, setName] = useState("");
  const [walletKey, setWalletKey] = useState("");
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [proptitle, setproptitle] = useState("");
  const [username, setusername] = useState("");
  const [useraddress, setuseraddress] = useState("");
  const [open, setOpen] = useState(false);
  const [profilecreated, checkprofilecreated] = useState(false);
  const [propsals, setproposals] = useState([]);
  const {toast} = useToast();



  let counter = 0;
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
  
        // Await the transaction call to the complete function
        const transaction = await contract.complete(userAddress, counter);
        counter++;
        console.log("Transaction: ", transaction);
  
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


  // Fetch jobs and tasks from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from<Job>("jobs").select("*");
      if (error) {
        setFetchError("Error fetching jobs.");
        console.log(error);
      } else if (data) {  
        setJobs(data);
        setFilteredJobs(data);
        setFetchError("");
      }
    };
    fetchJobs();
    // fetchTasks();
  }, []);



















  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     const { data, error } = await supabase.from<user>("user").select("*");
  //     if (error) {
  //       setFetchError("Error fetching jobs.");
  //       console.log(error);
  //     } else  {
  //       setuser(data);
  //       setFetchError("");
  //     }
  //   };

  //   const fetchTasks = async () => {
  //     const { data, error } = await supabase.from<Task>("tasks").select("*");
  //     if (error) {
  //       setFetchError("Error fetching tasks.");
  //       setTasks([]);
  //       console.log(error);
  //     } else if (data) {
  //       setTasks(data);
  //       setFetchError("");
  //     }
  //   };

  //   fetchJobs();
  //   fetchTasks();
  // }, []);

  // Filter jobs by category
 

  // Handle category selection
  

  // Accept task and add it to accepted tasks
  
  const profile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "" || useraddress === "") {
        alert("Fill in details First..");
        return;
    }

    const userdet = {
        name: username,
        walletkey: useraddress,
    };

    try {
        // Check if user already exists
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('walletkey', useraddress)
            .single();

        if (data) {
            // If user exists, update the profile
            await supabase
                .from('user')
                .update(userdet)
                .eq('walletkey', useraddress);
            alert("Profile Updated..");
        } else {
            // If user doesn't exist, insert a new profile
            await supabase.from('user').insert([userdet]);
            alert("Profile Created..");
        }

        checkprofilecreated(true); // Set profilecreated to true
    } catch (err) {
        console.log(err);
    }
};


 

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You can add a notification or alert here if you want to inform the user
        toast({ title: "Fill the form", variant: "destructive"})  
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };


  const proposal = async () => {
    try {
      let { data: jobs, error } = await supabase
        .from('jobs')
        .select('title');  // Fetch only the title
  
      if (error) {
        alert("Recheck the code");
        console.log("Error fetching the data...");
      } else {
        // Assuming jobs is an array of objects, map over it to extract titles
        const titles = jobs.map(job => job.title);  // Extract the titles
        console.log("Job Titles: ", titles);
        setproptitle(titles);  // Assuming setproptitle is a state setter
      }
    } catch (err) {
      console.log("Error: ", err);
    }
   




    const userdet = {
      name: username,
      walletkey: useraddress,
  };

   
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white px-10">
      {/* Sidebar */}
      <aside className="w-1/6 bg-gray-800 h-max rounded-xl text-white p-5">
        <nav>
          <Dialog>
         
          <DialogTrigger
          className=""
> <ul>
            {[{ icon: User, text: "Profile" }].map(
              ({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 p-3 text-lg cursor-pointer hover:text-blue-400">
                  <Icon className="w-6 h-6" />
                  {text}
                </li>
              )
            )}
          </ul> 
          <DialogContent>
  
    <DialogTitle>User Details <br /><br /> Click on the element you want to copy</DialogTitle>
    <DialogDescription>
    <div className="bg-blue-200 py-10 px-10 rounded-xl flex justify-evenly">
      <h1 
        className="bg-white text-black text-xl py-4 px-2 h-18 w-40 rounded-xl mr-2 cursor-pointer hover:bg-red-200 transition duration-200"
        onClick={() => handleCopy(`${username}`)} // Copy the name
      >
        Name  {username}
      </h1>
      <h1 
        className="bg-white text-black text-xl py-4 px-2 w-auto rounded-xl cursor-pointer hover:bg-red-200 transition duration-200"
        onClick={() => handleCopy(`${useraddress}`)} // Copy the wallet address
      >
        Wallet Address {useraddress}
      </h1>
    </div>
    </DialogDescription>
 
 
</DialogContent>
        </DialogTrigger>



         
         
            </Dialog>
        </nav>
        <div className="mt-10">
          <h2 className="text-xl mb-4">Categories</h2>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="showAllJobs"
              checked={showAllJobs}
             
              className="form-checkbox"
            />
            <label htmlFor="showAllJobs" className="cursor-pointer">
              Show All Jobs
            </label>
          </div>
          {["tech", "non-tech"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="radio"
                id={category}
                checked={selectedCategory === category}
                
                className="form-radio"
              />
              <label htmlFor={category} className="capitalize">{category}</label>
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center">
          <h2 className="text-xl">Create a Job</h2>
          <Link href="/create" className="ml-3">
            <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition duration-200">
              <Plus className="h-6 w-6" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow py-5 max-h-screen px-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-5">Available Jobs and Tasks</h1>
        <section className="flex flex-col gap-5 w-full">
          {/* Jobs */}
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.uuid} className="max-w-[60ch] flex flex-col gap-3 p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                </div>
                <p className="text-sm text-gray-400">Description : {job.discription}</p>
                <div className="flex justify-between items-center">
                  <p>Salary: ₹{job.price}</p>
                
                  <div className="flex flex-row gap-1 items-center">
                    <MapPin size={20} />
                    <p>{job.location ? `${job.location}` : "Remote"}</p>
                  </div>
                </div>
                <p>Skills Required: {job.skills.length > 0 ? job.skills : "none"}</p>
                <div className="mt-4 flex gap-3">
                  {profilecreated && (
 <button
 className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
onClick={proposal}
>
 Accept
</button>
                  )}
                  {
                    !profilecreated   && (
                     <>
                    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
  <DialogTrigger>
    <button
      onClick={() => setOpen(true)}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
    >
      Create a Profile
    </button>
  </DialogTrigger>

  <DialogContent>
    <div className="relative">
      <DialogTitle>Create a Profile to automate fund transfer...</DialogTitle>

      {/* Custom Close Button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-2 text-3xl font-bold text-gray-700 hover:text-gray-900"
      >
        ×
      </button>
    </div>

    <div className="flex flex-col mt-4">
      <input
        type="text"
        placeholder="Enter Your Name"
        className="h-10 w-64 rounded-l mb-5 text-black text-l py-2 px-4"
        value={username} // Controlled component
        onChange={(e) => setusername(e.target.value)} // Ensure this is properly set
      />
      <input
        type="text"
        placeholder="Enter Your Wallet-Address"
        className="h-10 w-96 rounded-l text-black text-l py-2 px-4"
        value={useraddress} // Controlled component
        onChange={(e) => setuseraddress(e.target.value)} // Ensure this is properly set
      />

      <button
        className="bg-green-600 py-3 px-5 w-28 rounded flex justify-center items-center align-center text-center mt-4 hover:scale-110 transition duration-200"
        onClick={profile}
      >
        Create
      </button>
    </div>
  </DialogContent>
</Dialog>
                     </>
                    )
                  }
                </div>
              </div>
            ))
          ) : (
            <></>
          )}

          {/* Tasks */}
          {tasks.length > 0 ? (
            <div>
              {tasks.map((task) => (
                <div key={task.id} className="max-w-[60ch] flex flex-col gap-3 mb-10 ml-10 p-4 bg-gray-800 rounded-lg">
                  <TaskCard task={task} />
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </section>
      </main>

      <aside className="w-1/6 p-5 bg-gray-800 rounded-xl h-max w-max text-center overflow-y-auto">
      <h2 className="text-xl mb-4">Your Proposals</h2>
       {
        proptitle && (
          <>
          <div>

          <div className="bg-gray-900 rounded-l py-4 px-5 text-xl flex flex-col justify-center items-center align-center">
            {proptitle}
            <div>  
           Job for {username}
            </div>
           
          </div>
          <div>
            <button className="bg-green-400 py-4 px-4 rounded-xl mt-3 hover:scale-110 transition duration-200 text-blue-700" onClick={loadABI}>Verify As Done..</button>
          </div>
          </div>
          </>
        )
       }
    </aside>
    </div>
  );
}

export default Page;








{/* <Dialog>
<DialogTrigger
  className="bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 border-black text-white rounded-lg shadow-md transform transition-transform duration-700 ease-in-out hover:scale-110"
>
  Create a Proposal
</DialogTrigger>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Create a Proposal</DialogTitle>
    <DialogDescription>
      <textarea
        name="message"
        id="message"
        rows={5}
        className="p-2 border-2 border-gray-300 rounded-lg w-11/12 h-64 text-black"
        placeholder="Describe yourself in 100 words"
        onChange={(e) => setLetter(e.target.value)}
        value={letter}
      ></textarea>
    </DialogDescription>
  </DialogHeader>
  <button
    className="bg-green-400 text-white w-20 py-2 px-2 rounded ml-96 hover:scale-110"
    onClick={() => {
      if (job.proposal && userId) {
        updateProposal([...job.proposal, { user_id: userId, proposal: letter, status: null }], job.uuid);
      } else if (userId) {
        updateProposal([{ user_id: userId, proposal: letter, status: null }], job.uuid);
      }
    }}
  >
    Send
  </button>
</DialogContent>
</Dialog> */}