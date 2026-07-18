const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let employees = [
  {
    id: "EMP001",
    name: "Mokesh Kumar",
    email: "mokesh@gmail.com",
    department: "IT"
  }
];

// Get all employees
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

// Add employee
app.post("/api/employees", (req, res) => {
  employees.push(req.body);
  res.json({
    message: "Employee Added Successfully"
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});