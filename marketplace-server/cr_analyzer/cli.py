"""CLI interface for the blog analyzer."""

import click
import json
from pathlib import Path
from .scraper import BlogScraper
from .summarizer import Summarizer

@click.group()
def cli():
    """CodeRabbit Blog Analyzer CLI."""
    pass

@cli.command()
def scrape():
    """Scrape CodeRabbit blogs."""
    click.echo("🔄 Scraping CodeRabbit blogs...")
    scraper = BlogScraper()
    blogs = scraper.scrape()
    
    if blogs:
        scraper.save_cache()
        click.echo(f"✓ Successfully scraped {len(blogs)} blogs")
    else:
        click.echo("✗ No blogs found or scraping failed")

@cli.command()
def themes():
    """Analyze blog themes."""
    click.echo("📊 Analyzing blog themes...")
    
    scraper = BlogScraper()
    scraper.load_cache()
    
    if not scraper.blogs:
        click.echo("✗ No cached blogs found. Run 'scrape' first.")
        return
    
    summarizer = Summarizer()
    report = summarizer.generate_report(scraper.blogs)
    
    click.echo(f"\n📈 Theme Distribution ({report['total_blogs']} blogs):")
    for theme, count in sorted(report['theme_distribution'].items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            pct = (count / report['total_blogs'] * 100) if report['total_blogs'] > 0 else 0
            bar = '█' * int(pct / 5)
            click.echo(f"  {theme:20} {count:3} ({pct:5.1f}%) {bar}")

@cli.command()
def gaps():
    """Identify content gaps."""
    click.echo("🔍 Finding content gaps...")
    
    scraper = BlogScraper()
    scraper.load_cache()
    
    if not scraper.blogs:
        click.echo("✗ No cached blogs found. Run 'scrape' first.")
        return
    
    summarizer = Summarizer()
    report = summarizer.generate_report(scraper.blogs)
    gaps = report['content_gaps']
    
    if gaps:
        click.echo(f"\n💡 Suggested Topics to Cover:")
        for gap in gaps[:5]:
            click.echo(f"  • {gap['suggestion']}")
    else:
        click.echo("✓ All topics are well covered!")

@cli.command()
def report():
    """Generate full analysis report."""
    click.echo("📋 Generating full report...")
    
    scraper = BlogScraper()
    scraper.load_cache()
    
    if not scraper.blogs:
        click.echo("✗ No cached blogs found. Run 'scrape' first.")
        return
    
    summarizer = Summarizer()
    report = summarizer.generate_report(scraper.blogs)
    
    # Save report
    report_file = Path(__file__).parent.parent / "data" / "report.json"
    report_file.parent.mkdir(exist_ok=True)
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    click.echo(f"✓ Report saved to {report_file}")
    click.echo(f"\n📊 Summary:")
    click.echo(f"  Total blogs: {report['total_blogs']}")
    click.echo(f"  Themes covered: {report['themes_found']}")
    click.echo(f"  Content gaps found: {len(report['content_gaps'])}")

if __name__ == '__main__':
    cli()
