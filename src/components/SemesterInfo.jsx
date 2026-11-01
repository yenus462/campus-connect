
import "./SemesterInfo.css";

function SemesterInfo() {
  const semesterDetails = [
    {
      label: "Academic Year",
      value: "2026/2027",
      icon: "🎓",
    },
    {
      label: "Current Semester",
      value: "Semester I",
      icon: "📚",
    },
    {
      label: "Registered Credits",
      value: "18 Credits",
      icon: "📊",
    },
    {
      label: "Semester Status",
      value: "In Progress",
      icon: "🟢",
    },
  ];

  const importantDates = [
    {
      title: "Semester Begins",
      date: "November 2, 2026",
    },
    {
      title: "Midterm Examination",
      date: "November 16, 2026",
    },
    {
      title: "Course Registration Deadline",
      date: "November 20, 2026",
    },
    {
      title: "Final Examination",
      date: "January 25, 2027",
    },
  ];

  return (
    <section className="semester-section">
      <div className="semester-header">
        <div>
          <h2>Semester Information</h2>
          <p>Overview of your current academic semester.</p>
        </div>
        <span className="semester-badge">2026/2027</span>
      </div>

      <div className="semester-stats">
        {semesterDetails.map((item) => (
          <div className="semester-stat-card" key={item.label}>
            <span className="semester-icon">{item.icon}</span>
            <div>
              <p>{item.label}</p>
              <h3>{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="semester-dates">
        <h3>Important Academic Dates</h3>

        <div className="semester-date-list">
          {importantDates.map((item, index) => (
            <div className="semester-date-item" key={item.title}>
              <span className="date-number">{index + 1}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SemesterInfo;
