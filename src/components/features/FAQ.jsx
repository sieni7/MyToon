import { useState } from 'react'
import { FAQ as FAQ_DATA } from '../../utils/constants'

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={itemStyle}>
      <button
        onClick={() => setOpen(!open)}
        style={questionStyle}
      >
        <span>{item.q}</span>
        <span style={{ ...chevronStyle, transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
      </button>
      {open && (
        <div style={answerStyle}>
          {item.a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" style={sectionStyle}>
      <div className="container" style={containerStyle}>
        <div style={headerStyle}>
          <h2 className="section-title" style={titleStyle}>
            Questions <span className="gradient-text">fréquentes</span>
          </h2>
        </div>

        <div style={listStyle}>
          {FAQ_DATA.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

const sectionStyle = { padding: '100px 0', background: 'var(--black-2)' }

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '700px', margin: '0 auto' }

const headerStyle = { textAlign: 'center' }

const titleStyle = {
  fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700,
  letterSpacing: '-1px', color: 'var(--white)',
}

const listStyle = { display: 'flex', flexDirection: 'column', gap: '12px' }

const itemStyle = {
  background: 'var(--black-3)', borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
}

const questionStyle = {
  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '20px 24px', background: 'none', border: 'none',
  fontSize: '16px', fontWeight: 600, color: 'var(--white)',
  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
}

const chevronStyle = {
  fontSize: '24px', fontWeight: 300, color: 'var(--orange)',
  transition: 'transform 0.3s ease',
}

const answerStyle = {
  padding: '0 24px 20px', fontSize: '14px', color: 'var(--gray-400)',
  lineHeight: 1.7, animation: 'slide-up 0.3s ease-out',
}
