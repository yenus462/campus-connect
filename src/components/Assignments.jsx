
import { useState, useEffect } from "react";
import "./Assignments.css";

const initialAssignments = [
  {
    id: 1,
    title: "Data Structures Implementation",
    course: "Data Structures and Algorithms",
    code: "CS301",
    dueDate: "2026-11-10",
    description: "Implement sorting and searching algorithms using JavaScript.",
  },
  {
    id: 2,
    title: "Database Design Project",
    course: "Database Management Systems",
    code: "CS302",
    dueDate: "2026-11-13",
    description: "Design an ER diagram and create a relational database schema.",
  },
  {
    id: 3,
    title: "Network Configuration",
    course: "Computer Networks",
    code: "CS303",
    dueDate: "2026-11-16",
    description: "Configure a small network and explain its architecture.",
  },
  {
    id: 4,
    title: "Operating Systems Research",
    course: "Operating Systems",
    code: "CS304",
    dueDate: "2026-11-20",
    description: "Prepare a short report about process scheduling algorithms.",
  },
  {
    id: 5,
    title: "React Portfolio Task",
    course: "Web Development",
    code: "CS307",
    dueDate: "2026-11-24",
    description: "Build a responsive React application with reusable components.",
  },
];

function Assignments() {
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem("campusConnectAssignments");
      return saved ? JSON.parse(saved) : initialAssignments;
    } catch {
      return initialAssignments;
    }
  });

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      "campusConnectAssignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  const markAsSubmitted = (id) => {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === id
          ? { ...assignment, status: "Submitted" }
          : assignment
      )
    );
  };

  const submittedCount = assignments.filter(
    (assignment) => assignment.status === "Submitted"
  ).length;

  const pendingCount = assignments.length - submittedCount;

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "All") return true;

    if (filter === "Submitted") {
      return assignment.status === "Submitted";
    }

    return assignment.status !== "Submitted";
  });

  const formatDate = (date) => {
    return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatus = (assignment) => {
    return assignment.status || "Pending";
  };

  return (
    <section className="assignments-section">
      <div className="assignments-heading">
        <div>
          <h2>My Assignments</h2>
          <p>Manage your coursework and submission deadlines.</p>
        </div>

        <span className="assignments-heading-icon">📝</span>
      </div>

      <div className="assignments-stats">
        <div className="assignment-stat-card">
          <span>Total Assignments</span>
          <strong>{assignments.length}</strong>
        </div>

        <div className="assignment-stat-card pending-stat">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="assignment-stat-card submitted-stat">
          <span>Submitted</span>
          <strong>{submittedCount}</strong>
        </div>
      </div>

      <div className="assignments-toolbar">
        <h3>Assignment List</h3>

        <div className="assignment-filters">
          {["All", "Pending", "Submitted"].map((item) => (
            <button
              key={item}
              type="button"
              className={`assignment-filter ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="assignments-list">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            const status = getStatus(assignment);

            return (
              <article
                className="assignment-card"
                key={assignment.id}
              >
                <div className="assignment-card-main">
                  <div className="assignment-course-code">
                    {assignment.code}
                  </div>

                  <div className="assignment-content">
                    <h4>{assignment.title}</h4>
                    <p className="assignment-course">
                      {assignment.course}
                    </p>
                    <p className="assignment-description">
                      {assignment.description}
                    </p>

                    <span className="assignment-due-date">
                      📅 Due: {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="assignment-card-actions">
                  <span
                    className={`assignment-status ${
                      status.toLowerCase()
                    }`}
                  >
                    {status}
                  </span>

                  {status !== "Submitted" && (
                    <button
                      type="button"
                      className="assignment-submit-btn"
                      onClick={() => markAsSubmitted(assignment.id)}
                    >
                      Mark as Submitted
                    </button>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="assignments-empty">
            <span>📭</span>
            <p>No {filter.toLowerCase()} assignments found.</p>
          </div>
        )}
      </div>

      <div className="assignments-progress">
        <div className="assignments-progress-heading">
          <span>Submission Progress</span>
          <strong>
            {assignments.length === 0
              ? 0
              : Math.round((submittedCount / assignments.length) * 100)}
            %
          </strong>
        </div>

        <div className="assignments-progress-track">
          <div
            className="assignments-progress-fill"
            style={{
              width:
                assignments.length === 0
                  ? "0%"
                  : `${(submittedCount / assignments.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default Assignments;
