import { useState, useEffect } from 'react'
import '../styles/content-gaps.css'

export function ContentGaps() {
  const [gaps, setGaps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContentGaps()
  }, [])

  const fetchContentGaps = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/content-gaps')
      if (!response.ok) throw new Error('Failed to fetch gaps')
      const data = await response.json()
      setGaps(data.gaps || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching content gaps:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="gaps-container"><p className="loading">📊 Analyzing content gaps...</p></div>
  if (error) return <div className="gaps-container"><p className="error">❌ Error loading gaps: {error}</p></div>

  return (
    <section className="gaps-section">
      <div className="gaps-container">
        <div className="gaps-header">
          <h2>📈 Content Gaps & Opportunities</h2>
          <p className="gaps-subtitle">High-demand topics with low coverage</p>
        </div>

        <div className="gaps-grid">
          {gaps.map((gap) => (
            <div key={gap.theme} className="gap-card">
              <div className="gap-card-header">
                <h3 className="gap-theme">{formatTheme(gap.theme)}</h3>
                <span className="gap-badge">{gap.percentage.toFixed(1)}%</span>
              </div>
              <p className="gap-description">{gap.suggestion}</p>
              <div className="gap-meta">
                <span className="gap-count">{gap.count} post{gap.count !== 1 ? 's' : ''}</span>
                <span className="gap-demand">🔥 High Demand</span>
              </div>
            </div>
          ))}
        </div>

        <div className="gaps-callout">
          <p>💡 <strong>Strategy Insight:</strong> These topics show market demand but lack coverage in CodeRabbit's current content. Consider creating courses on these subjects to capture demand and increase revenue.</p>
        </div>
      </div>
    </section>
  )
}

function formatTheme(theme) {
  const themeName = {
    testing: '🧪 Testing',
    documentation: '📚 Documentation',
    devops: '⚙️ DevOps',
    security: '🔒 Security',
    frontend: '🎨 Frontend',
    git: '🔀 Git',
    ai_ml: '🤖 AI/ML',
    backend: '⚙️ Backend',
    code_review: '👁️ Code Review',
    performance: '⚡ Performance'
  }
  return themeName[theme] || theme
}
