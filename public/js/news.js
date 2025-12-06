// News Feed Configuration
const RSS_FEEDS = [
    {
        name: 'Industry Today',
        url: 'https://industrytoday.com/feed/'
    },
    {
        name: 'TCT Magazine',
        url: 'https://www.tctmagazine.com/feed/'
    }
];

// Multiple CORS proxies to try (fallback chain)
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

// DOM Elements
let newsGrid, loadingEl, errorEl;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    newsGrid = document.getElementById('news-grid');
    loadingEl = document.getElementById('news-loading');
    errorEl = document.getElementById('news-error');

    if (newsGrid && loadingEl) {
        init();
    }
});

// Fetch with retry using multiple proxies
async function fetchWithRetry(url, retries = 3) {
    for (const proxy of CORS_PROXIES) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                const response = await fetch(proxy + encodeURIComponent(url), {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const text = await response.text();
                    if (text && text.includes('<item>')) {
                        return text;
                    }
                }
            } catch (e) {
                console.log(`Attempt ${attempt + 1} with ${proxy} failed for ${url}`);
                await new Promise(r => setTimeout(r, 500));
            }
        }
    }
    return null;
}

// Try to fetch RSS feeds
async function fetchFeeds() {
    const allArticles = [];

    // Fetch feeds in parallel
    const feedPromises = RSS_FEEDS.map(async (feed) => {
        const xmlText = await fetchWithRetry(feed.url);
        if (xmlText) {
            const articles = parseRSS(xmlText);
            return articles.map(article => ({
                ...article,
                source: feed.name
            }));
        }
        return [];
    });

    const results = await Promise.all(feedPromises);
    results.forEach(articles => allArticles.push(...articles));

    return allArticles;
}

// Parse RSS XML
function parseRSS(xmlText) {
    try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const items = xml.querySelectorAll('item');

        return Array.from(items).slice(0, 6).map(item => ({
            title: item.querySelector('title')?.textContent || '',
            link: item.querySelector('link')?.textContent || '',
            description: stripHtml(item.querySelector('description')?.textContent || '').substring(0, 150) + '...',
            pubDate: new Date(item.querySelector('pubDate')?.textContent || Date.now())
        }));
    } catch (e) {
        console.log('XML parse error:', e);
        return [];
    }
}

// Strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Create news card
function createNewsCard(article) {
    const card = document.createElement('a');
    card.href = article.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'news-card';

    card.innerHTML = `
        <div class="news-card-header">
            <span class="news-source">${article.source}</span>
            <span class="news-date">${formatDate(article.pubDate)}</span>
        </div>
        <h3 class="news-card-title">${article.title}</h3>
        <p class="news-card-description">${article.description}</p>
        <span class="news-card-link">Read more →</span>
    `;

    return card;
}

// Render news
function renderNews(articles) {
    articles.sort((a, b) => b.pubDate - a.pubDate);
    const displayArticles = articles.slice(0, 9);

    newsGrid.innerHTML = '';
    displayArticles.forEach(article => {
        newsGrid.appendChild(createNewsCard(article));
    });
}

// Show error state
function showError() {
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
}

// Initialize
async function init() {
    try {
        const articles = await fetchFeeds();

        if (loadingEl) loadingEl.style.display = 'none';

        if (articles.length === 0) {
            showError();
            return;
        }

        renderNews(articles);

    } catch (error) {
        console.error('Error initializing news feed:', error);
        showError();
    }
}
