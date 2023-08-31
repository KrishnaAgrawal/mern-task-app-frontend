import TaskForm from "./TaskForm";
import Task from "./Task";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../App";
import loadingImage from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", completed: false });
  const { name } = formData;
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${URL}/api/v1/task`);

      //   if (data.length !== 0) {
      //   }
      setTasks(data);

      toast.success("Data fetched successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Name is empty");
    }
    try {
      await axios.post(`${URL}/api/v1/task`, formData);
      setFormData({ ...formData, name: "" });
      getTasks();
      toast.success("Task added successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${URL}/api/v1/task/${id}`);
      if (res.status !== 200) {
        toast.error(res.data);
      }
      toast.success(res.data);
      getTasks();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const comTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(comTask);
  }, [tasks]);

  const getSingleTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskId(task._id);
    setIsEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Name is empty");
    }
    try {
      const res = await axios.put(`${URL}/api/v1/task/${taskId}`, formData);
      setFormData({ ...formData, name: "" });
      setIsEditing(false);
      getTasks();
      // console.log(res);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/v1/task/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={loadingImage} alt="Loading..." />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No Task Added.</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                updateTask={updateTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
