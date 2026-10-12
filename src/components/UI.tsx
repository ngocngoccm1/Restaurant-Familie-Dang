import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
export function Arrow() {
  return <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />;
}
export function Frame({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`frame ${className}`}>
      <span className="frame-corner c1" />
      <span className="frame-corner c2" />
      <span className="frame-corner c3" />
      <span className="frame-corner c4" />
      {label && <span className="eyebrow frame-label">{label}</span>}
      {children}
    </div>
  );
}
export function SectionRule({ children }: { children: ReactNode }) {
  return (
    <div className="section-rule">
      <span />
      {children}
      <span />
    </div>
  );
}
export function Photo({
  name,
  alt,
  className = "",
  eager = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      className={`photo ${className}`}
      src={`/images/${name}.webp`}
      srcSet={
        ["sushi-table", "sushi-bowls", "pho", "sake"].includes(name)
          ? `/images/${name}-small.webp ${name === "pho" ? 600 : 720}w, /images/${name}.webp ${name === "sushi-table" ? 1440 : name === "sushi-bowls" ? 1024 : name === "pho" ? 790 : 972}w`
          : undefined
      }
      sizes={eager ? "100vw" : "(max-width: 640px) 90vw, 600px"}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
    />
  );
}
export function Dialog({
  title,
  children,
  onClose,
  className = "",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-head">
        <span className="eyebrow">{title}</span>
        <button
          className="icon-button"
          aria-label="Schließen"
          onClick={onClose}
        >
          <X size={23} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
