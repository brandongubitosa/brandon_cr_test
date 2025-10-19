const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

// sample products
const PRODUCTS = [
  { id: 'ai-101', title: 'Intro to AI', price: 19.99 },
  { id: 'ml-projects', title: 'Hands-on ML Projects', price: 39.99 }
]

app.get('/api/products', (req, res) => res.json(PRODUCTS))

app.listen(port, () => console.log('API listening on port', port))
