export default function SectionDivider() {
  return (
    <div className="container" style={wrapperStyle} aria-hidden="true">
      <div style={lineStyle} />
    </div>
  )
}

const wrapperStyle = { paddingTop: '0', paddingBottom: '0' }

const lineStyle = {
  width: '100%',
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(255,107,53,0.35) 30%, var(--orange) 50%, rgba(255,107,53,0.35) 70%, transparent 100%)',
  boxShadow: '0 0 10px rgba(255,107,53,0.18)',
}
