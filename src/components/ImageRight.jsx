export default function ImageRight({ src, alt, width = 300, children }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ flexGrow: 1 }}>{children}</div>
      <img src={src} alt={alt} width={width} style={{ flexShrink: 0 }} />
    </div>
  );
}