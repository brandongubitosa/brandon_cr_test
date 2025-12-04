"""Blog summarizer and theme extractor."""

import re
from collections import Counter

class Summarizer:
    """Extracts themes and summaries from blog content."""
    
    # Common AI/DevOps/CodeReview themes
    THEMES = {
        'code_review': ['code review', 'review', 'reviewer', 'pull request', 'pr'],
        'ai_ml': ['ai', 'machine learning', 'ml', 'neural', 'gpt', 'llm', 'llama'],
        'testing': ['test', 'testing', 'pytest', 'unit test', 'test case'],
        'security': ['security', 'vulnerability', 'secure', 'cve', 'auth', 'encryption'],
        'performance': ['performance', 'optimization', 'speed', 'latency', 'benchmark'],
        'documentation': ['documentation', 'docs', 'readme', 'comment'],
        'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'deployment', 'deploy'],
        'frontend': ['frontend', 'react', 'vue', 'angular', 'javascript', 'css', 'html'],
        'backend': ['backend', 'api', 'database', 'python', 'node', 'java'],
        'git': ['git', 'github', 'gitlab', 'version control', 'commit'],
    }
    
    def __init__(self):
        self.summaries = []
    
    def extract_themes(self, blogs):
        """Identify themes from blog titles and content."""
        theme_counts = {theme: 0 for theme in self.THEMES}
        blog_themes = {}
        
        for blog in blogs:
            text = (blog.get('title', '') + ' ' + blog.get('preview', '')).lower()
            detected_themes = []
            
            for theme, keywords in self.THEMES.items():
                if any(keyword in text for keyword in keywords):
                    detected_themes.append(theme)
                    theme_counts[theme] += 1
            
            blog_themes[blog.get('title', 'Unknown')] = detected_themes or ['other']
        
        return theme_counts, blog_themes
    
    def summarize_by_theme(self, blogs, theme_mapping):
        """Group and summarize blogs by theme."""
        theme_summary = {theme: [] for theme in self.THEMES}
        theme_summary['other'] = []
        
        for blog in blogs:
            blog_title = blog.get('title', 'Unknown')
            themes = theme_mapping.get(blog_title, ['other'])
            
            summary = {
                'title': blog_title,
                'url': blog.get('url'),
                'date': blog.get('date'),
                'preview': blog.get('preview', '')[:150]
            }
            
            for theme in themes:
                if theme in theme_summary:
                    theme_summary[theme].append(summary)
        
        return theme_summary
    
    def identify_gaps(self, theme_counts):
        """Identify underrepresented topics (content gaps)."""
        total_blogs = sum(theme_counts.values())
        if total_blogs == 0:
            return []
        
        gaps = []
        threshold = total_blogs * 0.1  # Topics with <10% coverage
        
        for theme, count in sorted(theme_counts.items(), key=lambda x: x[1]):
            if count < threshold and count >= 0:
                gaps.append({
                    'theme': theme,
                    'count': count,
                    'percentage': (count / total_blogs * 100) if total_blogs > 0 else 0,
                    'suggestion': f"Write more about {theme} ({count} posts found)"
                })
        
        return sorted(gaps, key=lambda x: x['count'])
    
    def generate_report(self, blogs):
        """Generate a full analysis report."""
        theme_counts, blog_themes = self.extract_themes(blogs)
        theme_summary = self.summarize_by_theme(blogs, blog_themes)
        gaps = self.identify_gaps(theme_counts)
        
        report = {
            'total_blogs': len(blogs),
            'themes_found': len([t for t in theme_counts.values() if t > 0]),
            'theme_distribution': theme_counts,
            'blogs_by_theme': theme_summary,
            'content_gaps': gaps,
        }
        
        return report
