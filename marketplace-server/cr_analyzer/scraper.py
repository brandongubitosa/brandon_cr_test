"""Web scraper for CodeRabbit blogs."""

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
from pathlib import Path

class BlogScraper:
    """Scrapes CodeRabbit blog posts from coderabbit.ai/blog."""
    
    BASE_URL = "https://coderabbit.ai/blog"
    CACHE_DIR = Path(__file__).parent.parent / "data"
    
    def __init__(self):
        self.CACHE_DIR.mkdir(exist_ok=True)
        self.blogs = []
    
    def scrape(self):
        """Fetch blog posts from CodeRabbit blog page."""
        try:
            response = requests.get(self.BASE_URL, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract blog post links and metadata
            # Note: Adjust selectors based on actual CodeRabbit site structure
            articles = soup.find_all('article', class_='blog-post')
            
            if not articles:
                # Fallback: try alternative selectors
                articles = soup.find_all('div', class_='post')
            
            for article in articles:
                blog = self._parse_article(article)
                if blog:
                    self.blogs.append(blog)
            
            print(f"✓ Scraped {len(self.blogs)} blog posts")
            return self.blogs
        
        except Exception as e:
            print(f"✗ Error scraping blog: {e}")
            return []
    
    def _parse_article(self, article):
        """Parse individual article HTML."""
        try:
            title_elem = article.find('h2') or article.find('h3')
            title = title_elem.get_text(strip=True) if title_elem else "Unknown"
            
            link_elem = article.find('a', href=True)
            url = link_elem['href'] if link_elem else None
            
            date_elem = article.find('time')
            date_str = date_elem.get_text(strip=True) if date_elem else "Unknown"
            
            content_elem = article.find('p') or article.find('div', class_='content')
            content_preview = content_elem.get_text(strip=True)[:300] if content_elem else ""
            
            return {
                'title': title,
                'url': url,
                'date': date_str,
                'preview': content_preview,
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"  Warning: Could not parse article: {e}")
            return None
    
    def save_cache(self, filename='blogs_cache.json'):
        """Save scraped blogs to cache."""
        cache_file = self.CACHE_DIR / filename
        with open(cache_file, 'w') as f:
            json.dump(self.blogs, f, indent=2)
        print(f"✓ Saved {len(self.blogs)} blogs to {cache_file}")
        return cache_file
    
    def load_cache(self, filename='blogs_cache.json'):
        """Load blogs from cache."""
        cache_file = self.CACHE_DIR / filename
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                self.blogs = json.load(f)
            print(f"✓ Loaded {len(self.blogs)} blogs from cache")
            return self.blogs
        return []
