import "./App.css";

function App() {
  const student = {
    name: "Mokesh Kumar",
    rollNo: "23ECE101",
    department: "ECE",
    age: 18,
    height: "175 cm",
    marks: 88,
    present: true,
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🎓 Student Details</h1>

        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Roll No:</strong> {student.rollNo}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>Age:</strong> {student.age}</p>
        <p><strong>Height:</strong> {student.height}</p>
        <p><strong>Marks:</strong> {student.marks}</p>

        <h2 className={student.present ? "present" : "absent"}>
          {student.present ? "✅ Present" : "❌ Absent"}
        </h2>
      </div>
    </div>
  );
}

export default App;