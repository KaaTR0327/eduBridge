import { formatCurrency } from '../lib/utils';

export function CourseGrid({ courses, onSelect, authUser, onEnroll, enrollingId }) {
  return (
    <section className="shell catalog-section">
      <div className="section-title-row">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Approved courses</h2>
        </div>
      </div>
      <div className="course-grid live-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <img src={course.thumbnailUrl || 'https://placehold.co/600x400/e7d5ba/172121?text=Course'} alt={course.title} />
            <div className="course-copy">
              <p className="eyebrow">{course.category?.name || 'Course'}</p>
              <h3>{course.title}</h3>
              <p>{course.shortDescription || course.description}</p>
              <div className="course-meta">
                <span>{course.level || 'All level'}</span>
                <span>{course.lessonCount} lessons</span>
                <span>{course.durationHours}h</span>
              </div>
              <div className="course-footer">
                <strong>{formatCurrency(course.price)}</strong>
                <span>{course.instructor?.fullName}</span>
              </div>
              <div className="action-row split">
                <button className="btn ghost" onClick={() => onSelect(course.id)}>View details</button>
                {authUser?.role === 'STUDENT' ? (
                  <button className="btn" disabled={enrollingId === course.id} onClick={() => onEnroll(course.id)}>
                    {enrollingId === course.id ? 'Processing...' : 'Enroll'}
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CourseDetail({ course, authUser, onBack, onEnroll, enrollingId }) {
  if (!course) return null;

  return (
    <section className="shell detail-layout">
      <article className="panel-card detail-main">
        <button className="text-btn" onClick={onBack}>Back to courses</button>
        <p className="eyebrow">{course.category?.name}</p>
        <h2>{course.title}</h2>
        <p className="lead">{course.description}</p>
        <div className="chips">
          <span>{course.level || 'All level'}</span>
          <span>{course.language || 'Unknown language'}</span>
          <span>{course.lessonCount} lessons</span>
          <span>{course.studentsCount} students</span>
          <span>{course.averageRating} rating</span>
        </div>
        <div className="action-row">
          {authUser?.role === 'STUDENT' ? (
            <button className="btn" disabled={enrollingId === course.id} onClick={() => onEnroll(course.id)}>
              {enrollingId === course.id ? 'Processing...' : `Enroll for ${formatCurrency(course.price)}`}
            </button>
          ) : null}
        </div>
      </article>

      <article className="panel-card detail-side">
        <img className="detail-image" src={course.thumbnailUrl || 'https://placehold.co/600x400/e7d5ba/172121?text=Course'} alt={course.title} />
        <div className="stack-list">
          <div>
            <strong>Instructor</strong>
            <span>{course.instructor?.fullName}</span>
          </div>
          <div>
            <strong>Price</strong>
            <span>{formatCurrency(course.price)}</span>
          </div>
          <div>
            <strong>Status</strong>
            <span>{course.status}</span>
          </div>
        </div>
      </article>

      <article className="panel-card wide-card">
        <p className="eyebrow">Lessons</p>
        <div className="section-list">
          {course.sections.map((section) => (
            <div className="section-item" key={section.id}>
              <h3>{section.title}</h3>
              <ul>
                {section.lessons.map((lesson) => (
                  <li key={lesson.id}>{lesson.title} - {Math.round((lesson.durationSeconds || 0) / 60)} min</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
