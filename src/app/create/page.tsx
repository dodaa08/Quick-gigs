"use client";

import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alunvxkjhxxnldzxcnio.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdW52eGtqaHh4bmxkenhjbmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0Mzg2ODQsImV4cCI6MjA0NTAxNDY4NH0.7IDyHfwzZkj99aePzOK42ImSHuieIiJDtoHLW1KjlkY";
const supabase = createClient(supabaseUrl, supabaseKey)

function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [earn, setEarn] = useState(20); // default minimum budget ₹20
  const [time, setTime] = useState("");
  const [location, setLocation] = useState({ name: "", stateCode: "", countryCode: "" });
  const [skills, setSkills] = useState<string[]>([]);
  const [category, setCategory] = useState("tech");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Constructing the full job data object
    const jobData = {
      title,
    };

    try {
      const { data, error } = await supabase
      .from('jobs')
      .insert([
        { title: title },
      ])
      .select()
    
    

 
      if (error) throw error;

      console.log("Job created:", data);
      setError(null); // Reset error if successful

      // Optionally, reset the form fields after successful submission
      setTitle("");
      setDescription("");
      setEarn(20);
      setTime("");
      setLocation({ name: "", stateCode: "", countryCode: "" });
      setSkills([]);
      setCategory("tech");

    } catch (error) {
      setError("Error creating job. Please try again."+ error);
      console.error("Error:", error);
    }
  };

 


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center p-10">
      <div className="bg-gray-850 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Create a Job</h1>
  
        <form  className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
  
          <div>
            <label className="block mb-2 text-sm font-medium">Task Name</label>
            <input
                type="text"
                value={title}  // Bind the value to the state
                onChange={(e) => setTitle(e.target.value)}  // Update the state on change
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
              value={earn}
              onChange={(e) => setEarn(Math.max(20, Number(e.target.value)))}
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
            onClick={handleSubmit}
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;

