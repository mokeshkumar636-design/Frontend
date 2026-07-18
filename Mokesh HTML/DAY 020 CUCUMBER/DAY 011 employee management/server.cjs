const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// -------------------- Upload Folder --------------------
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// -------------------- Employee Storage --------------------
let employees = [];

// -------------------- Get All Employees --------------------
app.get("/api/employees", (req, res) => {
    res.json(employees);
});

// -------------------- Get Employee By ID --------------------
app.get("/api/employees/:id", (req, res) => {
    const employee = employees.find(emp => emp.id === req.params.id);

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.json(employee);
});

// -------------------- Add Employee --------------------
app.post("/api/employees", (req, res) => {

    const employee = {
        id: req.body.id || `EMP${Date.now()}`,
        name: req.body.name,
        role: req.body.role,
        department: req.body.department,
        email: req.body.email,
        phone: req.body.phone,
        salary: req.body.salary,
        dateOfJoining: req.body.dateOfJoining,
        status: req.body.status
    };

    employees.push(employee);

    res.json({
        message: "Employee Added Successfully",
        employee
    });
});

// -------------------- Update Employee --------------------
app.put("/api/employees/:id", (req, res) => {

    const index = employees.findIndex(emp => emp.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    employees[index] = {
        ...employees[index],
        ...req.body
    };

    res.json({
        message: "Employee Updated Successfully",
        employee: employees[index]
    });
});

// -------------------- Delete Employee --------------------
app.delete("/api/employees/:id", (req, res) => {

    employees = employees.filter(emp => emp.id !== req.params.id);

    res.json({
        message: "Employee Deleted Successfully"
    });
});

// -------------------- Upload Excel --------------------
app.post("/upload", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    try {

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet);

        const uploadedEmployees = rows.map((row, index) => ({

            id: row.ID || row.Id || row.id || `EMP${employees.length + index + 1}`,

            name: row.Name || row.name || "",

            role: row.Role || row.role || "",

            department: row.Department || row.department || "",

            email: row.Email || row.email || "",

            phone: String(row.Phone || row.phone || ""),

            salary: Number(row.Salary || row.salary || 0),

            dateOfJoining:
                row.DateOfJoining ||
                row["Date of Joining"] ||
                new Date().toISOString().split("T")[0],

            status: row.Status || "Active"

        }));

        employees = [...employees, ...uploadedEmployees];

        fs.unlinkSync(req.file.path);

        res.json({
            message: "Excel Uploaded Successfully",
            totalEmployees: employees.length,
            employees
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Error reading Excel file"
        });

    }

});

// -------------------- Home --------------------
app.get("/", (req, res) => {
    res.send("Employee API Running...");
});

// -------------------- Start Server --------------------
app.listen(5000, () => {
    console.log("=================================");
    console.log("Employee API Started Successfully");
    console.log("http://localhost:5000");
    console.log("=================================");
});