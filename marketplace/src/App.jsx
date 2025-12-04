import React, { useState, useEffect } from 'react'
import { ContentGaps } from './components/ContentGaps'

export default function App(){
  const [products, setProducts] = useState([])
  const [recommendedCourses, setRecommendedCourses] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchRecommendedCourses()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const fetchRecommendedCourses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/recommended-courses')
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendedCourses(data)
    } catch (err) {
      console.error('Error fetching recommended courses:', err)
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">AI Learning Marketplace</div>
        <nav><a href="#">Explore</a> <a href="#">Publish</a> <a href="#">Login</a></nav>
      </header>
      <main className="container">
        <section className="hero">
          <h1>Find the best AI courses, tutors, and projects</h1>
          <p>Discover, purchase, and collaborate with top AI educators and creators.</p>
        </section>
        <section className="grid" id="products">
          {products.length > 0 ? (
            products.map(p => (
              <div key={p.id} className="card">
                <h3>{p.title}</h3>
                <p className="theme-badge">{p.theme.toUpperCase()}</p>
                <p className="difficulty">{p.difficulty}</p>
                <p className="price">${p.price}</p>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )}
        </section>
      </main>
      <ContentGaps />
      {recommendedCourses.length > 0 && (
        <section className="recommended-section">
          <div className="container">
            <h2>🔥 High-Demand Courses</h2>
            <p className="recommended-subtitle">Based on content gap analysis</p>
            <div className="grid">
              {recommendedCourses.map(course => (
                <div key={course.id} className="card high-demand-card">
                  <span className="badge">{course.badge}</span>
                  <h3>{course.title}</h3>
                  <p className="theme-badge">{course.theme.toUpperCase()}</p>
                  <p className="difficulty">{course.difficulty}</p>
                  <p className="price">${course.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <footer className="site-footer">© {new Date().getFullYear()} AI Learning Marketplace</footer>
    </div>
  )
}
