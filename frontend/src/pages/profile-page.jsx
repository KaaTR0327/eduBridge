import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Eye,
  LayoutDashboard,
  Mail,
  Pencil,
  ShieldCheck,
  Upload,
  UserCircle2
} from 'lucide-react';
import { apiRequest, slugify } from '../lib/api';
import { useAuth } from '../lib/auth';
import { getCategoryLabel } from '../lib/content';
import { useLanguage } from '../lib/i18n';

function getInitials(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'EB';
}

function formatRole(role, locale) {
  const labels = {
    ADMIN: { mn: 'Админ', en: 'Admin' },
    INSTRUCTOR: { mn: 'Багш', en: 'Teacher' },
    STUDENT: { mn: 'Сурагч', en: 'Student' }
  };

  return labels[role]?.[locale] || role;
}

function formatVerification(status, locale) {
  const labels = {
    APPROVED: { mn: 'Баталгаажсан', en: 'Approved' },
    PENDING: { mn: 'Хүлээгдэж байгаа', en: 'Pending' },
    REJECTED: { mn: 'Татгалзсан', en: 'Rejected' }
  };

  return labels[status]?.[locale] || status || '-';
}

function formatCourseStatus(status, locale) {
  const labels = {
    DRAFT: { mn: 'Ноорог', en: 'Draft' },
    PENDING_REVIEW: { mn: 'Хянагдаж байна', en: 'Pending review' },
    APPROVED: { mn: 'Нийтлэгдсэн', en: 'Published' },
    REJECTED: { mn: 'Буцаагдсан', en: 'Rejected' },
    ARCHIVED: { mn: 'Архивласан', en: 'Archived' }
  };

  return labels[status]?.[locale] || status || '-';
}

function formatDate(value, locale) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function ProfilePage() {
  const { locale } = useLanguage();
  const { user, token, ready, isAuthenticated } = useAuth();
  const [teacherDashboard, setTeacherDashboard] = useState(null);
  const [loadingTeacherData, setLoadingTeacherData] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  const isTeacher = user?.role === 'INSTRUCTOR' && Boolean(user?.instructorProfile);

  const copy = locale === 'mn'
    ? {
        loading: 'Профайлыг ачаалж байна...',
        title: 'Миний профиль',
        signedOut: 'Профайл үзэхийн тулд эхлээд нэвтэрнэ үү.',
        signIn: 'Нэвтрэх',
        signUp: 'Бүртгүүлэх',
        account: 'Бүртгэлийн мэдээлэл',
        roleLabel: 'Төлөв',
        memberSince: 'Бүртгүүлсэн',
        accountStatus: 'Дансны төлөв',
        creatorStatus: 'Багшийн баталгаажуулалт',
        creatorBio: 'Танилцуулга',
        expertise: 'Чиглэл',
        quickActions: 'Хурдан үйлдэл',
        upload: 'Шинэ хичээл оруулах',
        publicProfile: 'Нийтийн багшийн хуудас',
        dashboard: 'Админ самбар',
        explore: 'Хичээл үзэх',
        yourCourses: 'Миний нэмсэн хичээлүүд',
        yourCoursesDesc: 'Таны оруулсан бүх хичээлүүд энд төлөвтэйгээ харагдана.',
        noCourses: 'Одоогоор нэмсэн хичээл алга.',
        noCoursesHint: 'Шинэ хичээл оруулмагц энд харагдана.',
        courseCount: 'Хичээл',
        totalLessons: 'Нийт lesson',
        downloads: 'Таталт',
        revenue: 'Орлого',
        email: 'Имэйл',
        statusNote: 'Төлөв',
        edit: 'Засах',
        view: 'Үзэх',
        rejectedReason: 'Буцаасан шалтгаан',
        loadError: 'Багшийн хичээлүүдийг ачаалж чадсангүй.'
      }
    : {
        loading: 'Loading profile...',
        title: 'My profile',
        signedOut: 'Please sign in to view your profile.',
        signIn: 'Sign in',
        signUp: 'Sign up',
        account: 'Account details',
        roleLabel: 'Role',
        memberSince: 'Member since',
        accountStatus: 'Account status',
        creatorStatus: 'Teacher verification',
        creatorBio: 'Bio',
        expertise: 'Expertise',
        quickActions: 'Quick actions',
        upload: 'Upload new course',
        publicProfile: 'Public teacher page',
        dashboard: 'Admin dashboard',
        explore: 'Explore courses',
        yourCourses: 'My uploaded courses',
        yourCoursesDesc: 'All of your uploaded courses are shown here with their status.',
        noCourses: 'No uploaded courses yet.',
        noCoursesHint: 'Once you upload a course, it will appear here.',
        courseCount: 'Courses',
        totalLessons: 'Lessons',
        downloads: 'Downloads',
        revenue: 'Revenue',
        email: 'Email',
        statusNote: 'Status',
        edit: 'Edit',
        view: 'View',
        rejectedReason: 'Rejected reason',
        loadError: 'Unable to load teacher courses.'
      };

  useEffect(() => {
    let active = true;

    async function loadTeacherDashboard() {
      if (!ready || !isAuthenticated || !isTeacher || !token) {
        if (active) {
          setTeacherDashboard(null);
          setLoadingTeacherData(false);
        }
        return;
      }

      try {
        setLoadingTeacherData(true);
        setTeacherError('');
        const nextDashboard = await apiRequest('/instructor/dashboard', { token });

        if (active) {
          setTeacherDashboard(nextDashboard);
        }
      } catch (error) {
        if (active) {
          setTeacherError(error.message);
        }
      } finally {
        if (active) {
          setLoadingTeacherData(false);
        }
      }
    }

    loadTeacherDashboard();
    return () => {
      active = false;
    };
  }, [ready, isAuthenticated, isTeacher, token]);

  const teacherCourses = teacherDashboard?.courses || [];
  const publicTeacherHref = isTeacher ? `/creators/${slugify(user.fullName)}` : '';

  const stats = useMemo(() => ({
    courseCount: teacherCourses.length,
    totalLessons: teacherCourses.reduce((sum, item) => sum + (item.lessonCount || 0), 0),
    downloads: teacherCourses.reduce((sum, item) => sum + (item.studentsCount || 0), 0),
    revenue: teacherDashboard?.metrics?.totalRevenue || 0
  }), [teacherCourses, teacherDashboard?.metrics?.totalRevenue]);

  if (!ready) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loading}</h1>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="page-shell px-4 py-16 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.signedOut}</h1>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/auth#signin" className="inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250]">
              {copy.signIn}
            </Link>
            <Link to="/auth#signup" className="inline-flex rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
              {copy.signUp}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel mesh-accent p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[176px,1fr] lg:gap-8">
          <div className="flex flex-col items-center gap-4 lg:items-start">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="h-32 w-32 rounded-md object-cover" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-md bg-[#f9b17a] text-3xl font-bold text-[#232844]">
                {getInitials(user.fullName)}
              </div>
            )}

            <span className="rounded-full border border-[#f9b17a]/40 bg-[#f9b17a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">
              {formatRole(user.role, locale)}
            </span>
          </div>

          <div>
            <p className="eyebrow-text">{copy.account}</p>
            <h1 className="page-title mt-3 text-white">{copy.title}</h1>
            <p className="mt-4 text-3xl font-semibold text-white">{user.fullName}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                <UserCircle2 className="h-4 w-4 text-[#f9b17a]" />
                {copy.roleLabel}: {formatRole(user.role, locale)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                <Mail className="h-4 w-4 text-[#f9b17a]" />
                {copy.email}: {user.email}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-[#f9b17a]" />
                {copy.accountStatus}: {user.status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                <BookOpen className="h-4 w-4 text-[#f9b17a]" />
                {copy.memberSince}: {formatDate(user.createdAt, locale)}
              </span>
            </div>

            {isTeacher ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">{copy.creatorStatus}</p>
                  <p className="mt-3 text-base font-medium text-white">
                    {formatVerification(user.instructorProfile.verificationStatus, locale)}
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">{copy.expertise}</p>
                  <p className="mt-2 text-sm text-slate-200">{user.instructorProfile.expertise || '-'}</p>
                </div>

                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">{copy.creatorBio}</p>
                  <p className="mt-3 text-sm text-slate-200">{user.instructorProfile.bio || '-'}</p>
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="eyebrow-text">{copy.quickActions}</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {isTeacher ? (
                  <>
                    <Link to="/upload" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
                      <Upload className="h-4 w-4" />
                      {copy.upload}
                    </Link>
                    <Link to={publicTeacherHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
                      <BookOpen className="h-4 w-4" />
                      {copy.publicProfile}
                    </Link>
                  </>
                ) : (
                  <Link to="/explore" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]">
                    <BookOpen className="h-4 w-4" />
                    {copy.explore}
                  </Link>
                )}

                {user.role === 'ADMIN' ? (
                  <Link to="/admin" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-[#f9b17a] hover:text-[#f9b17a]">
                    <LayoutDashboard className="h-4 w-4" />
                    {copy.dashboard}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isTeacher ? (
        <section className="mt-12">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="eyebrow-text">{copy.yourCourses}</p>
              <h2 className="section-title mt-2 text-white">{copy.yourCourses}</h2>
              <p className="meta-copy mt-3 max-w-2xl">{copy.yourCoursesDesc}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ProfileStatCard label={copy.courseCount} value={stats.courseCount} />
            <ProfileStatCard label={copy.totalLessons} value={stats.totalLessons} />
            <ProfileStatCard label={copy.downloads} value={stats.downloads} />
            <ProfileStatCard label={copy.revenue} value={`$${Number(stats.revenue || 0)}`} />
          </div>

          {teacherError ? (
            <div className="empty-state mt-8">
              <h3 className="card-title text-white">{copy.loadError}</h3>
              <p className="mt-3 text-slate-300">{teacherError}</p>
            </div>
          ) : loadingTeacherData ? (
            <div className="empty-state mt-8">
              <p className="text-slate-300">{copy.loading}</p>
            </div>
          ) : teacherCourses.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {teacherCourses.map((course) => (
                <TeacherCourseCard
                  key={course.id}
                  course={course}
                  locale={locale}
                  copy={copy}
                />
              ))}
            </div>
          ) : (
            <div className="surface-dark mt-8 rounded-md px-6 py-6 text-white">
              <h3 className="card-title">{copy.noCourses}</h3>
              <p className="meta-copy mt-3">{copy.noCoursesHint}</p>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}

function ProfileStatCard({ label, value }) {
  return (
    <div className="surface-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f9b17a]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TeacherCourseCard({ course, locale, copy }) {
  const statusClassName = {
    APPROVED: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
    PENDING_REVIEW: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
    REJECTED: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
    DRAFT: 'border-slate-400/30 bg-slate-500/10 text-slate-100',
    ARCHIVED: 'border-slate-400/30 bg-slate-500/10 text-slate-100'
  }[course.status] || 'border-white/10 bg-white/5 text-slate-100';

  return (
    <article className="overflow-hidden rounded-md border border-white/10 bg-[#424769] text-white shadow-soft-premium">
      <div className="aspect-[16/10] overflow-hidden bg-slate-900/40">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(249,177,122,0.26),_transparent_40%),linear-gradient(135deg,_rgba(66,71,105,1),_rgba(35,40,68,1))] px-4 text-center text-sm font-medium text-slate-100">
            {course.title}
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusClassName}`}>
            {formatCourseStatus(course.status, locale)}
          </span>
          <span className="text-sm font-medium text-[#f9b17a]">
            ${Number(course.price || 0)}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {course.shortDescription || course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-slate-200">
          <span>{getCategoryLabel(course.category?.name || course.category, locale)}</span>
          <span>{course.lessonCount || 0} lessons</span>
        </div>

        {course.rejectedReason ? (
          <div className="rounded-md border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {copy.rejectedReason}: {course.rejectedReason}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/courses/${course.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f9b17a] px-4 py-2 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b]"
          >
            <Pencil className="h-4 w-4" />
            {copy.edit}
          </Link>

          {course.status === 'APPROVED' && course.slug ? (
            <Link
              to={`/resources/${course.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-[#f9b17a] hover:text-[#f9b17a]"
            >
              <Eye className="h-4 w-4" />
              {copy.view}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
