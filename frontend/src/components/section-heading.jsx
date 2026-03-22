export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow-text">{eyebrow}</p> : null}
        <h2 className="section-title mt-2 text-white">{title}</h2>
        {description ? <p className="meta-copy mt-3 text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
