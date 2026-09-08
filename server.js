const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Blogger Feed URL (Retrieves JSON format directly from Blogger API)
const BLOGGER_FEED_URL = 'https://edubyte-tech.blogspot.com/feeds/posts/default?alt=json';

// In-Memory Storage for Post Views, Likes, Comments
const postMetrics = {};

// Helper: Strip HTML tags to create short snippet summaries
function createSnippet(htmlStr, maxLength = 160) {
    if (!htmlStr) return '';
    const cleanText = htmlStr.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
}

// 1. GET /api/posts - Fetch & Serve Full Blog Posts
app.get('/api/posts', async (req, res) => {
    try {
        const response = await axios.get(BLOGGER_FEED_URL);
        const entries = response.data.feed.entry || [];

        const posts = entries.map((entry, index) => {
            // Extract unique post ID
            const rawId = entry.id ? entry.id.$t : `post-${index}`;
            const id = rawId.split('post-').pop() || `id-${index}`;

            // Extract Full Body Content
            const fullContent = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');

            // Category tag
            const category = (entry.category && entry.category[0]) ? entry.category[0].term : 'Tech Blog';

            // Post Link
            const linkObj = entry.link ? entry.link.find(l => l.rel === 'alternate') : null;
            const link = linkObj ? linkObj.href : '';

            // Initialize metrics if loading for the first time
            if (!postMetrics[id]) {
                postMetrics[id] = { views: 0, likes: 0, comments: [] };
            }

            return {
                id: id,
                title: entry.title ? entry.title.$t : 'Untitled Post',
                link: link,
                category: category,
                snippet: createSnippet(fullContent),
                content: fullContent, // Send complete HTML content to frontend
                views: postMetrics[id].views,
                likes: postMetrics[id].likes,
                comments: postMetrics[id].comments
            };
        });

        res.json({
            success: true,
            count: posts.length,
            posts: posts
        });

    } catch (err) {
        console.error('Error fetching Blogger feed via Axios:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Blogger posts',
            error: err.message
        });
    }
});

// 2. POST /api/posts/:id/view - Increment View Counter
app.post('/api/posts/:id/view', (req, res) => {
    const { id } = req.params;
    if (!postMetrics[id]) {
        postMetrics[id] = { views: 0, likes: 0, comments: [] };
    }
    postMetrics[id].views += 1;

    res.json({
        success: true,
        views: postMetrics[id].views
    });
});

// 3. POST /api/posts/:id/like - Increment Like Counter
app.post('/api/posts/:id/like', (req, res) => {
    const { id } = req.params;
    if (!postMetrics[id]) {
        postMetrics[id] = { views: 0, likes: 0, comments: [] };
    }
    postMetrics[id].likes += 1;

    res.json({
        success: true,
        likes: postMetrics[id].likes
    });
});

// 4. POST /api/posts/:id/comment - Add Comment
app.post('/api/posts/:id/comment', (req, res) => {
    const { id } = req.params;
    const { user, text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    if (!postMetrics[id]) {
        postMetrics[id] = { views: 0, likes: 0, comments: [] };
    }

    const newComment = {
        user: user || 'Anonymous',
        text: text.trim(),
        timestamp: new Date().toISOString()
    };

    postMetrics[id].comments.push(newComment);

    res.json({
        success: true,
        comments: postMetrics[id].comments
    });
});

// Root Endpoint Health Check
app.get('/', (req, res) => {
    res.send('EduByte Backend API (Axios Version) is online.');
});

app.listen(PORT, () => {
    console.log(`EduByte backend running on port ${PORT}`);
});