import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../lib/auth';
import { fetchCategories, getCategoryLabel } from '../lib/content';
import { useLanguage } from '../lib/i18n';

export function CourseEditPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const { token, user, ready, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    language: '',
    level: 'Beginner'
  });

  const copy = useMemo(() => (locale === 'mn'
    ? {
        loading: 'Хичээлийн мэдээллийг ачаалж байна...',
        title: 'Хичээл засах',
        body: 'Энд course-ийн үндсэн мэдээллийг өөрчилнө. Хадгалсны дараа admin review рүү дахин орно.',
        loginNeeded: 'Хичээл засахын тулд эхлээд нэвтэрнэ үү.',
        signIn: 'Нэвтрэх',
        accessDenied: 'Энэ хэсгийг зөвхөн багш ашиглана.',
        backProfile: 'Профайл руу буцах',
        courseTitle: 'Хичээлийн гарчиг',
        category: 'Ангилал',
        shortDescription: 'Товч тайлбар',
        description: 'Дэлгэрэнгүй тайлбар',
        language: 'Хэл',
        level: 'Түвшин',
        cover: 'Cover зураг',
        coverHint: 'Шинэ зургийг drag/drop хийж эсвэл сонгож оруулна уу.',
        coverEmpty: 'Зураг оруулах',
        save: 'Өөрчлөлт хадгалах',
        saving: 'Хадгалж байна...',
        success: 'Хичээл шинэчлэгдэж review рүү илгээгдлээ.',
        loadError: 'Хичээлийн мэдээлэл уншиж чадсангүй.',
        beginner: 'Анхан',
        intermediate: 'Дунд',
        advanced: 'Ахисан'
      }
    : {
        loading: 'Loading course...',
        title: 'Edit course',
        body: 'Update the core course details here. After saving, the course goes back into admin review.',
        loginNeeded: 'Please sign in to edit this course.',
        signIn: 'Sign in',
        accessDenied: 'Only teachers can edit courses here.',
        backProfile: 'Back to profile',
        courseTitle: 'Course title',
        category: 'Category',
        shortDescription: 'Short description',
        description: 'Description',
        language: 'Language',
        level: 'Level',
        cover: 'Cover image',
        coverHint: 'Drag and drop a new image or choose one.',
        coverEmpty: 'Upload image',
        save: 'Save changes',
        saving: 'Saving...',
        success: 'Course updated and resubmitted for review.',
        loadError: 'Unable to load the course.',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      }), [locale]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(course?.thumbnailUrl || '');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [course?.thumbnailUrl, thumbnailFile]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!ready || !isAuthenticated || user?.role !== 'INSTRUCTOR' || !token) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const [courseData, categoryData] = await Promise.all([
          apiRequest(`/instructor/courses/${courseId}`, { token }),
          fetchCategories()
        ]);

        if (!active) {
          return;
        }

        setCourse(courseData);
        setCategories(categoryData);
        setFormState({
          title: courseData.title || '',
          categoryId: courseData.category?.id || '',
          shortDescription: courseData.shortDescription || '',
          description: courseData.description || '',
          language: courseData.language || '',
          level: courseData.level || 'Beginner'
        });
      } catch (error) {
        if (active) {
          setStatus({ type: 'error', message: error.message });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [courseId, isAuthenticated, ready, token, user?.role]);

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setBusy(true);
      setStatus({ type: '', message: '' });

      const formData = new FormData();
      formData.set('title', formState.title);
      formData.set('categoryId', formState.categoryId);
      formData.set('shortDescription', formState.shortDescription);
      formData.set('description', formState.description);
      formData.set('language', formState.language);
      formData.set('level', formState.level);

      if (thumbnailFile) {
        formData.set('thumbnail', thumbnailFile);
      }

      await apiRequest(`/instructor/courses/${courseId}`, {
        method: 'PUT',
        token,
        body: formData
      });

      setStatus({ type: 'success', message: copy.success });
      navigate('/profile');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBusy(false);
    }
  }

  if (!ready || loading) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">{copy.loading}</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.loginNeeded}</h1>
          <Link to="/auth#signin" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {copy.signIn}
          </Link>
        </div>
      </main>
    );
  }

  if (user?.role !== 'INSTRUCTOR') {
    return (
      <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="empty-state">
          <h1 className="page-title text-white">{copy.accessDenied}</h1>
          <Link to="/profile" className="mt-6 inline-flex rounded-md bg-[#f9b17a] px-4 py-3 text-sm font-medium text-[#232844]">
            {copy.backProfile}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface-panel mesh-accent max-w-4xl p-5 sm:p-8">
        <p className="eyebrow-text">{copy.title}</p>
        <h1 className="page-title mt-3 text-white">{course?.title || copy.title}</h1>
        <p className="body-copy mt-4">{copy.body}</p>
      </div>

      <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
        <section className="surface-panel grid gap-6 p-5 sm:p-8 md:grid-cols-2">
          <Field label={copy.courseTitle}>
            <input
              type="text"
              value={formState.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="input-base"
              required
            />
          </Field>

          <Field label={copy.category}>
            <select
              value={formState.categoryId}
              onChange={(event) => updateField('categoryId', event.target.value)}
              className="select-base"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryLabel(category.name, locale)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={copy.shortDescription} className="md:col-span-2">
            <input
              type="text"
              value={formState.shortDescription}
              onChange={(event) => updateField('shortDescription', event.target.value)}
              className="input-base"
            />
          </Field>

          <Field label={copy.description} className="md:col-span-2">
            <textarea
              rows="6"
              value={formState.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="input-base"
              required
            />
          </Field>

          <Field label={copy.language}>
            <input
              type="text"
              value={formState.language}
              onChange={(event) => updateField('language', event.target.value)}
              className="input-base"
            />
          </Field>

          <Field label={copy.level}>
            <select
              value={formState.level}
              onChange={(event) => updateField('level', event.target.value)}
              className="select-base"
            >
              <option value="Beginner">{copy.beginner}</option>
              <option value="Intermediate">{copy.intermediate}</option>
              <option value="Advanced">{copy.advanced}</option>
            </select>
          </Field>

          <Field label={copy.cover} className="md:col-span-2">
            <DragImageInput
              name="thumbnail"
              accept="image/*"
              hint={copy.coverHint}
              emptyLabel={copy.coverEmpty}
              file={thumbnailFile}
              previewUrl={thumbnailPreview}
              onFileChange={setThumbnailFile}
            />
          </Field>
        </section>

        {status.message ? (
          <p
            className={`rounded-md px-4 py-3 text-sm ${
              status.type === 'error'
                ? 'border border-rose-300/25 bg-rose-400/10 text-rose-100'
                : 'border border-[#f9b17a]/30 bg-[#f9b17a]/10 text-[#ffd3af]'
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-[#f9b17a] px-5 py-3 text-sm font-medium text-[#2d3250] transition hover:bg-[#f6a56b] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {busy ? copy.saving : copy.save}
          </button>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-[#f9b17a] hover:text-[#f9b17a]"
          >
            {copy.backProfile}
          </Link>
        </div>
      </form>
    </main>
  );
}

function DragImageInput({ name, accept, hint, emptyLabel, file, previewUrl, onFileChange }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList) => {
    onFileChange(fileList?.[0] || null);
  };

  return (
    <label
      className={`flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 text-center text-sm transition ${
        dragActive
          ? 'border-[#f9b17a] bg-[#f9b17a]/10 text-[#ffd7b6]'
          : 'border-white/20 bg-white/5 text-slate-300'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragActive(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      {previewUrl ? (
        <img src={previewUrl} alt={file?.name || name} className="mb-4 h-36 w-full max-w-[240px] rounded-md object-cover" />
      ) : null}

      <span className="font-medium text-slate-200">{emptyLabel}</span>
      <span className="mt-2">{hint}</span>

      {file ? (
        <span className="mt-3 text-[#f9b17a]">
          {file.name}
        </span>
      ) : null}

      <input
        name={name}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </label>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}
