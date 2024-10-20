'use client'
import React, { useEffect, useState } from "react";
import { Home, Search, User, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TaskCard from "@/components/taskcard";

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
  user_id: string;
  category: string;
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
  const acceptTask = (job: Job) => {
    if (!acceptedTasks.some((task) => task.uuid === job.uuid)) {
      setAcceptedTasks((prev) => [...prev, job]);
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

      {/* Proposals Section */}
      <aside className="w-1/6 p-5 bg-gray-800 rounded-xl h-max overflow-y-auto">
        <h2 className="text-xl mb-4">Your Proposals</h2>
        {acceptedTasks.length > 0 ? (
          acceptedTasks.map((task) => (
            <div key={task.uuid} className="flex flex-col gap-3 p-4 bg-gray-700 rounded-lg mb-5">
              <p className="text-lg">{task.title}</p>
              <p className="text-sm">Earn ₹  {task.price}</p>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 h-10 transition"
                onClick={() => verifyTaskAsDone(task.uuid)}
              >
                Verify as Done
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No accepted tasks yet.</p>
        )}
      </aside>
    </div>
  );
}

export default Page;
