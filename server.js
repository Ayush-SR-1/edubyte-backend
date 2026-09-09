const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Trust proxy headers for deployment platforms like Render
app.set('trust proxy', true);

// Change this key to whatever secret key you prefer
const OWNER_SECRET_KEY = 'ayush-admin-secret'; 

// In-memory posts store with full HTML content
let posts = [
    {
        id: "1",
        title: "Can AI Actually Be Creative?",
        category: "AI Art",
        snippet: "An unexpected machine is not the same as an unintended machine. While discussing creativity...",
        content: `
            <p>Can an algorithm truly possess an artistic soul? When Midjourney generates a painting or Claude composes a poem, we are witnessing complex statistical pattern matching—not human emotion.</p>
            <h2>The Nature of Pattern Matching</h2>
            <p>Machine learning models analyze billions of parameters to predict the next token or pixel. While the output appears novel, it is a mathematical synthesis of existing human expression.</p>
            <h2>Intentionality vs. Output</h2>
            <p>True creativity requires intent, consciousness, and lived experience. An unexpected output from a model is fascinating, but unexpected execution is not the same as conscious artistic intent.</p>
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
            <p>Large Language Models are non-deterministic, meaning they generate responses based on probability rather than verified truth. Trusting AI requires robust verification frameworks.</p>
            <h2>Understanding Hallucinations</h2>
            <p>Because models optimize for plausible-sounding language rather than factual accuracy, they can confidently generate false citations, dates, or calculations.</p>
            <h2>Verification Techniques</h2>
            <p>To mitigate these errors, developers use Retrieval-Augmented Generation (RAG), ground-truth database lookups, and chain-of-thought verification constraints.</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],
        commentedIPs: [],
        comments: []
    },
    {
        id: "3",
        title: "The Future of Web Architecture",
        category: "Web Dev",
        snippet: "Moving beyond monolithic systems toward decoupled edge computing and modern rendering paradigms...",
        content: `
            <p>Modern web engineering is shifting rapidly toward edge delivery networks and decoupled serverless backends to minimize latency and maximize scalability.</p>
            <h2>The Power of Edge Computing</h2>
            <p>By computing requests closer to the end user via CDN worker nodes, applications achieve near-instant response times across global regions.</p>
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

// 3. Like Post (1 per IP, Unlimited for Owner)
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

// 4. Comment on Post (1 per IP, Unlimited for Owner)
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