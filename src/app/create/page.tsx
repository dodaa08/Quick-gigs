"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import abi from "../../../contract.json";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/hooks/use-toast";


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

}


function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [id, setid] = useState("");
  const [earn, setEarn] = useState(20); // default minimum budget ₹20
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [category, setCategory] = useState("tech");
const [error, setError] = useState<string | null>(null);
const [jobs, setJobs] = useState<Job[]>([]);
const [fetchError, setFetchError] = useState<string>("");
const [checkform, setcheckform] = useState(false);

const vaildateform = ()=>{
  if(title.trim()==="" && description.trim()==="" && earn<20 && time.trim() == "" && skills.trim() == "" && location.trim() == "" ){
    toast({ title: "Fill the form", variant: "destructive"})
    return false;
  }
  return true;
}





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
      const transaction = contract.upload(counter, {value: earn.toString()});
      counter++;

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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Constructing the full job data object
    const jobData = {
      title: title,
      discription: description, // Ensure this matches your DB schema
      price: earn, // Fix the field name from 'earn' to 'price' as per your table structure
      skills: skills,
      location: location,
    };

    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([jobData]) // Insert all fields in a single object
        .select(); // Selecting after insert to confirm

      if (error) throw error;

      console.log("Job created:", data);
      setError(null); // Reset error if successful

      // Optionally, reset the form fields after successful submission
      setTitle("");
      setDescription("");
      setEarn(20);
      setTime("");
      setLocation("");
      setSkills("");
      setCategory("tech");
    } catch (error) {
      setError("Error creating job. Please try again." + error);
      console.error("Error:", error);
    }
  };

  useEffect(()=>{
    const fetchjobs = async ()=>{
      const {data, error} = await supabase.from<Job>("jobs").select("*");
      if(error){
        console.log("Error fetching the data.");
      }
      else{
         setJobs(data);
         setFetchError(""); 
      }
    } 
    fetchjobs();  // it's a recursive call until all the data gets printed here,
  },[])


    const deletejob = async (jobid)=>{
      try{
        const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobid);
        if (error) {
          console.error('Error deleting the job:', error.message);
          alert('Error deleting the data');
        } else {
          alert('Job deleted successfully');
        }
      }
      catch(Error){
        console.log("Error", Error);
      }
    }



  const handleJobCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vaildateform()) {
      return;
    }
  
   
    try {
      // Call handleSubmit and loadABI in parallel
      await Promise.all([loadABI(),handleSubmit(e)]);
  
      // If both succeed, you can optionally display a success message
      console.log("Job created both in DB and on the blockchain.");
    } catch (error) {
      // Handle errors from either operation
      console.error("Error in job creation process:", error);
      setError("An error occurred while creating the job. Please try again.");
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white flex  justify-between  p-10" >
      <div className="bg-gray-850 p-8 rounded-lg shadow-xl mb-64 w-full max-w-4xl  border border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quick Gigs</h1>
        </div>

        <form onSubmit={handleJobCreation} className="grid grid-cols-2 gap-6">
          {error && <p className="text-red-500 text-center col-span-2">{error}</p>}

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Task Name</label>
            <input
              type="text"
              value={title} // Bind the value to the state
              onChange={(e) => setTitle(e.target.value)} // Update the state on change
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Describe the job in detail"
              rows={4}
              required
              />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Time (e.g., 2 days, 1 week)</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter time frame"
              required
              />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Payment (min ₹20)</label>
            <input
              type="number"
              value={earn}
              onChange={(e) => setEarn(Math.max(20, Number(e.target.value)))}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter payment amount"
              required
              />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="Where ?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
              />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter required skills"
              />
          </div>

          <div className="col-span-1">
            <label className="block mb-2 text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="tech">Tech</option>
              <option value="non-tech">Non-Tech</option>
            </select>
          </div>

          
        </form>
        <div className="flex justify-evenly mt-5">

          <button
            type="submit"
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg w-96 transition duration-300"
            onClick={handleJobCreation}
            >
            Create Job
          </button>
       
            </div>
      </div>
   <div>
   </div>

   <div className="bg-gray-800 py-10 px-10 rounded-xl h-max">
    <div>
    <h1 className="text-2xl ">Created by You 📍</h1>
  </div>
 

 {jobs && jobs.map((job)=>(
 <div className="flex flex-col justify-evenly mt-5 mb-2 ">

 <div className="bg-gray-600 py-10 px-10  rounded-l h-auto w-auto" > 
      <p className="text-center text-xl text-white mb-2">{job.title}</p>
      <p className="text-l text--200">Fixed Salary - {job.price}</p>
      <p className="text-l text--200">Status - Pending</p>
      <p className=" text-xl text-yellow-200">
  {job.location ? job.location : "Remote"}  ⟟ 
</p>   
 </div>
 
 <div className="flex justify-evenly">
   <button className="bg-green-500 py-3 px-4 mr-2 rounded-l  hover:bg-red-300 transition duration-200">Verify as Done</button>
   
   <button className="bg-blue-500 py-3 px-4 rounded-l   hover:bg-red-300 transition duration-200" onClick={() => deletejob(job.id)}>Delete</button>
 </div>
 
 </div>
 ))}

</div>
    </div>
  </>
    
  );
}

export default CreateJobPage;
