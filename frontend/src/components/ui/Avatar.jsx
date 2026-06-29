export function Avatar({ src, alt, size = 40 }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-slate-200 flex shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}