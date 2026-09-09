const express = require('express');
const cors = require('cors');

const app = express();

// Allow cross-origin requests
app.use(cors({ origin: '*' }));
app.use(express.json());

// Trust proxy headers for deployment platforms like Render
app.set('trust proxy', true);

// Owner admin secret key
const OWNER_SECRET_KEY = 'ayush-admin-secret'; 

// =========================================================================
// REPLACE THE TEXT INSIDE `content` BELOW WITH YOUR EXACT BLOG ARTICLES
// =========================================================================
let posts = [
    {
        id: "1",
        title: "Can AI Actually Be Creative?",
        category: "AI Art",
        snippet: "An unexpected machine is not the same as an unintended machine. While discussing creativity...",
        content: `
            <p><strong>[REPLACE THIS TEXT WITH YOUR EXACT ARTICLE 1 CONTENT]</strong></p>
            <p>Paste your first full blog post text here. You can use standard HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, and &lt;li&gt; to style your headings, paragraphs, and lists.</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],      
        commentedIPs: [],  
        comments: []
    },
    {
        id: "2",
        title: "Can We Trust AI-Generated Information?",
        category: "AI Ethics",
        snippet: "The concept of AI trust and digital verification utilizes structured validation against hallucinated data...",
        content: `
            <p><strong>[REPLACE THIS TEXT WITH YOUR EXACT ARTICLE 2 CONTENT]</strong></p>
            <p>Paste your second full blog post text here.</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],
        commentedIPs: [],
        comments: []
    }
];

function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress;
}

function isOwner(req) {
    return req.headers['x-owner-key'] === OWNER_SECRET_KEY;
}

// 1. Fetch All Posts
app.get('/api/posts', (req, res) => {
    res.json({ success: true, posts });
});

// 2. Increment Views
app.post('/api/posts/:id/view', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.views = (post.views || 0) + 1;
    res.json({ success: true, views: post.views });
});

// 3. Like Post
app.post('/api/posts/:id/like', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const clientIp = getClientIp(req);
    post.likedIPs = post.likedIPs || [];

    if (!isOwner(req) && post.likedIPs.includes(clientIp)) {
        return res.status(400).json({ 
            success: false, 
            message: 'You have already liked this post.',
            likes: post.likes
        });
    }

    if (!isOwner(req)) {
        post.likedIPs.push(clientIp);
    }

    post.likes = (post.likes || 0) + 1;
    res.json({ success: true, likes: post.likes });
});

// 4. Comment on Post
app.post('/api/posts/:id/comment', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const clientIp = getClientIp(req);
    post.commentedIPs = post.commentedIPs || [];

    if (!isOwner(req) && post.commentedIPs.includes(clientIp)) {
        return res.status(400).json({ 
            success: false, 
            message: 'You have already commented on this post.' 
        });
    }

    const { user, text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    if (!isOwner(req)) {
        post.commentedIPs.push(clientIp);
    }

    const newComment = {
        id: Date.now().toString(),
        user: user && user.trim() ? user.trim() : 'Anonymous',
        text: text.trim(),
        date: new Date()
    };

    post.comments.push(newComment);
    res.json({ success: true, comments: post.comments });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));