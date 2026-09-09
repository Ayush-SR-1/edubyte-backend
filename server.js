const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schemas & Models
const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  date: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [commentSchema]
});

const Post = mongoose.model('Post', postSchema);

// API Routes

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post and increment view count
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Increment likes for a post
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Add a comment to a post
app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ error: 'Author and content are required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ author, content });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

/* 
  ===================================================================
  SEED ROUTE (DISABLED FOR PRODUCTION SECURITY)
  Uncomment only if you need to reset/re-seed your database in future.
  ===================================================================
  
  app.get('/api/seed', async (req, res) => {
    try {
      await Post.deleteMany({});
      await Post.insertMany([
        {
          title: "Getting Started with Node.js and Express",
          excerpt: "Learn how to build scalable backends using Node.js, Express, and modern JavaScript practices.",
          content: "Node.js has revolutionized web development by allowing developers to run JavaScript on the server side...",
          author: "Ayush Singh",
          category: "Backend",
          readTime: "5 min read",
          date: "Sep 9, 2026",
          views: 120,
          likes: 15,
          comments: [
            { author: "Alex", content: "Great article! Very clear explanation." }
          ]
        },
        {
          title: "Mastering MongoDB Atlas & Mongoose Integration",
          excerpt: "A complete guide to connecting your Node backend to a managed MongoDB Atlas database in the cloud.",
          content: "Database persistence is essential for modern web applications. MongoDB Atlas makes deployment seamless...",
          author: "Ayush Singh",
          category: "Database",
          readTime: "7 min read",
          date: "Sep 9, 2026",
          views: 85,
          likes: 22,
          comments: []
        }
      ]);
      res.json({ success: true, message: "Database seeded successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Seeding failed", details: error.message });
    }
  });
*/

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});