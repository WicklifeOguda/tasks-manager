"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_TASKS, /*GET_TASK */} from "@/lib/graphql/tasks";
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK } from "@/lib/graphql/tasks";
import { Task, TaskStatus } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth";
import React from "react";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  status: z.enum(["pending", "in-progress", "completed"]),
});

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: "bg-yellow-400",
  "in-progress": "bg-blue-400",
  completed: "bg-green-400",
};

export default function ManageTaskPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch tasks list
  const { data: taskList, loading: tasksLoading, refetch } = useQuery<{ tasks: Task[] }>(GET_TASKS);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);

  if (authLoading || tasksLoading) return <p className="text-center text-gray-600">Loading...</p>;

  if (!user) {
    router.push("/login");
    return null;
  }

  const onSubmit = async (formData: z.infer<typeof taskSchema>) => {
    try {
      if (editingTaskId && editingTaskId !== "new") {
        await updateTask({ variables: { id: editingTaskId, ...formData } });
      } else {
        await createTask({ variables: { ...formData } });
      }
      reset();
      setEditingTaskId(null);
      refetch();
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask({ variables: { id: taskId } });
      refetch();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-blue-400 p-4 text-white rounded">
        <h1 className="text-xl font-bold">Manage Your Tasks</h1>
      </div>

      {/* Create Task Button */}
      {!editingTaskId && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setEditingTaskId("new")}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Create Task
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="mt-6 space-y-4">
        {taskList?.tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks found.</p>
        ) : (
          taskList?.tasks.map((task) => (
            <div key={task.id}>
              {/* Task Item */}
              <div className="bg-gray-400 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-700">{task.title}</h3>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                </div>
                <span className={`px-3 py-1 text-white rounded ${STATUS_COLORS[task.status]}`}>
                  {task.status.replace("-", " ").toUpperCase()}
                </span>

                {/* Edit and Delete Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setValue("title", task.title);
                      setValue("description", task.description);
                      setValue("status", task.status);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Editing Form Below Task */}
              {editingTaskId === task.id && (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-2 bg-gray-300 p-4 rounded shadow">
                  {/* Title */}
                  <div className="mb-3">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
                    <input
                      id="title"
                      {...register("title")}
                      type="text"
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                      placeholder="Task Title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      id="description"
                      {...register("description")}
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                      placeholder="Task Description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status</label>
                    <select
                      id="status"
                      {...register("status")}
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded"
                    >
                      Update Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                      className="bg-red-500 text-white px-6 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Form at the Bottom */}
      {editingTaskId === "new" && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 bg-gray-300 p-4 rounded shadow">
          {/* Title */}
          <div className="mb-3">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Title</label>
                    <input
                      id="title"
                      {...register("title")}
                      type="text"
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                      placeholder="Task Title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      id="description"
                      {...register("description")}
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                      placeholder="Task Description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">Status</label>
                    <select
                      id="status"
                      {...register("status")}
                      className="w-full p-3 border rounded mt-2 text-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                  </div>

                  {/* Submit & Cancel Buttons */}
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded"
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                      className="bg-red-500 text-white px-6 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
        </form>
      )}
    </div>
  );
}
