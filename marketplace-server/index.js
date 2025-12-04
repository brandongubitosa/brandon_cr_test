const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

// sample products
const PRODUCTS = [
  { id: 'ai-101', title: 'Intro to AI', price: 19.99, theme: 'ai_ml', difficulty: 'beginner' },
  { id: 'ml-projects', title: 'Hands-on ML Projects', price: 39.99, theme: 'ai_ml', difficulty: 'intermediate' },
  { id: 'react-advanced', title: 'Advanced React Patterns', price: 29.99, theme: 'frontend', difficulty: 'advanced' },
  { id: 'node-api', title: 'Building APIs with Node.js', price: 34.99, theme: 'backend', difficulty: 'intermediate' }
]

// Content gap data (from CodeRabbit blog analyzer)
const CONTENT_GAPS = [
  { theme: 'testing', count: 1, percentage: 3.57, suggestion: 'Testing Best Practices & Strategies' },
  { theme: 'documentation', count: 1, percentage: 3.57, suggestion: 'Documentation as Code & API Docs' },
  { theme: 'devops', count: 1, percentage: 3.57, suggestion: 'Advanced DevOps & Kubernetes' },
  { theme: 'security', count: 2, percentage: 7.14, suggestion: 'Security Hardening & Vulnerability Management' },
  { theme: 'frontend', count: 2, percentage: 7.14, suggestion: 'Vue.js & Angular Mastery' },
  { theme: 'git', count: 2, percentage: 7.14, suggestion: 'Advanced Git Workflows & Team Collaboration' }
]

app.get('/api/products', (req, res) => res.json(PRODUCTS))

app.get('/api/content-gaps', (req, res) => {
  res.json({
    total_blogs: 11,
    gaps: CONTENT_GAPS,
    recommendation: 'These topics show high demand but low coverage. Create courses on these topics to capture market demand.'
  })
})

// Recommend courses based on content gaps
app.get('/api/recommended-courses', (req, res) => {
  const gapThemes = CONTENT_GAPS.map(g => g.theme)
  const recommended = PRODUCTS.filter(p => gapThemes.includes(p.theme))
    .map(p => ({ ...p, badge: 'High Demand' }))
  
  res.json(recommended)
})

app.listen(port, () => console.log('🚀 Marketplace API listening on port', port))
