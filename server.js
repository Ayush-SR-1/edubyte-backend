require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Enable CORS for all incoming connections (GitHub Pages frontend access)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BLOGGER_URL = 'https://edubyte-tech.blogspot.com/feeds/posts/default?alt=json';

// Fetch Blogger posts merged with Supabase views, likes, AND comments
app.get('/api/posts', async (req, res) => {
    try {
        const bloggerRes = await axios.get(BLOGGER_URL);
        const entries = bloggerRes.data.feed.entry || [];

        // Fetch DB Stats & Comments in parallel
        const [statsResult, commentsResult] = await Promise.all([
            supabase.from('post_stats').select('*'),
            supabase.from('comments').select('*').order('created_at', { ascending: true })
        ]);

        const dbStats = statsResult.data || [];
        const dbComments = commentsResult.data || [];

        // Create Stats lookup map
        const statsMap = dbStats.reduce((acc, curr) => {
            acc[curr.post_id] = curr;
            return acc;
        }, {});

        // Group Comments by post_id
        const commentsMap = dbComments.reduce((acc, curr) => {
            if (!acc[curr.post_id]) acc[curr.post_id] = [];
            acc[curr.post_id].push({
                user: curr.user_name || 'Reader',
                text: curr.comment_text
            });
            return acc;
        }, {});

        const posts = entries.map((entry, index) => {
            const postId = entry.id.$t.split('.post-')[1] || `post-${index}`;
            const linkObj = entry.link.find(l => l.rel === 'alternate');
            const content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : '');
            const snippet = content.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...';

            return {
                id: postId,
                title: entry.title.$t,
                link: linkObj ? linkObj.href : 'https://edubyte-tech.blogspot.com/',
                snippet: snippet,
                views: statsMap[postId]?.views || 0,
                likes: statsMap[postId]?.likes || 0,
                comments: commentsMap[postId] || []
            };
        });

        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Increment views
app.post('/api/posts/:id/view', async (req, res) => {
    try {
        const postId = req.params.id;
        const { data: existing } = await supabase.from('post_stats').select('views').eq('post_id', postId).single();
        const currentViews = existing ? existing.views + 1 : 1;

        await supabase.from('post_stats').upsert({ post_id: postId, views: currentViews });
        res.json({ success: true, views: currentViews });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Increment likes
app.post('/api/posts/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const { data: existing } = await supabase.from('post_stats').select('likes').eq('post_id', postId).single();
        const currentLikes = existing ? existing.likes + 1 : 1;

        await supabase.from('post_stats').upsert({ post_id: postId, likes: currentLikes });
        res.json({ success: true, likes: currentLikes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fetch individual post comments
app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ success: false, error: error.message });
    res.json({ success: true, comments });
});

// Submit comment (aligned with singular /comment endpoint and frontend keys)
app.post('/api/posts/:id/comment', async (req, res) => {
    const postId = req.params.id;
    const user = req.body.user || req.body.userName || 'Reader';
    const text = req.body.text || req.body.commentText;

    if (!text) return res.status(400).json({ success: false, error: 'Comment text required' });

    const { error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_name: user, comment_text: text }]);

    if (error) return res.status(500).json({ success: false, error: error.message });

    // Return the updated list of comments for instant UI re-rendering
    const { data: updatedComments } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    const formattedComments = (updatedComments || []).map(c => ({
        user: c.user_name || 'Reader',
        text: c.comment_text
    }));

    res.json({ success: true, comments: formattedComments });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EduByte Server active on port ${PORT}`));