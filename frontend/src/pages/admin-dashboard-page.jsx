import {
  BadgeCheck,
  BookOpen,
  Clock3,
  DollarSign,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useLanguage } from '../lib/i18n';

export function AdminDashboardPage() {
  const { locale } = useLanguage();
  const { token, user, ready, isAuthenticated } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [priceDrafts, setPriceDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [actionKey, setActionKey] = useState('');

  const copy = useMemo(() => (locale === 'mn'
    ? {
        loading: 'Админ самбарыг ачаалж байна...',
        loginNeeded: 'Админ самбар харахын тулд эхлээд нэвтэрнэ үү.',
        signIn: 'Нэвтрэх',
        accessDenied: 'Танд админ хандалт алга.',
        accessDeniedBody: 'Энэ хэсгийг зөвхөн ADMIN эрхтэй хэрэглэгч ашиглана.',
        backHome: 'Нүүр рүү буцах',
        eyebrow: 'Админ самбар',
        title: 'Платформын хяналт, шалгалт, баталгаажуулалт',
        description: 'Хүлээгдэж буй курсүүд, бүтээгчийн хүсэлтүүд, орлогын товч мэдээлэл болон сүүлийн төлбөрүүдийг нэг дороос хянаарай.',
        refresh: 'Шинэчлэх',
        metrics: {
          users: 'Нийт хэрэглэгч',
          instructors: 'Нийт бүтээгч',
          courses: 'Нийт курс',
          pendingCourses: 'Хүлээгдэж буй курс',
          totalRevenue: 'Нийт орлого',
          todayRevenue: 'Өнөөдрийн орлого'
        },
        topCourse: 'Тэргүүлэх курс',
        topInstructor: 'Тэргүүлэх бүтээгч',
        noTopCourse: 'Одоогоор батлагдсан курс алга.',
        noTopInstructor: 'Одоогоор бүтээгчийн мэдээлэл алга.',
        pendingCoursesTitle: 'Шалгах курсүүд',
        pendingCoursesBody: 'Нийтлэхээс өмнө курсийн агуулга, бүтээгч, үнийг шалгана.',
        pendingInstructorsTitle: 'Хүлээгдэж буй бүтээгчийн хүсэлтүүд',
        pendingInstructorsBody: 'Шинэ бүтээгчдийг батлах эсвэл буцаах шийдвэр гаргана.',
        paymentsTitle: 'Сүүлийн төлбөрүүд',
        paymentsBody: 'Төлбөрийн provider, order болон төлөвийг хурдан шалгана.',
        emptyCourses: 'Хүлээгдэж буй курс алга.',
        emptyInstructors: 'Хүлээгдэж буй бүтээгчийн хүсэлт алга.',
        emptyPayments: 'Одоогоор төлбөрийн мэдээлэл алга.',
        approve: 'Батлах',
        reject: 'Буцаах',
        viewCourse: 'Курс үзэх',
        courseUnit: 'курс',
        students: 'суралцагч',
        lessons: 'хичээл',
        rating: 'үнэлгээ',
        createdAt: 'Илгээсэн огноо',
        updatedAt: 'Шинэчилсэн огноо',
        expertise: 'Чиглэл',
        email: 'Имэйл',
        statusLabel: 'Төлөв',
        paymentMethod: 'Арга',
        paymentStatus: 'Төлөв',
        amount: 'Дүн',
        order: 'Захиалга',
        paidAt: 'Төлөгдсөн',
        profile: 'Профайл',
        approveCourseSuccess: 'Курс батлагдлаа.',
        rejectCourseSuccess: 'Курс буцаагдлаа.',
        approveInstructorSuccess: 'Бүтээгчийн хүсэлт батлагдлаа.',
        rejectInstructorSuccess: 'Бүтээгчийн хүсэлт буцаагдлаа.',
        rejectCoursePrompt: 'Курс буцаах шалтгаан оруулна уу',
        rejectInstructorPrompt: 'Бүтээгчийн хүсэлт буцаах шалтгаан оруулна уу',
        loadError: 'Админ мэдээлэл уншиж чадсангүй.'
      }
    : {
        loading: 'Loading admin dashboard...',
        loginNeeded: 'Please sign in to access the admin dashboard.',
        signIn: 'Sign in',
        accessDenied: 'You do not have admin access.',
        accessDeniedBody: 'This area is restricted to users with the ADMIN role.',
        backHome: 'Back to home',
        eyebrow: 'Admin Dashboard',
        title: 'Platform moderation, review, and operational overview',
        description: 'Review pending courses, instructor requests, revenue metrics, and recent payments from one place.',
        refresh: 'Refresh',
        metrics: {
          users: 'Total users',
          instructors: 'Total instructors',
          courses: 'Total courses',
          pendingCourses: 'Pending courses',
          totalRevenue: 'Total revenue',
          todayRevenue: 'Today revenue'
        },
        topCourse: 'Top course',
        topInstructor: 'Top instructor',
        noTopCourse: 'No approved course available yet.',
        noTopInstructor: 'No instructor data available yet.',
        pendingCoursesTitle: 'Courses awaiting review',
        pendingCoursesBody: 'Review course content, creator, and pricing before publication.',
        pendingInstructorsTitle: 'Pending instructor requests',
        pendingInstructorsBody: 'Approve or reject new instructor applications.',
        paymentsTitle: 'Recent payments',
        paymentsBody: 'Inspect provider, order reference, and payment status quickly.',
        emptyCourses: 'No pending courses right now.',
        emptyInstructors: 'No pending instructor requests right now.',
        emptyPayments: 'No payment records yet.',
        approve: 'Approve',
        reject: 'Reject',
        viewCourse: 'View course',
        courseUnit: 'courses',
        students: 'students',
        lessons: 'lessons',
        rating: 'rating',
        createdAt: 'Created',
        updatedAt: 'Updated',
        expertise: 'Expertise',
        email: 'Email',
        statusLabel: 'Status',
        paymentMethod: 'Method',
        paymentStatus: 'Status',
        amount: 'Amount',
        order: 'Order',
        paidAt: 'Paid at',
        profile: 'Profile',
        approveCourseSuccess: 'Course approved.',
        rejectCourseSuccess: 'Course rejected.',
        approveInstructorSuccess: 'Instructor request approved.',
        rejectInstructorSuccess: 'Instructor request rejected.',
        rejectCoursePrompt: 'Enter a reason for rejecting this course',
        rejectInstructorPrompt: 'Enter a reason for rejecting this instructor request',
        loadError: 'Unable to load admin data.'
      }), [locale]);

  const courseManagementCopy = locale === 'mn'
    ? {
        savePrice: 'Үнэ хадгалах',
        deleteCourse: 'Хичээл устгах',
        allCoursesTitle: 'Бүх хичээлийн удирдлага',
        allCoursesBody: 'Админ эндээс үнийг өөрчилж, course-ийг устгаж болно.',
        emptyAllCourses: 'Одоогоор курс алга.',
        savePriceSuccess: 'Хичээлийн үнэ шинэчлэгдлээ.',
        deleteCourseSuccess: 'Хичээл устгагдлаа.',
        deleteCoursePrompt: 'Энэ хичээлийг устгах уу?'
      }
    : {
        savePrice: 'Save price',
        deleteCourse: 'Delete course',
        allCoursesTitle: 'All course management',
        allCoursesBody: 'Admins can update course pricing and delete courses from here.',
        emptyAllCourses: 'No courses available yet.',
        savePriceSuccess: 'Course price updated.',
        deleteCourseSuccess: 'Course deleted.',
        deleteCoursePrompt: 'Delete this course?'
      };

  useEffect(() => {
    if (!ready) {
      return undefined;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadAdminData() {
      try {
        setError('');
        const [dashboardData, pendingCourseData, allCourseData, instructorData] = await Promise.all([
          apiRequest('/admin/dashboard', { token }),
          apiRequest('/admin/courses/pending', { token }),
          apiRequest('/admin/courses', { token }),
          apiRequest('/admin/instructors/pending', { token })
        ]);

        if (!active) {
          return;
        }

        setDashboard(dashboardData);
        setPendingCourses(pendingCourseData);
        setAllCourses(allCourseData);
        setPendingInstructors(instructorData);
        setPriceDrafts(
          Object.fromEntries(
            allCourseData.map((course) => [course.id, String(course.price ?? 0)])
          )
        );
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    setLoading(true);
    loadAdminData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, ready, token, user?.role]);

  async function refreshData() {
    if (!token) {
      return;
    }

    try {
      setRefreshing(true);
      setError('');
      const [dashboardData, pendingCourseData, allCourseData, instructorData] = await Promise.all([
        apiRequest('/admin/dashboard', { token }),
        apiRequest('/admin/courses/pending', { token }),
        apiRequest('/admin/courses', { token }),
        apiRequest('/admin/instructors/pending', { token })
      ]);
      setDashboard(dashboardData);
      setPendingCourses(pendingCourseData);
      setAllCourses(allCourseData);
      setPendingInstructors(instructorData);
      setPriceDrafts(
        Object.fromEntries(
          allCourseData.map((course) => [course.id, String(course.price ?? 0)])
        )
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleCourseAction(courseId, action) {
    const reason = action === 'reject'
      ? getRejectionReason(copy.rejectCoursePrompt)
      : '';

    if (action === 'reject' && reason === null) {
      return;
    }

    const key = `course:${courseId}:${action}`;
    setActionKey(key);
    setStatus({ type: '', message: '' });

    try {
      const updatedCourse = await apiRequest(`/admin/courses/${courseId}/${action}`, {
        method: 'POST',
        token,
        body: action === 'reject' && reason ? { reason } : undefined
      });

      setPendingCourses((current) => current.filter((item) => item.id !== courseId));
      setAllCourses((current) => current.map((item) => (item.id === courseId ? updatedCourse : item)));
      setDashboard((current) => (current
        ? {
            ...current,
            metrics: {
              ...current.metrics,
              pendingCourses: Math.max(0, (current.metrics?.pendingCourses || 0) - 1)
            }
          }
        : current));
      setStatus({
        type: 'success',
        message: action === 'approve' ? copy.approveCourseSuccess : copy.rejectCourseSuccess
      });
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setActionKey('');
    }
  }

  async function handleCoursePriceSave(courseId) {
    const key = `course:${courseId}:price`;
    setActionKey(key);
    setStatus({ type: '', message: '' });

    try {
      const updatedCourse = await apiRequest(`/admin/courses/${courseId}`, {
        method: 'PUT',
        token,
        body: {
          price: Number(priceDrafts[courseId] || 0)
        }
      });

      setAllCourses((current) => current.map((item) => (item.id === courseId ? updatedCourse : item)));
      setPendingCourses((current) => current.map((item) => (item.id === courseId ? updatedCourse : item)));
      setPriceDrafts((current) => ({
        ...current,
        [courseId]: String(updatedCourse.price ?? 0)
      }));
      setStatus({ type: 'success', message: courseManagementCopy.savePriceSuccess });
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setActionKey('');
    }
  }

  async function handleCourseDelete(courseId) {
    if (typeof window !== 'undefined' && !window.confirm(courseManagementCopy.deleteCoursePrompt)) {
      return;
    }

    const key = `course:${courseId}:delete`;
    setActionKey(key);
    setStatus({ type: '', message: '' });

    try {
      await apiRequest(`/admin/courses/${courseId}`, {
        method: 'DELETE',
        token
      });

      setAllCourses((current) => current.filter((item) => item.id !== courseId));
      setPendingCourses((current) => current.filter((item) => item.id !== courseId));
      setPriceDrafts((current) => {
        const next = { ...current };
        delete next[courseId];
        return next;
      });
      setDashboard((current) => (current
        ? {
            ...current,
            metrics: {
              ...current.metrics,
              totalCourses: Math.max(0, (current.metrics?.totalCourses || 0) - 1),
              pendingCourses: Math.max(
                0,
                (current.metrics?.pendingCourses || 0) - (pendingCourses.some((item) => item.id === courseId) ? 1 : 0)
              )
            }
          }
        : current));
      setStatus({ type: 'success', message: courseManagementCopy.deleteCourseSuccess });
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setActionKey('');
    }
  }

  async function handleInstructorAction(profileId, action) {
    const reason = action === 'reject'
      ? getRejectionReason(copy.rejectInstructorPrompt)
      : '';

    if (action === 'reject' && reason === null) {
      return;
    }

    const key = `instructor:${profileId}:${action}`;
    setActionKey(key);
    setStatus({ type: '', message: '' });

    try {
      await apiRequest(`/admin/instructors/${profileId}/${action}`, {
        method: 'POST',
        token,
        body: action === 'reject' && reason ? { reason } : undefined
      });

      setPendingInstructors((current) => current.filter((item) => item.id !== profileId));
      setDashboard((current) => (current
        ? {
            ...current,
            pendingInstructorRequests: (current.pendingInstructorRequests || []).filter((item) => item.id !== profileId)
          }
        : current));
      setStatus({
        type: 'success',
        message: action === 'approve' ? copy.approveInstructorSuccess : copy.rejectInstructorSuccess
      });
    } catch (requestError) {
      setStatus({ type: 'error', message: requestError.message });
    } finally {
      setActionKey('');
    }
  }

  function handlePriceDraftChange(courseId, value) {
    setPriceDrafts((current) => ({
      ...current,
      [courseId]: value
    }));
  }

  if (!ready || loading) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loading}</h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loginNeeded}</h1>
          <Link to="/auth#signin" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {copy.signIn}
          </Link>
        </div>
      </main>
    );
  }

  if (user?.role !== 'ADMIN') {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.accessDenied}</h1>
          <p className="mt-4 text-slate-300">{copy.accessDeniedBody}</p>
          <Link to="/" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {copy.backHome}
          </Link>
        </div>
      </main>
    );
  }

  const metrics = dashboard?.metrics || {};

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow-text">{copy.eyebrow}</p>
            <h1 className="page-title mt-3 text-white">{copy.title}</h1>
            <p className="body-copy mt-4">{copy.description}</p>
          </div>
          <button
            type="button"
            onClick={refreshData}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-[#f9b17a] hover:text-[#f9b17a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {copy.refresh}
          </button>
        </div>
      </div>

      {status.message ? (
        <p
          role="status"
          className={`mt-6 rounded-xl px-4 py-3 text-sm ${
            status.type === 'error'
              ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
              : 'border border-[#f9b17a]/20 bg-[#f9b17a]/10 text-[#ffe0c5]'
          }`}
        >
          {status.message}
        </p>
      ) : null}

      {error ? (
        <div className="empty-state mt-6">
          <h2 className="text-xl font-semibold text-white">{copy.loadError}</h2>
          <p className="mt-3">{error}</p>
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard icon={Users} label={copy.metrics.users} value={metrics.totalUsers || 0} />
        <MetricCard icon={BadgeCheck} label={copy.metrics.instructors} value={metrics.totalInstructors || 0} />
        <MetricCard icon={BookOpen} label={copy.metrics.courses} value={metrics.totalCourses || 0} />
        <MetricCard icon={Clock3} label={copy.metrics.pendingCourses} value={metrics.pendingCourses || 0} />
        <MetricCard icon={DollarSign} label={copy.metrics.totalRevenue} value={formatCurrency(metrics.totalRevenue)} />
        <MetricCard icon={DollarSign} label={copy.metrics.todayRevenue} value={formatCurrency(metrics.todayRevenue)} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <SummaryPanel
          title={copy.topCourse}
          icon={ShieldCheck}
          body={dashboard?.topCourse ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-white">{dashboard.topCourse.title}</p>
              <p className="text-sm text-slate-300">{dashboard.topCourse.instructor?.fullName || 'Unknown instructor'}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                <span>{dashboard.topCourse.studentsCount || 0} {copy.students}</span>
                <span>{dashboard.topCourse.lessonCount || 0} {copy.lessons}</span>
                <span>{dashboard.topCourse.averageRating || 0} {copy.rating}</span>
              </div>
              {dashboard.topCourse.slug ? (
                <Link to={`/resources/${dashboard.topCourse.slug}`} className="inline-flex text-sm font-medium text-[#f9b17a] transition hover:text-[#f6a56b]">
                  {copy.viewCourse}
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-300">{copy.noTopCourse}</p>
          )}
        />

        <SummaryPanel
          title={copy.topInstructor}
          icon={ShieldCheck}
          body={dashboard?.topInstructor ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-white">{dashboard.topInstructor.fullName}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                <span>{dashboard.topInstructor.courseCount || 0} {copy.courseUnit}</span>
                <span>{dashboard.topInstructor.studentCount || 0} {copy.students}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">{copy.noTopInstructor}</p>
          )}
        />
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.08fr,0.92fr]">
        <div className="space-y-8">
          <div className="surface-panel p-8">
            <SectionHeader
              title={copy.pendingCoursesTitle}
              description={copy.pendingCoursesBody}
              icon={Clock3}
            />
            <div className="mt-6 space-y-4">
              {pendingCourses.length > 0 ? pendingCourses.map((course) => (
                <div key={course.id} className="rounded-md border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">{course.title}</p>
                      <p className="text-sm text-slate-300">{course.instructor?.fullName || 'Unknown instructor'}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                        <span>{course.category?.name || course.category}</span>
                        <span>{course.lessonCount || 0} {copy.lessons}</span>
                        <span>{formatCurrency(course.price)}</span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        {copy.updatedAt}: {formatDate(course.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <AdminActionButton
                        busy={actionKey === `course:${course.id}:approve`}
                        onClick={() => handleCourseAction(course.id, 'approve')}
                        variant="approve"
                        label={copy.approve}
                      />
                      <AdminActionButton
                        busy={actionKey === `course:${course.id}:reject`}
                        onClick={() => handleCourseAction(course.id, 'reject')}
                        variant="reject"
                        label={copy.reject}
                      />
                      <AdminActionButton
                        busy={actionKey === `course:${course.id}:delete`}
                        onClick={() => handleCourseDelete(course.id)}
                        variant="delete"
                        label={courseManagementCopy.deleteCourse}
                      />
                    </div>
                  </div>
                </div>
              )) : <EmptyList message={copy.emptyCourses} />}
            </div>
          </div>

          <div className="surface-panel p-8">
            <SectionHeader
              title={courseManagementCopy.allCoursesTitle}
              description={courseManagementCopy.allCoursesBody}
              icon={BookOpen}
            />
            <div className="mt-6 space-y-4">
              {allCourses.length > 0 ? allCourses.map((course) => (
                <div key={course.id} className="rounded-md border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">{course.title}</p>
                      <p className="text-sm text-slate-300">{course.instructor?.fullName || 'Unknown instructor'}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                        <span>{course.category?.name || course.category}</span>
                        <span>{course.lessonCount || 0} {copy.lessons}</span>
                        <span>{copy.statusLabel}: {course.status}</span>
                      </div>
                    </div>

                    <div className="flex w-full max-w-xl flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceDrafts[course.id] ?? ''}
                          onChange={(event) => handlePriceDraftChange(course.id, event.target.value)}
                          className="input-base sm:max-w-[180px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleCoursePriceSave(course.id)}
                          disabled={actionKey === `course:${course.id}:price`}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Save className="h-4 w-4" />
                          {actionKey === `course:${course.id}:price` ? '...' : courseManagementCopy.savePrice}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCourseDelete(course.id)}
                          disabled={actionKey === `course:${course.id}:delete`}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                          {actionKey === `course:${course.id}:delete` ? '...' : courseManagementCopy.deleteCourse}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : <EmptyList message={courseManagementCopy.emptyAllCourses} />}
            </div>
          </div>

          <div className="surface-panel p-8">
            <SectionHeader
              title={copy.pendingInstructorsTitle}
              description={copy.pendingInstructorsBody}
              icon={Users}
            />
            <div className="mt-6 space-y-4">
              {pendingInstructors.length > 0 ? pendingInstructors.map((profile) => (
                <div key={profile.id} className="rounded-md border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-white">{profile.user?.fullName || 'Unknown user'}</p>
                      <p className="text-sm text-slate-300">{copy.email}: {profile.user?.email || '-'}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                        <span>{copy.expertise}: {profile.expertise || '-'}</span>
                        <span>{copy.statusLabel}: {profile.verificationStatus}</span>
                      </div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                        {copy.createdAt}: {formatDate(profile.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <AdminActionButton
                        busy={actionKey === `instructor:${profile.id}:approve`}
                        onClick={() => handleInstructorAction(profile.id, 'approve')}
                        variant="approve"
                        label={copy.approve}
                      />
                      <AdminActionButton
                        busy={actionKey === `instructor:${profile.id}:reject`}
                        onClick={() => handleInstructorAction(profile.id, 'reject')}
                        variant="reject"
                        label={copy.reject}
                      />
                    </div>
                  </div>
                </div>
              )) : <EmptyList message={copy.emptyInstructors} />}
            </div>
          </div>
        </div>

        <div className="surface-panel p-8">
          <SectionHeader
            title={copy.paymentsTitle}
            description={copy.paymentsBody}
            icon={DollarSign}
          />
          <div className="mt-6 space-y-4">
            {(dashboard?.latestPayments || []).length > 0 ? dashboard.latestPayments.map((payment) => (
              <div key={payment.id} className="rounded-md border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{formatCurrency(payment.amount)}</p>
                    <p className="mt-1 text-sm text-slate-300">{copy.paymentMethod}: {payment.paymentMethod || payment.provider || '-'}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-slate-200">
                    {payment.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-300">
                  <p>{copy.order}: {payment.orderId || payment.order?.id || '-'}</p>
                  <p>{copy.paidAt}: {formatDate(payment.paidAt)}</p>
                </div>
              </div>
            )) : <EmptyList message={copy.emptyPayments} compact />}
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="surface-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <Icon className="h-5 w-5 text-[#f9b17a]" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function SummaryPanel({ title, icon: Icon, body }) {
  return (
    <div className="surface-panel p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-[#f9b17a]/15 p-2 text-[#f9b17a]">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="section-title text-white">{title}</h2>
      </div>
      <div className="mt-5">{body}</div>
    </div>
  );
}

function SectionHeader({ title, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-[#f9b17a]/15 p-2 text-[#f9b17a]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="section-title text-white">{title}</h2>
        <p className="meta-copy mt-2">{description}</p>
      </div>
    </div>
  );
}

function EmptyList({ message, compact = false }) {
  return (
    <div className={`rounded-md border border-dashed border-white/10 text-slate-300 ${compact ? 'p-4 text-sm' : 'p-5 text-sm'}`}>
      {message}
    </div>
  );
}

function AdminActionButton({ busy, onClick, variant, label }) {
  const baseClassName = 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70';
  const variantClassName = variant === 'approve'
    ? 'bg-[#f9b17a] text-[#232844] hover:bg-[#f6a56b]'
    : variant === 'delete'
      ? 'border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:border-rose-300/50 hover:bg-rose-500/15'
      : 'border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:border-rose-300/50 hover:bg-rose-500/15';

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={`${baseClassName} ${variantClassName}`}
    >
      {variant === 'approve' ? <ShieldCheck className="h-4 w-4" /> : variant === 'delete' ? <Trash2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      {busy ? '...' : label}
    </button>
  );
}

function getRejectionReason(message) {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.prompt(message, '');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
