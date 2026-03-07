import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '2rem',
          background: '#f5f0e8', color: '#2f3b2f', fontFamily: 'sans-serif',
        }}>
          <div style={{
            background: '#fff', border: '1px solid #e4d8c8', borderRadius: '16px',
            padding: '2rem', maxWidth: '500px', width: '100%', textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ margin: '0 0 0.5rem', color: '#c0392b' }}>Something crashed</h2>
            <p style={{ color: '#666', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
              style={{
                background: '#2f4b31', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '0.6rem 1.5rem', cursor: 'pointer', fontWeight: 600,
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;