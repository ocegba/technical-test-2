
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import toast from "react-hot-toast";
import api from "../../services/api";
import LoadingButton from "../../components/loadingButton";
import { format } from "date-fns";
import Loader from "../../components/loader";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasksFiltered, setTasksFiltered] = useState(null);
  const [filter, setFilter] = useState({ status: "todo", due_date: "", search: "" });


  useEffect(() => {
    (async () => {
      try {
        const taskRes = await api.get("/task");
        if (taskRes.ok) setTasks(taskRes.data);
  
        const { data: userData } = await api.get("/user");
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching tasks or users:", error);
      }
    })();
    fetchProjects();
  }, []);
  
  async function fetchProjects() {
    try {
      const projectRes = await api.get("/project/list");
      if (projectRes.ok) setProjects(projectRes.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  useEffect(() => {
    if (!tasks) return;
    setTasksFiltered(
      tasks
        .filter((u) => !filter?.status || u.status === filter?.status)
    );
  }, [tasks, filter]);

  if (!tasksFiltered) return <Loader />;

  console.log(tasksFiltered)
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div>
      {/* Container */}
      <div className="pt-6 px-2 md:px-8">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative text-[#A0A6B1]">
                </div>
            <FilterStatus filter={filter} setFilter={setFilter} />
            <div>
              <span className="text-sm font-normal text-gray-500">
                <span className="text-base font-medium text-gray-700">{tasksFiltered.length}</span> of {users.length}
              </span>
            </div>
          </div>
          {/* Formulaire de création */}
          <Create projects={projects} users={users} setTasks={setTasks} />
          </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-6 gap-5 ">
            {/* Liste des tâches */}
            {tasksFiltered.map((hit, idx) => {
              return <TasksCard key={hit._id} idx={idx} hit={hit} users={users} setTasks={setTasks} />;
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const Create = ({ projects, users, setTasks }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 10 }}>
      <div className="text-right">
        <button className="bg-[#0560FD] text-[#fff] py-[12px] px-[22px] w-[180px] h-[48px] rounded-[10px] text-[16px] font-medium" onClick={() => setOpen(true)}>
          Create a new task
        </button>
      </div>
      {open ? (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#de969666] flex justify-center p-[1rem] z-50" onClick={() => setOpen(false)}>
          <div
            className="w-full md:w-[60%] h-fit bg-[white] p-[25px] rounded-md"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <Formik
              initialValues={{
                name: "",
                description: "",
                status: "todo",
                projectId: "",
                userId: "",
                dueDate: "",
              }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const res = await api.post("/task", values);
                  if (!res.ok) throw res;
                  toast.success("Task created!");
                  setOpen(false);
                  setTasks((prev) => [...prev, res.data]); // Mise à jour de la liste des tâches
                } catch (e) {
                  console.log(e);
                  toast.error("Error creating task!");
                }
                setSubmitting(false);
              }}>
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <React.Fragment>
                  <div>
                    <div className="flex justify-between flex-wrap">
                      <div className="w-full md:w-[48%] mt-2">
                        <div className="text-[14px] text-[#212325] font-medium">Name</div>
                        <input
                          className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="w-full md:w-[48%] mt-2">
                        <div className="text-[14px] text-[#212325] font-medium">Description</div>
                        <textarea
                          className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between flex-wrap mt-3">
                      <div className="w-full md:w-[48%] mt-2">
                        <div className="text-[14px] text-[#212325] font-medium">Status</div>
                        <select
                          className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                          name="status"
                          value={values.status}
                          onChange={handleChange}>
                          <option value="todo">To Do</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                      <div className="w-full md:w-[48%] mt-2">
                        <div className="text-[14px] text-[#212325] font-medium">Project</div>
                        <select
                          className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                          name="projectId"
                          value={values.projectId}
                          onChange={handleChange}>
                          <option value="">Select a project</option>
                          {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full md:w-[48%] mt-2">
                      <div className="text-[14px] text-[#212325] font-medium">Assign to User</div>
                      <select
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        name="userId"
                        value={values.userId}
                        onChange={handleChange}>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full mt-2">
                      <div className="text-[14px] text-[#212325] font-medium">Due Date</div>
                      <input
                        className="projectsInput text-[14px] font-normal text-[#212325] rounded-[10px]"
                        name="dueDate"
                        type="date"
                        value={values.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <br />
                  <LoadingButton
                    className="mt-[1rem] bg-[#0560FD] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]"
                    loading={isSubmitting}
                    onClick={handleSubmit}>
                    Save
                  </LoadingButton>
                </React.Fragment>
              )}
            </Formik>
          </div>
        </div>
      ) : null}
    </div>
  );
  
};

const FilterStatus = ({ filter, setFilter }) => {
  return (
    <div className="flex">
      <select
        className="w-[180px] bg-[#FFFFFF] text-[14px] text-[#212325] font-normal py-2 px-[14px] rounded-[10px] border-r-[16px] border-[transparent] cursor-pointer"
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
        <option disabled>Status</option>
        <option value={""}>All status</option>
        {[
          { value: "todo", label: "To Do" },
          { value: "inprogress", label: "In Progress" },
          { value: "done", label: "Done"}
        ].map((e) => {
          return (
            <option key={e.value} value={e.value} label={e.label}>
              {e.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const TasksCard = ({ hit, users, setTasks }) => {

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        const res = await api.remove(`/task/${taskId}`);
        if (!res.ok) throw res;
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete the task.");
      }
    }
  };
  
  const statusLabel = (status) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "inprogress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return "Unknown";
    }
  };

  return (
    <ul>
        <div key={hit._id} className="border-b p-2">
          <p>Name: {hit.name}</p>
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${statusColor(hit.status)}`}>
              {statusLabel(hit.status)}
            </span>
          <p>Due date: {format(new Date(hit.dueDate), "dd MMMM yyyy")}</p>
          <p>Assigned to: {users.find((user) => user._id === hit.userId)?.name || "Unassigned"}</p>
          <div className="flex space-x-2 justify-end">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              onClick={() => handleDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
    </ul>
  );
};



export default TaskList;

const statusColor = (status) => {
  switch (status) {
    case "todo":
      return "bg-yellow-500";
    case "inprogress":
      return "bg-blue-500";
    case "done":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
