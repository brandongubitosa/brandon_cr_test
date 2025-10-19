import React from 'react'

export default function App(){
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
          <div className="card">Sample Product</div>
          <div className="card">Sample Product</div>
          <div className="card">Sample Product</div>
        </section>
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} AI Learning Marketplace</footer>
    </div>
  )
}
