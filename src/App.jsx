
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';

import Timetable from "./components/Timetable";

import Assignments from "./components/Assignments";



const MAX_CREDITS = 18;
const MAX_ACTIVITIES = 5;

const initialStudent = {
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
  const [student, setStudent] = useState(() => {
    try {
      const savedStudent = localStorage.getItem('campusConnectStudent');

      if (savedStudent) {
        const parsedStudent = JSON.parse(savedStudent);

        if (
          parsedStudent &&
          typeof parsedStudent.name === 'string' &&
          typeof parsedStudent.department === 'string' &&
          typeof parsedStudent.year === 'string' &&
          typeof parsedStudent.studentId === 'string' &&
          typeof parsedStudent.email === 'string'
        ) {
          return { ...initialStudent, ...parsedStudent };
        }
      }
    } catch {
      // Use the sample profile if saved data is invalid.
    }

    return initialStudent;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(student);
  const [profileMessage, setProfileMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [creditFilter, setCreditFilter] = useState('all');
  const [registrationMessage, setRegistrationMessage] = useState('');

  function handleProfileInput(event) {
    const { name, value } = event.target;

    setProfileForm((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  }

  function handleProfileEdit() {
    setProfileForm(student);
    setProfileMessage('');
    setIsEditingProfile(true);
  }

  function handleProfileCancel() {
    setProfileForm(student);
    setProfileMessage('');
    setIsEditingProfile(false);
  }

  function handleProfileSave(event) {
    event.preventDefault();

    const updatedProfile = {
      ...student,
      name: profileForm.name.trim(),
      department: profileForm.department.trim(),
      year: profileForm.year.trim(),
      studentId: profileForm.studentId.trim(),
      email: profileForm.email.trim(),
      university: profileForm.university.trim(),
    };

    if (
      !updatedProfile.name ||
      !updatedProfile.department ||
      !updatedProfile.year ||
      !updatedProfile.studentId ||
      !updatedProfile.email ||
      !updatedProfile.university
    ) {
      setProfileMessage('Please complete all profile fields.');
      return;
    }

    try {
      localStorage.setItem(
        'campusConnectStudent',
        JSON.stringify(updatedProfile)
      );

      setStudent(updatedProfile);
      setProfileForm(updatedProfile);
      setProfileMessage('Profile saved on this device.');
      setIsEditingProfile(false);
    } catch {
      setProfileMessage(
        'Could not save the profile in this browser. Please try again.'
      );
    }
  }

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

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCredits =
      creditFilter === 'all' ||
      course.credits === Number(creditFilter);

    return matchesSearch && matchesCredits;
  });

  const initials = student.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <div className="app">
      <Navbar />
      <Timetable />
      <Assignments />

      <main className="dashboard">
        <section className="welcome-section">
          <div>
            <p className="section-eyebrow">STUDENT PORTAL</p>
            <h1>Welcome back, {student.name}!</h1>
            <p className="section-description">
              Manage your academic profile, courses, and registration
              in one place.
            </p>
          </div>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <p className="summary-label">Registered Courses</p>
            <h2>{myCourses.length}</h2>
            <p className="summary-detail">Courses this semester</p>
          </article>

          <article className="summary-card">
            <p className="summary-label">Registered Credits</p>
            <h2>{registeredCredits}</h2>
            <p className="summary-detail">
              Out of {MAX_CREDITS} maximum credits
            </p>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Registered credits"
              aria-valuenow={registeredCredits}
              aria-valuemin={0}
              aria-valuemax={MAX_CREDITS}
            >
              <div
                className="progress-fill"
                style={{ width: `${creditProgress}%` }}
              />
            </div>
          </article>

          <article className="summary-card">
            <p className="summary-label">Academic Year</p>
            <h2>{student.year}</h2>
            <p className="summary-detail">{student.department}</p>
          </article>

          <article className="summary-card">
            <p className="summary-label">Available Courses</p>
            <h2>{initialCourses.length - myCourses.length}</h2>
            <p className="summary-detail">Not currently registered</p>
          </article>
        </section>

        <section className="profile-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">YOUR INFORMATION</p>
              <h2>Student Profile</h2>
              <p className="section-description">
                View and update your personal and academic information.
              </p>
            </div>

            <button
              type="button"
              className="course-button"
              onClick={handleProfileEdit}
            >
              Edit Profile
            </button>
          </div>

          {profileMessage && (
            <p className="profile-message" role="status">
              {profileMessage}
            </p>
          )}

          <div className="profile-card">
            <div className="profile-avatar" aria-hidden="true">
              {initials || 'S'}
            </div>

            <div className="profile-details">
              <h3>{student.name}</h3>
              <p>{student.department}</p>

              <div className="profile-info-grid">
                <div>
                  <span>Student ID</span>
                  <strong>{student.studentId}</strong>
                </div>

                <div>
                  <span>Academic Year</span>
                  <strong>{student.year}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{student.email}</strong>
                </div>

                <div>
                  <span>University</span>
                  <strong>{student.university}</strong>
                </div>
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <form
              className="profile-edit-form"
              onSubmit={handleProfileSave}
            >
              <div className="section-heading">
                <div>
                  <h3>Edit Your Profile</h3>
                  <p className="section-description">
                    Update the fields below and save your changes.
                  </p>
                </div>
              </div>

              <div className="profile-form-grid">
                <label className="profile-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileInput}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Department</span>
                  <input
                    type="text"
                    name="department"
                    value={profileForm.department}
                    onChange={handleProfileInput}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Academic Year</span>
                  <input
                    type="text"
                    name="year"
                    value={profileForm.year}
                    onChange={handleProfileInput}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>Student ID</span>
                  <input
                    type="text"
                    name="studentId"
                    value={profileForm.studentId}
                    onChange={handleProfileInput}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>University Email</span>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileInput}
                    required
                  />
                </label>

                <label className="profile-field">
                  <span>University</span>
                  <input
                    type="text"
                    name="university"
                    value={profileForm.university}
                    onChange={handleProfileInput}
                    required
                  />
                </label>
              </div>

              {profileMessage && (
                <p role="alert">{profileMessage}</p>
              )}

              <div className="profile-form-actions">
                <button type="submit" className="course-button">
                  Save Profile
                </button>

                <button
                  type="button"
                  className="drop-button"
                  onClick={handleProfileCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="courses-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">ACADEMIC REGISTRATION</p>
              <h2>Course Registration</h2>
              <p className="section-description">
                Search courses, check credit values, and register or drop
                courses.
              </p>
            </div>
          </div>

          {registrationMessage && (
            <p className="registration-message" role="status">
              {registrationMessage}
            </p>
          )}

          <div className="course-controls">
            <input
              type="search"
              className="course-search"
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search courses"
            />

            <select
              className="credit-filter"
              value={creditFilter}
              onChange={(event) => setCreditFilter(event.target.value)}
              aria-label="Filter by credits"
            >
              <option value="all">All credits</option>
              <option value="3">3 credits</option>
              <option value="4">4 credits</option>
            </select>
          </div>

          <div className="course-list">
            {filteredCourses.length === 0 ? (
              <p className="empty-state">
                No courses match your search.
              </p>
            ) : (
              filteredCourses.map((course) => {
                const isRegistered = registeredCourses.includes(
                  course.code
                );

                return (
                  <article className="course-card" key={course.code}>
                    <div className="course-card-info">
                      <span className="course-code">{course.code}</span>
                      <h3>{course.name}</h3>
                      <p>{course.credits} credits</p>
                    </div>

                    <button
                      type="button"
                      className={
                        isRegistered ? 'drop-button' : 'course-button'
                      }
                      onClick={() => handleRegistration(course.code)}
                    >
                      {isRegistered ? 'Drop Course' : 'Register'}
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="activity-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">YOUR LATEST ACTIONS</p>
              <h2>Recent Activity</h2>
              <p className="section-description">
                A record of your recent course registration changes.
              </p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <p className="empty-state">
              No recent activity yet. Register or drop a course to see
              your activity here.
            </p>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <article className="activity-item" key={activity.id}>
                  <div className="activity-icon" aria-hidden="true">
                    {activity.type === 'drop' ? '−' : '+'}
                  </div>

                  <div className="activity-details">
                    <p>{activity.message}</p>
                    <span>
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <p>
            CampusConnect · Student Portal
          </p>
          <p>
            {student.university}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
