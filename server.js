require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const BLOGGER_URL = 'https://edubyte-tech.blogspot.com/feeds/posts/default?alt=json';

// Fetch Blogger posts merged with Supabase stats
app.get('/api/posts', async (req, res) => {
    try {
        const bloggerRes = await axios.get(BLOGGER_URL);
        const entries = bloggerRes.data.feed.entry || [];

        const { data: dbStats } = await supabase.from('post_stats').select('*');
        const statsMap = (dbStats || []).reduce((acc, curr) => {
            acc[curr.post_id] = curr;
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
                likes: statsMap[postId]?.likes || 0
            };
        });

        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Increment views
app.post('/api/posts/:id/view', async (req, res) => {
    const postId = req.params.id;
    const { data: existing } = await supabase.from('post_stats').select('views').eq('post_id', postId).single();
    const currentViews = existing ? existing.views + 1 : 1;

    await supabase.from('post_stats').upsert({ post_id: postId, views: currentViews });
    res.json({ success: true, views: currentViews });
});

// Increment likes
app.post('/api/posts/:id/like', async (req, res) => {
    const postId = req.params.id;
    const { data: existing } = await supabase.from('post_stats').select('likes').eq('post_id', postId).single();
    const currentLikes = existing ? existing.likes + 1 : 1;

    await supabase.from('post_stats').upsert({ post_id: postId, likes: currentLikes });
    res.json({ success: true, likes: currentLikes });
});

// Fetch comments
app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, comments });
});

// Submit comment
app.post('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const { userName, commentText } = req.body;

    if (!commentText) return res.status(400).json({ error: 'Comment required' });

    const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_name: userName || 'Reader', comment_text: commentText }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, comment: data[0] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EduByte Server active on port ${PORT}`));