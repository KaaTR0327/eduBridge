import { formatCurrency } from '../lib/utils';

export function StudentPanel({ dashboard, refresh, onSelectCourse }) {
  return (
    <section className="shell dashboard-grid">
      <article className="panel-card wide-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Student</p>
            <h2>My courses</h2>
          </div>
          <button className="btn ghost" onClick={refresh}>Refresh</button>
        </div>
        <div className="mini-grid">
          {dashboard.myCourses.map((item) => (
            <article className="mini-card" key={item.enrollment.id}>
              <strong>{item.course.title}</strong>
              <span>{item.progress.completedLessons} / {item.progress.totalLessons} lessons complete</span>
              <button className="text-btn" onClick={() => onSelectCourse(item.course.id)}>Open course</button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export function InstructorPanel({ dashboard, categories, forms, setForms, onCreateCourse, onCreateSection, onCreateLesson, onSubmitCourse, refresh, busyAction }) {
  const courses = dashboard?.courses || [];
  const selectedCourse = courses.find((course) => course.id === forms.selectedCourseId) || courses[0] || null;
  const selectedSection = selectedCourse?.sections?.find((section) => section.id === forms.selectedSectionId) || selectedCourse?.sections?.[0] || null;

  return (
    <section className="shell dashboard-grid">
      <article className="panel-card wide-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Instructor</p>
            <h2>Dashboard</h2>
          </div>
          <button className="btn ghost" onClick={refresh}>Refresh</button>
        </div>
        <div className="stats-strip">
          <div><strong>{dashboard?.metrics?.totalCourses || 0}</strong><span>Total courses</span></div>
          <div><strong>{dashboard?.metrics?.approvedCourses || 0}</strong><span>Approved</span></div>
          <div><strong>{dashboard?.metrics?.pendingCourses || 0}</strong><span>Pending</span></div>
          <div><strong>{formatCurrency(dashboard?.metrics?.totalRevenue || 0)}</strong><span>Revenue</span></div>
        </div>
      </article>

      <article className="panel-card form-card">
        <p className="eyebrow">Create Course</p>
        <div className="form-grid">
          <input value={forms.courseTitle} onChange={(event) => setForms((prev) => ({ ...prev, courseTitle: event.target.value }))} placeholder="Course title" />
          <textarea value={forms.courseDescription} onChange={(event) => setForms((prev) => ({ ...prev, courseDescription: event.target.value }))} placeholder="Description" rows="4" />
          <input value={forms.courseShortDescription} onChange={(event) => setForms((prev) => ({ ...prev, courseShortDescription: event.target.value }))} placeholder="Short description" />
          <input value={forms.coursePrice} onChange={(event) => setForms((prev) => ({ ...prev, coursePrice: event.target.value }))} placeholder="Price" />
          <input value={forms.courseThumbnailUrl} onChange={(event) => setForms((prev) => ({ ...prev, courseThumbnailUrl: event.target.value }))} placeholder="Thumbnail URL" />
          <select className="select-base" value={forms.courseCategoryId} onChange={(event) => setForms((prev) => ({ ...prev, courseCategoryId: event.target.value }))}>
            <option value="">Select category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <button className="btn" onClick={onCreateCourse} disabled={busyAction === 'create-course'}>
          {busyAction === 'create-course' ? 'Saving...' : 'Create draft course'}
        </button>
      </article>

      <article className="panel-card form-card">
        <p className="eyebrow">Manage Course</p>
        <div className="form-grid">
          <select className="select-base" value={selectedCourse?.id || ''} onChange={(event) => setForms((prev) => ({ ...prev, selectedCourseId: event.target.value, selectedSectionId: '' }))}>
            <option value="">Select course</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
          <input value={forms.sectionTitle} onChange={(event) => setForms((prev) => ({ ...prev, sectionTitle: event.target.value }))} placeholder="Section title" />
        </div>
        <div className="action-row split">
          <button className="btn ghost" onClick={() => onCreateSection(selectedCourse?.id)} disabled={!selectedCourse || busyAction === 'create-section'}>Add section</button>
          <button className="btn" onClick={() => onSubmitCourse(selectedCourse?.id)} disabled={!selectedCourse || busyAction === 'submit-course'}>Submit for review</button>
        </div>
        {selectedCourse ? (
          <div className="course-admin-list">
            <strong>{selectedCourse.title}</strong>
            <span>Status: {selectedCourse.status}</span>
          </div>
        ) : null}
      </article>

      <article className="panel-card wide-card">
        <p className="eyebrow">Add Lesson</p>
        <div className="form-grid lesson-form-grid">
          <select className="select-base" value={selectedSection?.id || ''} onChange={(event) => setForms((prev) => ({ ...prev, selectedSectionId: event.target.value }))}>
            <option value="">Select section</option>
            {selectedCourse?.sections?.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
          </select>
          <input value={forms.lessonTitle} onChange={(event) => setForms((prev) => ({ ...prev, lessonTitle: event.target.value }))} placeholder="Lesson title" />
          <input value={forms.lessonVideoUrl} onChange={(event) => setForms((prev) => ({ ...prev, lessonVideoUrl: event.target.value }))} placeholder="Video URL" />
          <input value={forms.lessonProvider} onChange={(event) => setForms((prev) => ({ ...prev, lessonProvider: event.target.value }))} placeholder="Video provider" />
          <input value={forms.lessonDurationSeconds} onChange={(event) => setForms((prev) => ({ ...prev, lessonDurationSeconds: event.target.value }))} placeholder="Duration seconds" />
        </div>
        <button className="btn light" onClick={() => onCreateLesson(selectedSection?.id)} disabled={!selectedSection || busyAction === 'create-lesson'}>
          {busyAction === 'create-lesson' ? 'Saving...' : 'Add lesson'}
        </button>
      </article>

      <article className="panel-card wide-card">
        <p className="eyebrow">My Courses</p>
        <div className="mini-grid">
          {courses.map((course) => (
            <article className="mini-card" key={course.id}>
              <strong>{course.title}</strong>
              <span>{course.status}</span>
              <small>{course.lessonCount} lessons</small>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

export function AdminPanel({ dashboard, pendingCourses, refreshDashboard, onApprove, onReject, busyAction }) {
  return (
    <section className="shell dashboard-grid">
      <article className="panel-card wide-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Admin</p>
            <h2>Dashboard</h2>
          </div>
          <button className="btn ghost" onClick={refreshDashboard}>Refresh</button>
        </div>
        <div className="stats-strip">
          <div><strong>{dashboard?.metrics?.totalUsers || 0}</strong><span>Users</span></div>
          <div><strong>{dashboard?.metrics?.totalCourses || 0}</strong><span>Courses</span></div>
          <div><strong>{dashboard?.metrics?.pendingCourses || 0}</strong><span>Pending</span></div>
          <div><strong>{formatCurrency(dashboard?.metrics?.totalRevenue || 0)}</strong><span>Total revenue</span></div>
        </div>
      </article>

      <article className="panel-card wide-card">
        <p className="eyebrow">Pending moderation</p>
        <div className="mini-grid">
          {pendingCourses.map((course) => (
            <article className="mini-card" key={course.id}>
              <strong>{course.title}</strong>
              <span>{course.instructor?.fullName}</span>
              <small>{course.status}</small>
              <div className="action-row split">
                <button className="btn" disabled={busyAction === `approve-${course.id}`} onClick={() => onApprove(course.id)}>Approve</button>
                <button className="btn ghost danger" disabled={busyAction === `reject-${course.id}`} onClick={() => onReject(course.id)}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}
