
import { useState } from "react";
import "./Timetable.css";

const weeklySchedule = {
  Monday: [
    {
      time: "8:00 AM - 10:00 AM",
      course: "Data Structures and Algorithms",
      code: "CS301",
      room: "Room 204",
      type: "Lecture",
    },
    {
      time: "10:30 AM - 12:30 PM",
      course: "Database Management Systems",
      code: "CS302",
      room: "Lab 1",
      type: "Practical",
    },
  ],
  Tuesday: [
    {
      time: "8:00 AM - 10:00 AM",
      course: "Computer Networks",
      code: "CS303",
      room: "Room 105",
      type: "Lecture",
    },
    {
      time: "1:00 PM - 3:00 PM",
      course: "Operating Systems",
      code: "CS304",
      room: "Room 202",
      type: "Lecture",
    },
  ],
  Wednesday: [
    {
      time: "9:00 AM - 11:00 AM",
      course: "Artificial Intelligence",
      code: "CS306",
      room: "Room 301",
      type: "Lecture",
    },
    {
      time: "1:00 PM - 3:00 PM",
      course: "Web Development",
      code: "CS307",
      room: "Computer Lab 2",
      type: "Practical",
    },
  ],
  Thursday: [
    {
      time: "8:00 AM - 10:00 AM",
      course: "Software Engineering",
      code: "CS305",
      room: "Room 103",
      type: "Lecture",
    },
    {
      time: "10:30 AM - 12:30 PM",
      course: "Information Retrieval",
      code: "CS308",
      room: "Room 205",
      type: "Lecture",
    },
  ],
  Friday: [
    {
      time: "9:00 AM - 11:00 AM",
      course: "Computer Architecture",
      code: "CS309",
      room: "Room 106",
      type: "Lecture",
    },
  ],
};

const days = Object.keys(weeklySchedule);

function Timetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const classes = weeklySchedule[selectedDay];

  return (
    <section className="timetable-section">
      <div className="timetable-heading">
        <div>
          <h2>Weekly Timetable</h2>
          <p>View your classes and practical sessions.</p>
        </div>

        <span className="timetable-badge">
          <span className="timetable-status-dot"></span>
          Weekly Schedule
        </span>
      </div>

      <div className="timetable-days">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`timetable-day ${
              selectedDay === day ? "active" : ""
            }`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="timetable-class-list">
        {classes.length > 0 ? (
          classes.map((item, index) => (
            <article
              className="timetable-class-card"
              key={`${item.code}-${index}`}
            >
              <div className="timetable-time">
                <span className="timetable-time-icon">◷</span>
                <span>{item.time}</span>
              </div>

              <div className="timetable-class-info">
                <span className="timetable-course-code">
                  {item.code}
                </span>
                <h3>{item.course}</h3>
                <p>📍 {item.room}</p>
              </div>

              <span
                className={`timetable-type ${
                  item.type === "Practical" ? "practical" : "lecture"
                }`}
              >
                {item.type}
              </span>
            </article>
          ))
        ) : (
          <p>No classes scheduled for this day.</p>
        )}
      </div>

      <div className="timetable-footer">
        <span>📚 {classes.length} classes scheduled</span>
        <span>{selectedDay}</span>
      </div>
    </section>
  );
}

export default Timetable;
