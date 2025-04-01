"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_TASKS, GET_TASK } from "@/lib/graphql/tasks";
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

export default function ManageTaskPage({ params }: { params: { taskId?: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Task query for fetching individual task if editing
  const { data: taskData, loading: taskLoading } = useQuery<{ task: Task }>(
    GET_TASK,
    {
      variables: { id: params.taskId },
      skip: !params.taskId, // Skip query if no taskId
    }
  );

  // Task list query
  const { data: taskList, loading: tasksLoading, refetch} = useQuery<{ tasks: Task[] }>(GET_TASKS);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [showForm, setShowForm] = React.useState(false); // State to toggle form visibility
  const [isEditing, setIsEditing] = React.useState(false); // State to differentiate between create and edit modes

  if (authLoading || taskLoading || tasksLoading) return <p className="text-center text-gray-600">Loading...</p>;

  if (!user) {
    router.push("/login");
    return null;
  }

  // Pre-fill the form if editing
  if (taskData && params.taskId && showForm && isEditing) {
    setValue("title", taskData.task.title);
    setValue("description", taskData.task.description);
    setValue("status", taskData.task.status);
  }

  const onSubmit = async (formData: z.infer<typeof taskSchema>) => {
    try {
      if (params.taskId) {
        await updateTask({ variables: { id: params.taskId, ...formData } });
        // Reset Form data to default after an update action
        setValue("title", "")
        setValue("description","")
        setValue("status","pending")
        setShowForm(false); // Hide form after updating
        router.push("/manage-tasks");
      } else {
        await createTask({ variables: { ...formData } });
        setShowForm(false); // Hide form after creating
        refetch()
        router.push("/manage-tasks");
      }
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask({ variables: { id: taskId } });
      refetch()
      router.push("/manage-tasks"); // Redirect to refresh the task list
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };
  const displayForm = showForm && <>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-gray-300 p-6 rounded shadow">
      {/* Title */}
      <div className="mb-4">
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
      <div className="mb-4">
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
      <div className="mb-4">
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

      {/* Submit Button */}
      <div className="flex space-x-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          {params.taskId && isEditing ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)} // Cancel action
          className="bg-red-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
    </>

  return (
    <div className="min-h-screen p-4">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-blue-400 p-4 text-white rounded">
        <h1 className="text-xl font-bold">Manage Your Tasks</h1>
      </div>

      {/* Create Task Button */}
      {!params.taskId && !showForm && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              setIsEditing(false); // Set the mode to create
              setShowForm(true); // Show form when "Create Task" is clicked
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Create Task
          </button>
        </div>
      )}

      {/* Display the form for creation only*/}
      {!isEditing && displayForm}

      {/* Task List */}
      <div className="mt-6 space-y-4">
        {taskList?.tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks found.</p>
        ) : (
          taskList?.tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-400 p-4 rounded shadow flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold text-gray-700">{task.title}</h3>
                <p className="text-gray-500 text-sm">{task.description}</p>
              </div>
              <span className={`px-3 py-1 text-white rounded ${STATUS_COLORS[task.status]}`}>
                {task.status.replace("-", " ").toUpperCase()}
              </span>

              {/* Edit and Delete Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setShowForm(true); // Show form to edit
                    setIsEditing(true); // Set mode to editing
                    setValue("title", task.title); // Prefill form with task data
                    setValue("description", task.description);
                    setValue("status", task.status);
                    params.taskId = task.id;
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
          ))
        )}
      </div>
      {/* Display the Form only if params.taskId is present and isEditing is true */} 
      {params.taskId && isEditing && displayForm}
    </div>
  );
}
