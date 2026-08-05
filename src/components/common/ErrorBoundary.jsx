import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('[MyToon] Erreur applicative :', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '26px', color: 'var(--white)' }}>
            Oups, quelque chose a mal tourné
          </h1>
          <p style={{ color: 'var(--gray-500)', margin: '12px 0 24px' }}>
            Un problème est survenu sur cette page. Recharge la page ou reviens à l'accueil.
          </p>
          <a className="btn btn-primary" style={{ padding: '12px 28px' }} href="/">
            Revenir à l'accueil
          </a>
        </div>
      )
    }
    return this.props.children
  }
}