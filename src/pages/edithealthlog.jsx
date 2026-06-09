import React, { useEffect, useState } from "react";
import API from "../api/axiosinstance";
import Sidebar from "../components/sidebar";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditHealthLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);

  const fetchLog = async () => {
    try {
      const res = await API.get(`/api/healthlogs/user/${localStorage.getItem("userId")}`);
      const found = res.data.find((l) => l._id === id);
      setLog(found);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLog();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/healthlogs/${id}`, log);
      navigate("/healthlogs");
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  if (!log) return <p>Loading...</p>;

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container mt-4" style={{ marginLeft: 260 }}>
        <Card className="p-4 shadow-sm">
          <h3>Edit Health Log</h3>

          <Form onSubmit={handleUpdate}>
            <Form.Group>
              <Form.Label>Blood Pressure</Form.Label>
              <Form.Control
                value={log.vitals.bloodPressure}
                onChange={(e) => setLog({ ...log, vitals: { ...log.vitals, bloodPressure: e.target.value } })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Sugar Level</Form.Label>
              <Form.Control
                value={log.vitals.sugarLevel}
                type="number"
                onChange={(e) => setLog({ ...log, vitals: { ...log.vitals, sugarLevel: e.target.value } })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control
                value={log.vitals.weight}
                type="number"
                onChange={(e) => setLog({ ...log, vitals: { ...log.vitals, weight: e.target.value } })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Temperature</Form.Label>
              <Form.Control
                value={log.vitals.temperature}
                type="number"
                onChange={(e) =>
                  setLog({ ...log, vitals: { ...log.vitals, temperature: e.target.value } })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Heart Rate</Form.Label>
              <Form.Control
                value={log.vitals.heartRate}
                type="number"
                onChange={(e) =>
                  setLog({ ...log, vitals: { ...log.vitals, heartRate: e.target.value } })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={log.notes}
                onChange={(e) => setLog({ ...log, notes: e.target.value })}
              />
            </Form.Group>

            <Button className="mt-3" variant="primary" type="submit">
              Update Log
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditHealthLog;
