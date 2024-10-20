type TaskProps = {
    task: {
      title: string;
      description: string;
      price: number;
      skills: string[];
      location: string;
    };
  };
  
  const TaskCard = ({ task }: TaskProps) => {
    return (
      <div className="p-4 bg-gray-700 rounded-lg text-white text-xl">
        <p><b className="text-blue-500">Task</b> : {task.title}</p>
        <p><b className="text-red-500">Discription</b> : {task.description}</p>
        <p><b className="text-green-500">Salary</b> : {task.price}</p>
        <p><b className="text-purple-500">Skills</b> : {task.skills}</p>
        <p><b className="text-yellow-500">Location</b> : {task.location}</p>
      </div>
    );
  };
  
  export default TaskCard;
  