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

// Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, excerpt, content, author, category, readTime, date } = req.body;
    const newPost = new Post({
      title,
      excerpt,
      content,
      author,
      category,
      readTime,
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
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

// Seed Endpoint to insert the article with embedded Cloudinary images
app.get('/api/seed', async (req, res) => {
  try {
    await Post.deleteMany({});
    await Post.insertMany([
      {
        title: "AI Myths and Facts: Separating What’s Real from the Hype",
        excerpt: "From JEE preparation to AI prompts, exploring the reality of Artificial Intelligence behind the sci-fi tropes, hallucinations, and mainstream hype.",
        content: `<p><b>By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</b></p>
        <h3>From JEE Problems to AI Prompts: An Introduction</h3>
        <p>Despite taking several years to prepare, I finally succeeded in getting into the engineering branch where I had set my sights. VIT has a CSE program in CSEN, which includes courses in Artificial Intelligence and Machine Learning. Like many other engineering students, I was raised around technology and gadgets, programming especially, but AI always had its own distinct feel to it. The appearance of machines that could think, create, and converse seemed to be from a science fiction perspective.</p>
        <p>In the present day, AI is ubiquitous. You can count on it to suggest the next video you watch, navigate traffic properly, filter out spam emails or junk mail, modify photos, write essays, and create art. ChatGPT, machine learning and generative AI have become terms that are used in everyday conversation within a few years.</p>
        <p>Despite the excitement, there is a great deal of confusion. However, it is believed by some that AI may soon take over the world. Others believe it's always correct. The general belief is that it can solely be used by individuals in the programming and technology fields. There is a much more captivating and less dramatic reality.</p>
        <p>I want to dispel some of the biggest misconceptions about AI and differentiate between reality and fiction in this blog.</p>
        <h3>What Exactly Is AI?</h3>
        <p>Artificial Intelligence, or AI, is a broad term used for computer systems that perform tasks requiring human-like intelligence. These tasks include learning from data, recognising patterns, understanding language, making recommendations, and solving problems.</p>
        <p>AI isn't a new concept. Simple AI has been present in video games, search engines, automated customer service systems, and recommendation systems for decades. Moreover, many advanced AI technologies are still being developed.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788944842/Fundamental-concept-of-Ai.png" alt="Fundamental Concept of AI" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>Nowadays, when people talk about AI, they tend to make a big deal about it. <b>Machine Learning (ML):</b> An area of artificial intelligence where systems learn from data and improve over time rather than following fixed instructions.</p>
        <p>Having grasped the basics of AI, let's decipher some familiar myths.</p>
        <h3>Myth #1: AI is set to dominate the world.</h3>
        <p>This is probably the most popular myth, thanks to movies and science fiction stories. The idea of super-intelligent machines controlling humanity sounds exciting, but it is far from reality. Modern AI systems are engineered to serve a purpose for specific tasks. A text-generating AI cannot operate a car, bank account, or power grids without human intervention.</p>
        <p>AI lacks any specific aims, feelings, goals, or desires. It doesn't “want” anything. The system's functionality is based on its ability to recognise patterns from data and react to the input it receives.</p>
        <p>This isn't a takeover by AI; it's just about solving the real problem.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788944905/original.webp" alt="AI Takeover Myth" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>Science-fiction scenarios are not as important as issues of misinformation, privacy, bias in algorithms, and excessive reliance on AI. <b>Fact:</b> AI is a system that is designed and engineered by humans. People are always responsible for its actions, not machines.</p>
        <h3>Myth #2: Artificial Intelligence Is Always Correct.</h3>
        <p>Many people assume that if an AI can provide a response with confidence, it must be accurate. Unfortunately, that isn't true.</p>
        <p>Patterns acquired from vast amounts of text are used in ChatGPT, a language model that predicts the most probable arrangement of words. Unlike humans, they lack the ability to comprehend facts.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788944905/examples-of-ai-hallucination-explained-1536x851.png" alt="AI Hallucination" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>This leads to the creation of information that appears convincing but is entirely inaccurate, generated by AI. False dates, references to other sources, or inaccurate explanations may be generated by it. An umbrella term is frequently used to describe this phenomenon: <b>AI hallucination</b>.</p>
        <p>The limitations of AI are due to biases or inaccuracies in training data, outdated information, or complex reasoning challenges. <b>Fact:</b> It is crucial to ensure that you are getting the correct information, particularly in fields like academia, law, healthcare, finance, and research.</p>
        <h3>Myth #3: Only technologists are allowed to use AI.</h3>
        <p>This myth could not be further from the truth. AI tools of today are available to anyone—students, artists, teachers, entrepreneurs, and professionals. You are capable of using AI by typing a question in everyday language.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788944775/ai-learning-classroom-innovation.jpg" alt="AI Tools Accessibility" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>You are already utilising AI on a daily basis: Google Maps suggests routes, Netflix recommends movies, your phone organises photos, email filters spam, and voice assistants answer questions. <b>Fact:</b> AI can be used effectively without coding knowledge. Asking the right questions is crucial.</p>
        <h3>The Bigger Picture</h3>
        <p>There is no magic formula for every problem or threat, and AI is not a machine to be conquered. Education, business, healthcare, entertainment, and daily life are all being transformed by this powerful tool. The study of AI and ML is no longer solely the responsibility of engineers; this is becoming a fundamental ability for all.</p>
        <p>We are only now entering the realm of AI. Until then, stay curious, continue to learn, and remember: <b>AI's objective is to enhance human intelligence, not to replace it.</b> Thanks for reading! 🚀</p>`,
        author: "Ayush Singh Rathor",
        category: "AI & ML",
        readTime: "6 min read",
        date: "Sep 9, 2026",
        views: 0,
        likes: 0,
        comments: []
      }
    ]);
    res.json({ success: true, message: "Database seeded successfully with AI Myths article!" });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});