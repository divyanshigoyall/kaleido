export default function Mark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <path d="M15 1 L15 15 L1 15 Z" fill="var(--sup)" />
      <path d="M15 1 L29 15 L15 15 Z" fill="var(--cri)" />
      <path d="M1 15 L15 15 L15 29 Z" fill="var(--bal)" />
      <path d="M15 15 L29 15 L15 29 Z" fill="var(--alt)" />
    </svg>
  )
}
