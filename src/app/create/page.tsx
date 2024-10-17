"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";

// Job interface
interface Job {
  uuid: string;
  title: string;
  description: string;
  budget: number;
  time: string;
  location: {
    name: string;
    stateCode: string;
    countryCode: string;
  };
  skills: string[];
  category: string;
}

function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(20); // default minimum budget ₹20
  const [time, setTime] = useState("");
  const [location, setLocation] = useState({ name: "", stateCode: "", countryCode: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [category, setCategory] = useState("tech");
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !time || budget < 20 || !location.name || !location.stateCode || !location.countryCode) {
      setError("Please fill all fields correctly.");
      return;
    }

    const newJob: Job = {
      uuid: Math.random().toString(36).substring(7), // Generate a random ID
      title,
      description,
      budget,
      time,
      location,
      skills,
      category,
    };

    // Logic to handle job creation (e.g., send it to an API or add it to a job list)
    console.log(newJob);

    // Redirect or notify the user of success
    alert("Job created successfully!");
    router.push("/"); // Navigate back to home or another page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center p-10">
      <div className="bg-gray-850 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Create a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label className="block mb-2 text-sm font-medium">Task Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
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

          <div>
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

          <div>
            <label className="block mb-2 text-sm font-medium">Payment (min ₹20)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Math.max(20, Number(e.target.value)))}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter payment amount"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="City"
              value={location.name}
              onChange={(e) => setLocation({ ...location, name: e.target.value })}
              className="w-full p-3 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
            <input
              type="text"
              placeholder="State Code (e.g., MH)"
              value={location.stateCode}
              onChange={(e) => setLocation({ ...location, stateCode: e.target.value })}
              className="w-full p-3 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
            <input
              type="text"
              placeholder="Country Code (e.g., IN)"
              value={location.countryCode}
              onChange={(e) => setLocation({ ...location, countryCode: e.target.value })}
              className="w-full p-3 mb-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Skills (comma separated)</label>
            <input
              type="text"
              value={skills.join(", ")}
              onChange={(e) => setSkills(e.target.value.split(",").map((skill) => skill.trim()))}
              className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter required skills"
            />
          </div>

          <div>
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;