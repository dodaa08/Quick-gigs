"use client";

import React, { useEffect, useState } from "react";
import { Home, Search, User, MapPin, Plus } from "lucide-react";
import Link from "next/link";

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

// Page component
function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [userProposals, setUserProposals] = useState<Array<{ job: Job; proposal: Proposal }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(true);

  // Mocked job data
  const mockJobs: Job[] = [
    {
      uuid: "1",
      title: "Frontend Developer",
      description: "Looking for a React developer to work on a college project.",
      budget: 1000,
      skills: ["React", "JavaScript", "CSS"],
      location: { name: "Mumbai", stateCode: "MH", countryCode: "IN" },
      user_id: "123",
      category: "tech",
    },
    {
      uuid: "2",
      title: "Content Writer",
      description: "Need a creative writer for a blog on tech trends.",
      budget: 500,
      skills: ["Writing", "SEO"],
      location: { name: "Delhi", stateCode: "DL", countryCode: "IN" },
      user_id: "124",
      category: "non-tech",
    },
  ];

  const mockProposals = [
    {
      job: mockJobs[0],
      proposal: { user_id: "123", proposal: "I am interested in this project.", status: "Pending" },
    },
  ];

  useEffect(() => {
    // Set jobs and proposals on mount
    setJobs(mockJobs);
    setUserProposals(mockProposals);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    setFilteredJobs(
      showAllJobs
        ? jobs
        : selectedCategory
        ? jobs.filter((job) => job.category === selectedCategory)
        : []
    );
  }, [selectedCategory, jobs, showAllJobs]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setShowAllJobs(category === null);
  };

  const handleProposalAction = (jobId: string, action: 'accept' | 'delete') => {
    // Implement the logic for handling proposal actions
    console.log(`${action} proposal for job ${jobId}`);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white px-10">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-5">
        <nav>
          <ul>
            {[
              { icon: Home, text: "Home" },
              { icon: Search, text: "Explore" },
              { icon: User, text: "Profile" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 p-3 text-lg cursor-pointer hover:text-blue-400">
                <Icon className="w-6 h-6" />
                {text}
              </li>
            ))}
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
            <label htmlFor="showAllJobs" className="cursor-pointer">Show All Jobs</label>
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
      <main className="flex-grow bg-gray-850 p-5 overflow-y-auto">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.uuid} className="p-5 bg-gray-800 rounded-lg shadow-lg mb-4">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="mt-2">{job.description}</p>
              <p className="mt-2">Budget: ₹{job.budget}</p>
              <p className="mt-2">Skills: {job.skills.join(", ")}</p>
              <div className="flex items-center mt-3 text-gray-400">
                <MapPin className="w-5 h-5 mr-2" />
                <p>{job.location ? `${job.location.name}, ${job.location.stateCode}, ${job.location.countryCode}` : "Remote"}</p>
              </div>

              {/* Proposal Action */}
              <div className="mt-4 flex gap-3">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  onClick={() => handleProposalAction(job.uuid, 'accept')}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  onClick={() => handleProposalAction(job.uuid, 'delete')}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl mt-10">No jobs found</p>
        )}
      </main>

      {/* Proposals Section */}
      <aside className="w-1/5 p-5 bg-gray-850 overflow-y-auto">
        <h2 className="text-xl mb-4">Your Proposals</h2>
        {userProposals.length > 0 ? (
          userProposals.map((item, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded-lg mb-2">
              <h3 className="font-bold">{item.job.title}</h3>
              <p>Status: {item.proposal.status || "Waiting"}</p>
            </div>
          ))
        ) : (
          <p>You have not made any proposals yet.</p>
        )}
      </aside>
    </div>
  );
}

export default Page;
