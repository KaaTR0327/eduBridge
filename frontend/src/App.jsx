import React, { useEffect, useMemo, useState } from 'react';
import { Header, Hero, HomeSections } from './components/layout';
import { AuthView } from './components/auth';
import { CourseGrid, CourseDetail } from './components/courses';
import { StudentPanel, InstructorPanel, AdminPanel } from './components/panels';
import { apiFetch, readStoredUser, TOKEN_KEY, USER_KEY } from './lib/utils';

export default function App() {
  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [authUser, setAuthUser] = useState(readStoredUser());
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [currentView, setCurrentView] = useState('home');
  const [busyAction, setBusyAction] = useState('');
  const [globalMessage, setGlobalMessage] = useState('');
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '', role: 'STUDENT' });
  const [studentDashboard, setStudentDashboard] = useState(null);
  const [instructorDashboard, setInstructorDashboard] = useState(null);
  const [adminDashboard, setAdminDashboard] = useState(null);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [forms, setForms] = useState({
    courseTitle: '',
    courseDescription: '',
    courseShortDescription: '',
    coursePrice: '',
    courseThumbnailUrl: '',
    courseCategoryId: '',
    selectedCourseId: '',
    selectedSectionId: '',
    sectionTitle: '',
    lessonTitle: '',
    lessonVideoUrl: '',
    lessonProvider: 'Mux',
    lessonDurationSeconds: ''
  });

  const isLoggedIn = Boolean(token && authUser);

  const loadPublic = async () => {
    const [overviewData, coursesData, categoriesData] = await Promise.all([
      apiFetch('/public/overview'),
      apiFetch('/public/courses'),
      apiFetch('/public/categories')
    ]);

    setOverview(overviewData);
    setCourses(coursesData);
    setCategories(categoriesData);
  };

  const loadPanel = async (user = authUser, authToken = token) => {
    if (!user || !authToken) return;

    if (user.role === 'STUDENT') {
      setStudentDashboard(await apiFetch('/student/dashboard', {}, authToken));
    }

    if (user.role === 'INSTRUCTOR') {
      setInstructorDashboard(await apiFetch('/instructor/dashboard', {}, authToken));
    }

    if (user.role === 'ADMIN') {
      const [dashboardData, pendingData] = await Promise.all([
        apiFetch('/admin/dashboard', {}, authToken),
        apiFetch('/admin/courses/pending', {}, authToken)
      ]);
      setAdminDashboard(dashboardData);
      setPendingCourses(pendingData);
    }
  };

  useEffect(() => {
    loadPublic().catch((error) => setGlobalMessage(error.message));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadPanel().catch((error) => setGlobalMessage(error.message));
  }, [isLoggedIn]);

  const persistAuth = (payload) => {
    setToken(payload.token);
    setAuthUser(payload.user);
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    setCurrentView('panel');
  };

  const handleLogin = async (account = null) => {
    setBusyAction('auth');
    setGlobalMessage('');
    try {
      const credentials = account || authForm;
      const payload = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      persistAuth(payload);
      await loadPanel(payload.user, payload.token);
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const handleRegister = async () => {
    setBusyAction('auth');
    setGlobalMessage('');
    try {
      const payload = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(authForm)
      });
      persistAuth(payload);
      await loadPublic();
      await loadPanel(payload.user, payload.token);
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken('');
    setAuthUser(null);
    setStudentDashboard(null);
    setInstructorDashboard(null);
    setAdminDashboard(null);
    setPendingCourses([]);
    setCurrentView('home');
  };

  const selectCourse = async (courseId) => {
    try {
      setGlobalMessage('');
      const data = await apiFetch(`/public/courses/${courseId}`);
      setSelectedCourse(data);
      setCurrentView('course');
    } catch (error) {
      setGlobalMessage(error.message);
    }
  };

  const handleEnroll = async (courseId) => {
    if (authUser?.role !== 'STUDENT') {
      setGlobalMessage('Use a student account to enroll in a course.');
      return;
    }

    setBusyAction(courseId);
    try {
      await apiFetch(`/student/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ provider: 'SIMULATED' })
      }, token);
      await Promise.all([loadPublic(), loadPanel()]);
      setGlobalMessage('Enrollment created successfully.');
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const createCourse = async () => {
    setBusyAction('create-course');
    try {
      await apiFetch('/instructor/courses', {
        method: 'POST',
        body: JSON.stringify({
          categoryId: forms.courseCategoryId,
          title: forms.courseTitle,
          description: forms.courseDescription,
          shortDescription: forms.courseShortDescription,
          price: Number(forms.coursePrice),
          thumbnailUrl: forms.courseThumbnailUrl,
          level: 'Intermediate',
          language: 'Mongolian'
        })
      }, token);
      setForms((prev) => ({
        ...prev,
        courseTitle: '',
        courseDescription: '',
        courseShortDescription: '',
        coursePrice: '',
        courseThumbnailUrl: '',
        courseCategoryId: ''
      }));
      await Promise.all([loadPublic(), loadPanel()]);
      setGlobalMessage('Draft course created.');
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const createSection = async (courseId) => {
    if (!courseId) return;
    setBusyAction('create-section');
    try {
      const section = await apiFetch(`/instructor/courses/${courseId}/sections`, {
        method: 'POST',
        body: JSON.stringify({ title: forms.sectionTitle })
      }, token);
      setForms((prev) => ({ ...prev, sectionTitle: '', selectedSectionId: section.id }));
      await loadPanel();
      setGlobalMessage('Section added successfully.');
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const createLesson = async (sectionId) => {
    if (!sectionId) return;
    setBusyAction('create-lesson');
    try {
      await apiFetch(`/instructor/sections/${sectionId}/lessons`, {
        method: 'POST',
        body: JSON.stringify({
          title: forms.lessonTitle,
          videoUrl: forms.lessonVideoUrl,
          videoProvider: forms.lessonProvider,
          durationSeconds: Number(forms.lessonDurationSeconds || 0),
          isPreview: true
        })
      }, token);
      setForms((prev) => ({
        ...prev,
        lessonTitle: '',
        lessonVideoUrl: '',
        lessonDurationSeconds: ''
      }));
      await loadPanel();
      setGlobalMessage('Lesson added successfully.');
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const submitCourse = async (courseId) => {
    if (!courseId) return;
    setBusyAction('submit-course');
    try {
      await apiFetch(`/instructor/courses/${courseId}/submit`, { method: 'POST' }, token);
      await Promise.all([loadPublic(), loadPanel()]);
      setGlobalMessage('Course submitted for review.');
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const moderateCourse = async (courseId, action) => {
    setBusyAction(`${action}-${courseId}`);
    try {
      await apiFetch(`/admin/courses/${courseId}/${action}`, {
        method: 'POST',
        body: JSON.stringify(action === 'reject' ? { reason: 'Please improve course structure.' } : {})
      }, token);
      await Promise.all([loadPublic(), loadPanel()]);
      setGlobalMessage(`Course ${action} completed.`);
    } catch (error) {
      setGlobalMessage(error.message);
    } finally {
      setBusyAction('');
    }
  };

  const panelView = useMemo(() => {
    if (!authUser) return null;
    if (authUser.role === 'STUDENT') {
      return <StudentPanel dashboard={studentDashboard || { myCourses: [] }} refresh={() => loadPanel().catch((error) => setGlobalMessage(error.message))} onSelectCourse={selectCourse} />;
    }
    if (authUser.role === 'INSTRUCTOR') {
      return (
        <InstructorPanel
          dashboard={instructorDashboard || { metrics: {}, courses: [] }}
          categories={categories}
          forms={forms}
          setForms={setForms}
          onCreateCourse={createCourse}
          onCreateSection={createSection}
          onCreateLesson={createLesson}
          onSubmitCourse={submitCourse}
          refresh={() => loadPanel().catch((error) => setGlobalMessage(error.message))}
          busyAction={busyAction}
        />
      );
    }
    return (
      <AdminPanel
        dashboard={adminDashboard || { metrics: {} }}
        pendingCourses={pendingCourses}
        refreshDashboard={() => loadPanel().catch((error) => setGlobalMessage(error.message))}
        onApprove={(courseId) => moderateCourse(courseId, 'approve')}
        onReject={(courseId) => moderateCourse(courseId, 'reject')}
        busyAction={busyAction}
      />
    );
  }, [authUser, studentDashboard, instructorDashboard, adminDashboard, pendingCourses, categories, forms, busyAction]);

  return (
    <main className="page">
      <Header authUser={authUser} currentView={currentView} onChangeView={setCurrentView} onLogout={handleLogout} />
      <Hero overview={overview} onBrowse={() => setCurrentView('courses')} authUser={authUser} onOpenPanel={() => setCurrentView('panel')} />
      {globalMessage ? <div className="shell notice-bar">{globalMessage}</div> : null}

      {currentView === 'home' ? <HomeSections overview={overview} /> : null}
      {currentView === 'auth' ? (
        <AuthView
          form={authForm}
          setForm={setAuthForm}
          onLogin={() => handleLogin()}
          onRegister={handleRegister}
          busy={busyAction === 'auth'}
          message={globalMessage}
          onQuickLogin={handleLogin}
        />
      ) : null}
      {currentView === 'courses' ? <CourseGrid courses={courses} onSelect={selectCourse} authUser={authUser} onEnroll={handleEnroll} enrollingId={busyAction} /> : null}
      {currentView === 'course' ? <CourseDetail course={selectedCourse} authUser={authUser} onBack={() => setCurrentView('courses')} onEnroll={handleEnroll} enrollingId={busyAction} /> : null}
      {currentView === 'panel' ? panelView : null}
    </main>
  );
}
