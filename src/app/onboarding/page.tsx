'use client'
import React, { useEffect, useState } from "react";
import { Home, Search, User, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TaskCard from "@/components/taskcard";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";

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
interface Proposal {
  user_id: string;
  proposal: string;
  status: string | null;
}

// Task interface
type Task = {
  id: number;
  title: string;
  description: string;
  price: number;
  skills: string[];
  location: string;
};

function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [acceptedTasks, setAcceptedTasks] = useState<Job[]>([]);
  const [userProposals, setUserProposals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setuser] = useState<user[]>([]);
  const [name, setName] = useState("");
  const [walletKey, setWalletKey] = useState("");
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [proposals, setProposals] = useState<Job[]>([]);
  const [proposalsuser, setProposalsuser] = useState<Job[]>([]);
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


  useEffect(() => {
    const fetchprop = async () => {
      const { data, error } = await supabase.from<user>("jobs").select("*");
      if (error) {
        setFetchError("Error fetching jobs.");
        console.log(error);
      } else if (data) {
        setProposals(data); // Set the proposals with the fetched jobs
        setFetchError("");
      }
    };

    fetchprop();
  }, []);

  useEffect(() => {
    const fetchuser = async () => {
      const { data, error } = await supabase.from<user>("user").select("*");
      if (error) {
        setFetchError("Error fetching jobs.");
        console.log(error);
      } else if (data) {
        setProposalsuser(data); // Set the proposals with the fetched jobs
        setFetchError("");
      }
    };

    fetchuser();
  }, []);


  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from<user>("user").select("*");
      if (error) {
        setFetchError("Error fetching jobs.");
        console.log(error);
      } else  {
        setuser(data);
        setFetchError("");
      }
    };

    const fetchTasks = async () => {
      const { data, error } = await supabase.from<Task>("tasks").select("*");
      if (error) {
        setFetchError("Error fetching tasks.");
        setTasks([]);
        console.log(error);
      } else if (data) {
        setTasks(data);
        setFetchError("");
      }
    };

    fetchJobs();
    fetchTasks();
  }, []);

  // Filter jobs by category
  useEffect(() => {
    setFilteredJobs(
      showAllJobs
        ? jobs
        : selectedCategory
        ? jobs.filter((job) => job.category === selectedCategory)
        : []
    );
  }, [selectedCategory, jobs, showAllJobs]);

  // Handle category selection
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setShowAllJobs(category === null);
  };

  // Accept task and add it to accepted tasks
  const acceptTask = async (job: Job) => {
    if (!isProfileCreated) {
      setProfileDialogOpen(true);
    } else {
      try {
        const userdata = {
          name: name,
          walletKey: walletKey, // Ensure this matches your DB schema
        };
        // Save the accepted task to Supabase
        const { data, error: insertError } = await supabase
          .from("accepted_tasks")
          .insert([userdata]);
  
        if (insertError) {
          console.error("Error saving accepted task:", insertError);
          return;
        }
  
        // Update accepted tasks with the job and its associated user details
        setAcceptedTasks((prev) => [...prev, job]);
  
        // Show proposals for the accepted job
        setShowProposals((prev) => ({
          ...prev,
          [job.uuid]: true,
        }));
      } catch (error) {
        console.error("Error accepting task:", error);
      }
    }
  };
  

  const handleProfileSubmit = async () => {
    const { error } = await supabase.from("user").upsert({ name, walletkey: walletKey });
    if (error) {
      alert("Error creating profile.");
    } else {
      setIsProfileCreated(true);
      setProfileDialogOpen(false);
      alert("Profile created successfully!");
    }
  };  


  // Verify the task as done
  const verifyTaskAsDone = (jobUuid: string) => {
    setAcceptedTasks((prev) =>
      prev.map((task) =>
        task.uuid === jobUuid ? { ...task, status: "Verified as Done" } : task
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white px-10">
      {/* Sidebar */}
      <aside className="w-1/6 bg-gray-800 h-max rounded-xl text-white p-5">
        <nav>
          <ul>
            {[{ icon: Home, text: "Home" }, { icon: Search, text: "Explore" }, { icon: User, text: "Profile" }].map(
              ({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 p-3 text-lg cursor-pointer hover:text-blue-400">
                  <Icon className="w-6 h-6" />
                  {text}
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="mt-10">
          <h2 className="text-xl mb-4">Categories</h2>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="showAllJobs"
              checked={showAllJobs}
              onChange={(e) => handleCategoryChange(e.target.checked ? null : selectedCategory)}
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
                onChange={() => handleCategoryChange(category)}
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
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                    onClick={() => acceptTask(job)}
                  >
                    Accept
                  </button>
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
      {proposals.length > 0 ? (
        proposals.map((job) => (
          <div key={job.uuid} className="flex flex-col gap-3 p-4 bg-gray-700 rounded-lg mb-5">
            <p className="text-lg">Job Title: {job.title}</p>
            <p className="text-sm">Budget: ₹{job.price}</p>
            <p className="text-sm">Location: {job.location ? `${job.location}` : "Remote"}</p>
            {job.proposaluser && (
              <>
                <p className="text-sm">User Name: {job.user.name}</p>
                <p className="text-sm">Wallet Key: {job.user.key}</p>
              </>
            )}
            {/* ... (rest of the proposal rendering logic) */}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No proposals yet.</p>
      )}
    </aside>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="bg-gray-800 p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle>Create Your Profile</DialogTitle>
            <DialogDescription>Please enter your details below to create a profile.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <label className="block text-gray-400">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 rounded bg-gray-700"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-400">Wallet Address:</label>
            <input
              type="text"
              value={walletKey}
              onChange={(e) => setWalletKey(e.target.value)}
              className="w-full p-2 mt-1 rounded bg-gray-700"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleProfileSubmit}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
            >
              Save Profile
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
