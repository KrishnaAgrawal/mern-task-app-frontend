const TaskForm = ({
  createTask,
  name,
  handleInputChange,
  isEditing,
  updateTask,
}) => {
  return (
    <form className="task-form" onSubmit={isEditing ? updateTask : createTask}>
      <input
        type="text"
        placeholder={isEditing ? "Update a Task" : "Add a Task"}
        name="name"
        value={name}
        onChange={handleInputChange}
      />
      <button className="" type="submit">
        {isEditing ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default TaskForm;
