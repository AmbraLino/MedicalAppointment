import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminDepartmentPanel = () => {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchDepartments = () => {
        axios.get("http://localhost:5000/api/departments")
            .then(res => setDepartments(res.data))
            .catch(err => setError("Could not load departments."));
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // FUNKSIONALI I FSHIRJES (DELETE)
    const handleDelete = async (mongoId) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await axios.delete(`http://localhost:5000/api/departments/${mongoId}`, { withCredentials: true });
                setSuccess("Department deleted successfully!");
                setError("");
                fetchDepartments(); // Rifresko listën menjëherë
                setTimeout(() => setSuccess(""), 2000);
            } catch (err) {
                setError("Delete failed: " + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Manage Departments</h2>
                <Link to="/admin/departments/create"><Button variant="success">Add New Department</Button></Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {departments.length === 0 ? (
                <Alert variant="info" className="text-center">No departments found in Database.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>URL ID</th>
                            <th>Title</th>
                            <th>Treatments Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dept => (
                            <tr key={dept._id}>
                                <td><code>{dept.id}</code></td>
                                <td>{dept.title}</td>
                                <td>{dept.treatments ? dept.treatments.length : 0} treatments</td>
                                <td>
                                    {/* Edit - kalon emrin te URL (p.sh: /edit/emergency) */}
                                    <Link to={`/admin/departments/edit/${dept.id}`}>
                                        <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                    </Link>

                                    {/* Delete - TANI KALON dept._id E VËRTETË TË MONGODB */}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(dept._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminDepartmentPanel;