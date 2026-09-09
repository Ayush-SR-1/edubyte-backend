const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable missing!");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// Mongoose Schema
const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [{
    id: String,
    author: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Post = mongoose.model('Post', postSchema);

// Initial Seed Data
const seedPosts = [
  {
    id: "post-1",
    title: "Getting Started with Web Development",
    summary: "Learn the fundamentals of modern full-stack development.",
    views: 0,
    likes: 0,
    comments: []
  },
  {
    id: "post-2",
    title: "Mastering Node.js and Express",
    summary: "Build fast, scalable backend services with JavaScript.",
    views: 0,
    likes: 0,
    comments: []
  },
  {
    id: "post-3",
    title: "Database Persistence with MongoDB",
    summary: "How to store and query operational data reliably.",
    views: 0,
    likes: 0,
    comments: []
  },
  {
    id: "post-4",
    title: "Deploying Web Apps to Render",
    summary: "Step-by-step production setup for backend microservices.",
    views: 0,
    likes: 0,
    comments: []
  }
];

// Routes

// 1. Seed Endpoint
app.get('/api/seed', async (req, res) => {
  try {
    await Post.deleteMany({});
    await Post.insertMany(seedPosts);
    res.json({ success: true, message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Seeding failed", details: err.message });
  }
});

// 2. Fetch All Posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// 3. Increment Views & Get Single Post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// 4. Increment Likes
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update like count" });
  }
});

// 5. Add Comment
app.post('/api/posts/:id/comments', async (req, res) => {
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text is required" });

  const comment = {
    id: `c-${Date.now()}`,
    author: author || 'Anonymous',
    text,
    createdAt: new Date()
  };

  try {
    const post = await Post.findOneAndUpdate(
      { id: req.params.id },
      { $push: { comments: comment } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));