const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample Employee Data
let employees = [
  {
    id: "EMP-1001",
    name: "Ramesh Krishnan",
    role: "Software Engineer",
    department: "Engineering",
    email: "ramesh@gmail.com",
    phone: "9876543210",
    salary: 50000,
    status: "Active"
  }
];

// GET API
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

// POST API
app.post("/api/employees", (req, res) => {
  const employee = req.body;
  employees.push(employee);
  res.json({
    message: "Employee Added Successfully",
    employee
  });
});

// DELETE API
app.delete("/api/employees/:id", (req, res) => {
  employees = employees.filter(emp => emp.id !== req.params.id);

  res.json({
    message: "Employee Deleted Successfully"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});