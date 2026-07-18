require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

let useInMemoryStore = false;
let employeeStore = [];

const initialSeed = [
    {
        id: 'EMP-1001',
        name: 'Ramesh Krishnan',
        role: 'Senior Software Engineer',
        department: 'Engineering',
        email: 'ramesh.k@company.com',
        phone: '+91 98401 23456',
        salary: 1800000,
        dateOfJoining: '2021-03-15',
        status: 'Active'
    },
    {
        id: 'EMP-1002',
        name: 'Priya Swaminathan',
        role: 'Lead UI/UX Designer',
        department: 'Design',
        email: 'priya.s@company.com',
        phone: '+91 98402 34567',
        salary: 1500000,
        dateOfJoining: '2022-05-10',
        status: 'Active'
    },
    {
        id: 'EMP-1003',
        name: 'Venkatesh Prasad',
        role: 'Product Manager',
        department: 'Product',
        email: 'venkatesh.p@company.com',
        phone: '+91 98403 45678',
        salary: 2000000,
        dateOfJoining: '2020-11-01',
        status: 'Active'
    },
    {
        id: 'EMP-1004',
        name: 'Lakshmi Narayanan',
        role: 'HR Director',
        department: 'Human Resources',
        email: 'lakshmi.n@company.com',
        phone: '+91 98404 56789',
        salary: 1600000,
        dateOfJoining: '2019-08-20',
        status: 'Active'
    },
    {
        id: 'EMP-1005',
        name: 'Sandeep Naidu',
        role: 'DevOps Engineer',
        department: 'Engineering',
        email: 'sandeep.n@company.com',
        phone: '+91 98405 67890',
        salary: 1400000,
        dateOfJoining: '2023-01-15',
        status: 'On Leave'
    },
    {
        id: 'EMP-1006',
        name: 'Meera Hegde',
        role: 'QA Specialist',
        department: 'QA',
        email: 'meera.h@company.com',
        phone: '+91 98406 78901',
        salary: 950000,
        dateOfJoining: '2023-06-25',
        status: 'Active'
    },
    {
        id: 'EMP-1007',
        name: 'Karthik Subramanian',
        role: 'Frontend Developer',
        department: 'Engineering',
        email: 'karthik.s@company.com',
        phone: '+91 98407 89012',
        salary: 1100000,
        dateOfJoining: '2024-02-18',
        status: 'Active'
    },
    {
        id: 'EMP-1008',
        name: 'Divya Reddy',
        role: 'Marketing Specialist',
        department: 'Marketing',
        email: 'divya.r@company.com',
        phone: '+91 98408 90123',
        salary: 850000,
        dateOfJoining: '2023-09-05',
        status: 'Inactive'
    },
    {
        id: 'EMP-1009',
        name: 'Vignesh Rajan',
        role: 'Backend Engineer',
        department: 'Engineering',
        email: 'vignesh.r@company.com',
        phone: '+91 98409 01234',
        salary: 1300000,
        dateOfJoining: '2022-10-12',
        status: 'Active'
    },
    {
        id: 'EMP-1010',
        name: 'Ananth Ramaswamy',
        role: 'Financial Analyst',
        department: 'Finance',
        email: 'ananth.r@company.com',
        phone: '+91 98410 12345',
        salary: 1250000,
        dateOfJoining: '2021-07-30',
        status: 'Active'
    }
];

employeeStore = [...initialSeed];

// -------------------- MongoDB Connection --------------------
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/employee_management";
let Employee = null;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
        console.log("Connected to MongoDB successfully!");
        useInMemoryStore = false;

        const employeeSchema = new mongoose.Schema({
            id: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            role: { type: String, required: true },
            department: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            salary: { type: Number, required: true },
            dateOfJoining: { type: String, required: true },
            status: { type: String, required: true, default: "Active" }
        }, { timestamps: true });

        Employee = mongoose.model("Employee", employeeSchema);
        const existing = await Employee.find();
        if (existing.length > 0) {
            employeeStore = existing.map(emp => ({ ...emp.toObject() }));
        }
    } catch (err) {
        console.warn("MongoDB unavailable, using in-memory employee store.");
        useInMemoryStore = true;
        Employee = null;
    }
};

connectToDatabase();

// -------------------- Upload Folder --------------------
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// -------------------- Auth Login --------------------
app.post("/api/auth/login", async (req, res) => {
    const { username, password, role } = req.body;

    if (role === 'admin') {
        if (username === 'admin' && password === 'admin123') {
            return res.json({ success: true, role: 'admin', user: null, message: 'Admin login successful' });
        }
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    if (role === 'employee') {
        try {
            const employee = useInMemoryStore
                ? employeeStore.find(emp => emp.id === username || emp.email?.toLowerCase() === username.toLowerCase())
                : await Employee.findOne({
                    $or: [
                        { id: username },
                        { email: username.toLowerCase() }
                    ]
                });
            if (employee && password === 'employee123') {
                return res.json({ success: true, role: 'employee', user: employee, message: 'Employee login successful' });
            }
            return res.status(401).json({ success: false, message: 'Invalid Employee ID/Email or password' });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Auth error: ' + err.message });
        }
    }

    res.status(400).json({ success: false, message: 'Invalid role specified' });
});

// -------------------- Employee Stats --------------------
app.get("/api/employees/stats", async (req, res) => {
    try {
        const all = useInMemoryStore ? employeeStore : await Employee.find();
        const total = all.length;
        const active   = all.filter(e => e.status === 'Active').length;
        const onLeave  = all.filter(e => e.status === 'On Leave').length;
        const inactive = all.filter(e => e.status === 'Inactive').length;

        const deptBreakdown = {};
        all.forEach(e => { deptBreakdown[e.department] = (deptBreakdown[e.department] || 0) + 1; });

        const totalPayroll  = all.reduce((s, e) => s + Number(e.salary || 0), 0);
        const avgSalary     = total > 0 ? Math.round(totalPayroll / total) : 0;

        const recentHires = all
            .filter(e => e.dateOfJoining)
            .sort((a, b) => new Date(b.dateOfJoining) - new Date(a.dateOfJoining))
            .slice(0, 5)
            .map(e => ({ id: e.id, name: e.name, role: e.role, department: e.department, dateOfJoining: e.dateOfJoining }));

        res.json({ total, active, onLeave, inactive, deptBreakdown, totalPayroll, avgSalary, recentHires });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats: ' + err.message });
    }
});

// -------------------- Get All Employees --------------------
app.get("/api/employees", async (req, res) => {
    try {
        const employees = useInMemoryStore
            ? [...employeeStore].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            : await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Error fetching employees" });
    }
});

// -------------------- Get Employee By ID --------------------
app.get("/api/employees/:id", async (req, res) => {
    try {
        const employee = useInMemoryStore
            ? employeeStore.find(emp => emp.id === req.params.id)
            : await Employee.findOne({ id: req.params.id });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(employee);
    } catch (err) {
        console.error("Error fetching employee:", err);
        res.status(500).json({ message: "Error fetching employee" });
    }
});

// -------------------- Add Employee --------------------
app.post("/api/employees", async (req, res) => {
    try {
        let empId = req.body.id;
        if (!empId) {
            const latestEmp = useInMemoryStore
                ? [...employeeStore].sort((a, b) => (b.id || '').localeCompare(a.id || '')).find(Boolean)
                : await Employee.findOne({ id: /^EMP-/ }).sort({ createdAt: -1 });
            let nextNum = 1001;
            if (latestEmp) {
                const numericPart = parseInt(latestEmp.id.replace("EMP-", ""), 10);
                if (!isNaN(numericPart)) {
                    nextNum = numericPart + 1;
                }
            }
            empId = `EMP-${nextNum}`;
        }

        const employee = useInMemoryStore
            ? { ...req.body, id: empId, salary: Number(req.body.salary), dateOfJoining: req.body.dateOfJoining || new Date().toISOString().split("T")[0], status: req.body.status || "Active" }
            : new Employee({
                id: empId,
                name: req.body.name,
                role: req.body.role,
                department: req.body.department,
                email: req.body.email,
                phone: req.body.phone,
                salary: Number(req.body.salary),
                dateOfJoining: req.body.dateOfJoining || new Date().toISOString().split("T")[0],
                status: req.body.status || "Active"
            });

        if (useInMemoryStore) {
            employeeStore = [employee, ...employeeStore.filter(entry => entry.id !== empId)];
        } else {
            await employee.save();
        }

        res.json({
            message: "Employee Added Successfully",
            employee
        });
    } catch (err) {
        console.error("Error adding employee:", err);
        res.status(500).json({ message: "Error adding employee: " + err.message });
    }
});

// -------------------- Update Employee --------------------
app.put("/api/employees/:id", async (req, res) => {
    try {
        let employee;
        if (useInMemoryStore) {
            employeeStore = employeeStore.map(entry => entry.id === req.params.id ? { ...entry, ...req.body } : entry);
            employee = employeeStore.find(entry => entry.id === req.params.id);
        } else {
            employee = await Employee.findOneAndUpdate(
                { id: req.params.id },
                { $set: req.body },
                { new: true }
            );
        }

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee Updated Successfully",
            employee
        });
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ message: "Error updating employee: " + err.message });
    }
});

// -------------------- Delete Employee --------------------
app.delete("/api/employees/:id", async (req, res) => {
    try {
        let employee;
        if (useInMemoryStore) {
            const before = employeeStore.find(entry => entry.id === req.params.id);
            employeeStore = employeeStore.filter(entry => entry.id !== req.params.id);
            employee = before;
        } else {
            employee = await Employee.findOneAndDelete({ id: req.params.id });
        }

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee Deleted Successfully"
        });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ message: "Error deleting employee: " + err.message });
    }
});

// -------------------- Upload Excel --------------------
app.post("/upload", upload.single("file"), async (req, res) => {
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

        // Get max numeric ID from DB to calculate starting sequential ID for rows that don't have one
        const latestEmp = useInMemoryStore
            ? [...employeeStore].sort((a, b) => (b.id || '').localeCompare(a.id || '')).find(Boolean)
            : await Employee.findOne({ id: /^EMP-/ }).sort({ createdAt: -1 });
        let nextNum = 1001;
        if (latestEmp) {
            const numericPart = parseInt(latestEmp.id.replace("EMP-", ""), 10);
            if (!isNaN(numericPart)) {
                nextNum = numericPart + 1;
            }
        }

        const uploadedEmployees = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const empId = row.ID || row.Id || row.id || `EMP-${nextNum + i}`;

            const payload = {
                id: empId,
                name: row.Name || row.name || "Unnamed Employee",
                role: row.Role || row.role || "Staff",
                department: row.Department || row.department || "Operations",
                email: row.Email || row.email || "no-email@company.com",
                phone: String(row.Phone || row.phone || "0000000000"),
                salary: Number(row.Salary || row.salary || 0),
                dateOfJoining:
                    row.DateOfJoining ||
                    row["Date of Joining"] ||
                    new Date().toISOString().split("T")[0],
                status: row.Status || "Active"
            };
            uploadedEmployees.push(payload);
        }

        // Upsert them to the active store
        if (useInMemoryStore) {
            for (const emp of uploadedEmployees) {
                employeeStore = [
                    ...employeeStore.filter(entry => entry.id !== emp.id),
                    { ...emp, salary: Number(emp.salary) }
                ];
            }
        } else {
            for (const emp of uploadedEmployees) {
                await Employee.findOneAndUpdate(
                    { id: emp.id },
                    { $set: emp },
                    { upsert: true }
                );
            }
        }

        fs.unlinkSync(req.file.path);

        const allEmployees = useInMemoryStore
            ? [...employeeStore].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            : await Employee.find().sort({ createdAt: -1 });

        res.json({
            message: "Excel Uploaded Successfully",
            totalEmployees: allEmployees.length,
            employees: allEmployees
        });

    } catch (err) {
        console.error("Error reading Excel file:", err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: "Error reading Excel file: " + err.message
        });
    }
});

// -------------------- Reset Database --------------------
app.post("/api/employees/reset", async (req, res) => {
    try {
        if (useInMemoryStore) {
            employeeStore = [...initialSeed];
            res.json({ message: "Database Reset Successful", employees: initialSeed });
            return;
        }

        await Employee.deleteMany({});
        await Employee.insertMany(initialSeed);
        res.json({ message: "Database Reset Successful", employees: initialSeed });
    } catch (err) {
        console.error("Error resetting database:", err);
        res.status(500).json({ message: "Error resetting database: " + err.message });
    }
});

// -------------------- Home --------------------
app.get("/", (req, res) => {
    res.send("Employee DB API Running...");
});

// -------------------- Start Server --------------------
app.listen(5000, () => {
    console.log("=================================");
    console.log("Employee API Started Successfully");
    console.log("http://localhost:5000");
    console.log("=================================");
});