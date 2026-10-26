
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';

const MAX_CREDITS = 18;
const MAX_ACTIVITIES = 5;

const student = {
  name: 'Yenus Bahta',
  department: 'Computer Science and Engineering',
  year: '3rd Year',
  university: 'Adama Science and Technology University',
  studentId: 'Demo ID',
  email: 'student@example.com',
};

const initialCourses = [
  { code: 'CS301', name: 'Data Structures and Algorithms', credits: 3 },
  { code: 'CS302', name: 'Database Management Systems', credits: 3 },
  { code: 'CS303', name: 'Computer Networks', credits: 3 },
  { code: 'CS304', name: 'Operating Systems', credits: 4 },
  { code: 'CS305', name: 'Software Engineering', credits: 3 },
  { code: 'CS306', name: 'Artificial Intelligence', credits: 4 },
  { code: 'CS307', name: 'Web Development', credits: 3 },
  { code: 'CS308', name: 'Information Retrieval', credits: 3 },
  { code: 'CS309', name: 'Computer Architecture', credits: 4 },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [creditFilter, setCreditFilter] = useState('all');
  const [registrationMessage, setRegistrationMessage] = useState('');

  const [registeredCourses, setRegisteredCourses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem('campusConnectCourses');

      if (savedCourses !== null) {
        const parsedCourses = JSON.parse(savedCourses);

        if (
          Array.isArray(parsedCourses) &&
          parsedCourses.every((code) =>
            initialCourses.some((course) => course.code === code)
          )
        ) {
          return [...new Set(parsedCourses)];
        }
      }
    } catch {
      // Use the default course if saved data is invalid.
    }

    return ['CS301'];
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    try {
      const savedActivity = JSON.parse(
        localStorage.getItem('campusConnectActivity') || '[]'
      );

      if (
        Array.isArray(savedActivity) &&
        savedActivity.every(
          (activity) =>
            activity &&
            typeof activity.id === 'string' &&
            typeof activity.message === 'string' &&
            typeof activity.createdAt === 'string'
        )
      ) {
        return savedActivity.slice(0, MAX_ACTIVITIES);
      }
    } catch {
      // Start with an empty activity list if saved data is invalid.
    }

    return [];
  });

  const myCourses = initialCourses.filter((course) =>
    registeredCourses.includes(course.code)
  );

  const registeredCredits = myCourses.reduce(
    (total, course) => total + course.credits,
    0
  );

  const creditProgress = Math.min(
    (registeredCredits / MAX_CREDITS) * 100,
    100
  );

  function handleRegistration(courseCode) {
    const isRegistered = registeredCourses.includes(courseCode);

    const selectedCourse = initialCourses.find(
      (course) => course.code === courseCode
    );

    if (!selectedCourse) return;

    if (
      !isRegistered &&
      registeredCredits + selectedCourse.credits > MAX_CREDITS
    ) {
      setRegistrationMessage(
        `Registration denied. You can register for a maximum of ${MAX_CREDITS} credits.`
      );
      return;
    }

    const updatedCourses = isRegistered
      ? registeredCourses.filter((code) => code !== courseCode)
      : [...registeredCourses, courseCode];

    setRegisteredCourses(updatedCourses);

    localStorage.setItem(
      'campusConnectCourses',
      JSON.stringify(updatedCourses)
    );

    const newActivity = {
      id: `${Date.now()}-${courseCode}`,
      type: isRegistered ? 'drop' : 'register',
      message: isRegistered
        ? `Dropped ${courseCode} — ${selectedCourse.name}`
        : `Registered for ${courseCode} — ${selectedCourse.name}`,
      createdAt: new Date().toISOString(),
    };

    const updatedActivity = [
      newActivity,
      ...recentActivity,
    ].slice(0, MAX_ACTIVITIES);

    setRecentActivity(updatedActivity);

    localStorage.setItem(
      'campusConnectActivity',
      JSON.stringify(updatedActivity)
    );

    setRegistrationMessage(
      isRegistered
        ? `${courseCode} dropped successfully.`
        : `${courseCode} registered successfully.`
    );
  }

  const filteredCourses = initialCourses.filter((course) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      course.name.toLowerCase().includes(search) ||
      course.code.toLowerCase().includes(search);

    const matchesCredits =
      creditFilter === 'all' ||
      course.credits === Number(creditFilter);

    return matchesSearch && matchesCredits;
  });

  return (
    <div className="app">
      <Navbar />

      <main className="dashboard" id="dashboard">
        <section className="welcome-section">
          <p className="semester-label">YOUR ACADEMIC SPACE</p>
          <h1>Welcome back, {student.name.split(' ')[0]}! 👋</h1>
          <p>
            Stay organized, manage your courses, and keep moving
            toward your academic goals.
          </p>

          <div className="semester-info">
            <span>Current semester</span>
            <strong>Semester 1 · Demo</strong>
          </div>
        </section>

        <section className="student-profile" aria-label="Student profile">
          <div className="profile-avatar" aria-hidden="true">
            {student.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </div>

          <div className="profile-details">
            <p className="profile-label">STUDENT PROFILE</p>
            <h2>{student.name}</h2>
            <p className="profile-department">{student.department}</p>

            <div className="profile-meta">
              <span>
                <span aria-hidden="true">🎓</span> {student.year}
              </span>
              <span>
                <span aria-hidden="true">🏫</span> ASTU
              </span>
              <span>
                <span aria-hidden="true">🆔</span> {student.studentId}
              </span>
            </div>

            <p className="profile-email">
              <span aria-hidden="true">✉</span> {student.email}
            </p>

            <p className="profile-university">{student.university}</p>
          </div>

          <div className="profile-status">
            <span className="profile-status-dot" />
            Demo Profile
          </div>
        </section>

        <section className="summary-cards" aria-label="Academic summary">
          <article className="summary-card">
            <div className="summary-card-heading">
              <span className="summary-icon courses-icon" aria-hidden="true">
                📚
              </span>
              <span className="summary-card-label">Enrolled Courses</span>
            </div>
            <p className="summary-number">{myCourses.length}</p>
            <p className="summary-description">
              Your registered courses
            </p>
          </article>

          <article className="summary-card">
            <div className="summary-card-heading">
              <span className="summary-icon credits-icon" aria-hidden="true">
                📊
              </span>
              <span className="summary-card-label">Registered Credits</span>
            </div>

            <p className="summary-number">
              {registeredCredits}
              <span className="number-limit"> / {MAX_CREDITS}</span>
            </p>

            <p className="summary-description">
              Maximum demo credit limit
            </p>

            <div
              className="credit-progress-track"
              role="progressbar"
              aria-label="Registered credit progress"
              aria-valuemin={0}
              aria-valuemax={MAX_CREDITS}
              aria-valuenow={registeredCredits}
            >
              <div
                className="credit-progress-fill"
                style={{ width: `${creditProgress}%` }}
              />
            </div>

            <p className="progress-caption">
              {Math.round(creditProgress)}% of demo limit used
            </p>
          </article>

          <article className="summary-card">
            <div className="summary-card-heading">
              <span className="summary-icon gpa-icon" aria-hidden="true">
                ⭐
              </span>
              <span className="summary-card-label">Current GPA</span>
            </div>
            <p className="summary-number">3.75</p>
            <p className="summary-description">Out of 4.00 · Sample value</p>
          </article>
        </section>

        <section
          className="courses-section activity-section"
          id="recent-activity"
        >
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">YOUR LATEST UPDATES</p>
              <h2>Recent Activity</h2>
              <p className="section-description">
                Keep track of your latest course actions.
              </p>
            </div>

            <span className="activity-count">
              {recentActivity.length} / {MAX_ACTIVITIES}
            </span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon" aria-hidden="true">
                🗓️
              </span>
              <h3>No activity yet</h3>
              <p>
                Register for or drop a course to see your recent
                activity here.
              </p>
            </div>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <article className="activity-item" key={activity.id}>
                  <div
                    className={`activity-icon ${
                      activity.type === 'drop'
                        ? 'activity-icon-drop'
                        : 'activity-icon-register'
                    }`}
                    aria-hidden="true"
                  >
                    {activity.type === 'drop' ? '−' : '✓'}
                  </div>

                  <div className="activity-content">
                    <h3>{activity.message}</h3>
                    <p>
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`activity-type ${
                      activity.type === 'drop'
                        ? 'activity-type-drop'
                        : 'activity-type-register'
                    }`}
                  >
                    {activity.type === 'drop' ? 'Dropped' : 'Registered'}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="courses-section" id="my-courses">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">YOUR LEARNING</p>
              <h2>My Courses</h2>
              <p className="section-description">
                Manage the courses you are currently registered for.
              </p>
            </div>
            <span className="section-count">{myCourses.length} courses</span>
          </div>

          {myCourses.length === 0 ? (
            <p className="no-results">
              You have not registered for any courses yet.
              Visit the course catalog below to get started.
            </p>
          ) : (
            <div className="course-list">
              {myCourses.map((course) => (
                <article className="course-card" key={course.code}>
                  <div className="course-card-info">
                    <p className="course-code">{course.code}</p>
                    <h3>{course.name}</h3>
                    <p className="course-credits">
                      {course.credits} credits
                    </p>
                  </div>

                  <button
                    className="course-button drop-button"
                    onClick={() => handleRegistration(course.code)}
                  >
                    Drop Course
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="courses-section" id="course-catalog">
          <div className="section-heading-row">
            <div>
              <p className="section-eyebrow">EXPLORE YOUR OPTIONS</p>
              <h2>Course Catalog</h2>
              <p className="section-description">
                Find courses and manage your registrations.
              </p>
            </div>
            <span className="section-count">
              {filteredCourses.length} results
            </span>
          </div>

          <div className="course-controls">
            <div className="search-wrapper">
              <span aria-hidden="true">⌕</span>
              <input
                className="course-search"
                type="text"
                placeholder="Search by course name or code..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search courses by name or code"
              />
            </div>

            <select
              className="credit-filter"
              value={creditFilter}
              onChange={(event) => setCreditFilter(event.target.value)}
              aria-label="Filter courses by credits"
            >
              <option value="all">All credits</option>
              <option value="3">3 credits</option>
              <option value="4">4 credits</option>
            </select>
          </div>

          {registrationMessage && (
            <p
              className="registration-message"
              role="status"
              aria-live="polite"
            >
              <span aria-hidden="true">●</span> {registrationMessage}
            </p>
          )}

          {filteredCourses.length === 0 ? (
            <p className="no-results">
              No courses found. Try changing your search or filter.
            </p>
          ) : (
            <div className="course-list">
              {filteredCourses.map((course) => {
                const isRegistered = registeredCourses.includes(course.code);

                return (
                  <article className="course-card" key={course.code}>
                    <div className="course-card-info">
                      <p className="course-code">{course.code}</p>
                      <h3>{course.name}</h3>
                      <p className="course-credits">
                        {course.credits} credits
                      </p>
                      <p
                        className={
                          isRegistered
                            ? 'status-registered'
                            : 'status-available'
                        }
                      >
                        {isRegistered ? '✓ Registered' : 'Available'}
                      </p>
                    </div>

                    <button
                      className={
                        isRegistered
                          ? 'course-button drop-button'
                          : 'course-button'
                      }
                      onClick={() => handleRegistration(course.code)}
                    >
                      {isRegistered ? 'Drop Course' : '＋ Register'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <span className="footer-brand">CampusConnect</span>
          <span>Student Portal · Frontend Demo</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
