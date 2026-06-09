import React, { useEffect, useState } from "react";
import { Card, Spinner, Badge } from "react-bootstrap";
import Sidebar from "../components/sidebar";
import { getUserTasks } from "../api/taskapi";

const UserTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await getUserTasks();
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching user tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mt-4" style={{ marginLeft: 260 }}>
        <h2>My Tasks</h2>
        <p className="text-muted">Tasks assigned to you from all family groups.</p>

        {tasks.length === 0 && (
          <p className="mt-3">You have no assigned tasks.</p>
        )}

        {tasks.map((task) => (
          <Card key={task._id} className="mt-3 p-3">
            <h5>{task.title}</h5>
            <p>{task.description}</p>

            <p>
              <strong>Family:</strong> {task.familyId?.name}
            </p>

            <p>
              <strong>Due:</strong>{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
            </p>

            <Badge
              bg={
                task.status === "Completed"
                  ? "success"
                  : task.status === "In Progress"
                  ? "warning"
                  : "secondary"
              }
            >
              {task.status}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserTasksPage;
