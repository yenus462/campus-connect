
import { useState } from "react";
import "./Announcements.css";

const initialAnnouncements = [
  {
    id: 1,
    title: "Midterm Examination Schedule",
    category: "Examination",
    date: "2026-11-05",
    description:
      "The midterm examination schedule has been announced. Students should check their course schedules and prepare accordingly.",
    important: true,
  },
  {
    id: 2,
    title: "Course Registration Reminder",
    category: "Academic",
    date: "2026-11-08",
    description:
      "Students are reminded to review their registered courses and make any necessary changes before the registration deadline.",
    important: true,
  },
  {
    id: 3,
    title: "Library Service Update",
    category: "General",
    date: "2026-11-10",
    description:
      "The university library will provide extended study hours during the examination preparation period.",
    important: false,
  },
  {
    id: 4,
    title: "Web Development Workshop",
    category: "Event",
    date: "2026-11-12",
    description:
      "A practical web development workshop will be organized for interested students. More details will be shared soon.",
    important: false,
  },
];

function Announcements() {
  const [announcements] = useState(initialAnnouncements);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Academic",
    "Examination",
    "Event",
    "General",
  ];

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter(
          (announcement) =>
            announcement.category === selectedCategory
        );

  return (
    <section className="announcements-section">
      <div className="announcements-header">
        <div>
          <h2>University Announcements</h2>
          <p>Stay updated with the latest university news.</p>
        </div>

        <span className="announcement-count">
          {filteredAnnouncements.length} Announcements
        </span>
      </div>

      <div className="announcement-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category ? "active" : ""
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <article
              className="announcement-card"
              key={announcement.id}
            >
              <div className="announcement-card-top">
                <span className="announcement-category">
                  {announcement.category}
                </span>

                {announcement.important && (
                  <span className="important-label">
                    Important
                  </span>
                )}
              </div>

              <h3>{announcement.title}</h3>

              <p>{announcement.description}</p>

              <div className="announcement-date">
                <span>Published:</span>
                <time dateTime={announcement.date}>
                  {new Date(
                    announcement.date + "T00:00:00"
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </article>
          ))
        ) : (
          <p className="no-announcements">
            No announcements in this category.
          </p>
        )}
      </div>
    </section>
  );
}

export default Announcements;
