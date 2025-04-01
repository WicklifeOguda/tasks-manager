"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_TASKS } from "@/lib/graphql/tasks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task, TaskStatus } from "@/types/types";
import { LOGOUT_USER } from "@/lib/graphql/auth";
import { useAuth } from "@/lib/auth";


const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: "bg-yellow-400",
  "in-progress": "bg-blue-400",
  completed: "bg-green-400",
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error } = useQuery<{ tasks: Task[] }>(GET_TASKS);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const router = useRouter();
  const [logoutUser] = useMutation(LOGOUT_USER);
  
  if (authLoading || loading) return <p className="text-center text-gray-600">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  // Redirect if not authenticated
  if (!authLoading && !user) {
      router.push("/login");
    }
  

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      if (data?.logout) {
        router.push("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const tasks: Task[] = data?.tasks ?? [];

  // Apply filtering
  const filteredTasks: Task[] = filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="min-h-screen p-4">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-blue-400 p-4 text-white rounded">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-3 mt-4">
        {["all", "pending", "in-progress", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "all" | TaskStatus)}
            className={`px-4 py-2 rounded text-white ${status === filter ? "bg-gray-900" : "bg-gray-500"}`}
          >
            {status === "all" ? "ALL" : status.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="mt-6 space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-400 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/manage-tasks/${task.id}`)}
            >
              <div>
                <h3 className="font-semibold text-gray-700">{task.title}</h3>
                <p className="text-gray-500 text-sm">{task.description}</p>
              </div>
              <span className={`px-3 py-1 text-white rounded ${STATUS_COLORS[task.status]}`}>
                {task.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}