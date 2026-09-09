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

// Seed Endpoint containing both posts (with automatic index cleanup)
app.get('/api/seed', async (req, res) => {
  try {
    // Drop the conflicting 'id_1' index if it exists in MongoDB
    try {
      await Post.collection.dropIndex('id_1');
      console.log('Dropped stale id_1 index from MongoDB');
    } catch (indexErr) {
      // Ignore error if index doesn't exist
    }

    // Clear existing documents
    await Post.deleteMany({});

    // Insert both posts with full HTML content & Cloudinary images
    await Post.insertMany([
      {
        title: "Why Does AI \"Lie\"? Understanding Hallucination in Large Language Models",
        excerpt: "An exploration into why confident AI models generate false citations, made-up facts, and plausible-sounding errors—and how to handle them.",
        content: `<p><b>By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</b></p>
        <h3>A confident response that was completely wrong.</h3>
        <p>A few weeks ago, while working on an assignment, I asked an AI chatbot for a reference for a fact I wanted to include. It gave me a neat, official-sounding citation — author name, journal, year, everything. It looked completely legitimate. There was just one problem. The paper did not exist.</p>
        <p>It was my initial exposure to the phenomenon referred to as "hallucination" by AI researchers, and when one becomes aware of its presence, it becomes ubiquitous. Why? Experts caution against trusting an AI blindly, despite its odd and misunderstood behaviour in modern AI.</p>
        <p>On this blog, I am going to elucidate what hallucinations are and why they occur and suggest some strategies for managing them.</p>
        <h3>What Is AI Hallucination?</h3>
        <p>In simple terms, hallucination is when an AI model generates information that sounds correct and confident, but is actually false, made up, or not grounded in reality.</p>
        <p>This could be:</p>
        <ul>
          <li>• A fake statistic.</li>
          <li>• A statement that was never made by anyone.</li>
          <li>• A book, case, or research paper that is not available.</li>
          <li>• An event that never happened.</li>
          <li>• A date, name or fact that was incorrectly stated with absolute confidence.</li>
        </ul>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788945403/deep-learning-illustration-generative-ai-scaled.jpg" alt="Deep Learning & AI Hallucinations" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>The issue at hand is not whether AI causes incorrect behaviour. Humans get things wrong too. It is a complex process that ensures AI conveys the wrong message with precision, accuracy, and sophistication. There's no built-in hesitation in its tone to warn you.</p>
        <h3>Why Does This Happen?</h3>
        <p>To understand hallucination, it helps to remember what a large language model (LLM) is actually doing under the hood. The knowledge acquired through ChatGPT and other models is not comparable to that of a textbook or database. Patterns acquired from vast amounts of text enable them to predict the most probable next word.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788968543/images.jpg" alt="Predicting Next Word in LLM" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>The model does not need to search a memory bank for the correct answer when you ask if anything is wrong. It's producing a set of words that presents essentially an adequate answer, considering all its previous observations. Generally speaking, this works exceptionally well because the patterns in correct writing and facts often coincide. The model may fill a gap in its knowledge with an object that does not actually exist but instead conforms to the pattern of resolving the question.</p>
        <p><b>A few typical causes of a hallucination:</b></p>
        <ul>
          <li><b>Gaps in training data:</b> If the model was never trained on the specific fact, it may generate a plausible-sounding guess instead of admitting it doesn't know.</li>
          <li><b>No real "understanding":</b> The model recognises patterns in language, not facts about the world.</li>
          <li><b>Ambiguous or tricky prompts:</b> Vague questions can push the model toward invented specifics.</li>
          <li><b>Pressure to sound complete:</b> Models are trained to give fluent, confident-sounding responses, not to say "I'm not sure."</li>
        </ul>
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; italic; color: #cbd5e1;">"A model that's guessing well still sounds like a model that knows."</blockquote>
        <p><b>Fact:</b> Hallucination isn't a bug that shows up occasionally by accident — it's a natural side effect of how these models are built to generate language.</p>
        <h3>Myth: Only "Bad" or Older AI Models Hallucinate.</h3>
        <p>It's tempting to think that hallucination is a problem that newer, more advanced models will simply outgrow. Unfortunately, that isn't quite true. Even the most advanced models available today can hallucinate, especially when:</p>
        <ul>
          <li>• Asked about very recent events.</li>
          <li>• Asked for precise numbers, citations, or sources.</li>
          <li>• Pushed to answer something outside their training data.</li>
          <li>• Asked highly specific or niche questions.</li>
        </ul>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788945403/glm-4-7-ai-model.jpg" alt="Advanced AI Model Architecture" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>Newer models have gotten noticeably better at reducing hallucinations, and some tools now cross-check answers using live web search, which helps a lot. But no model, however capable, can guarantee that every single response is 100% factually accurate.</p>
        <p><b>Fact:</b> The more specific and detail-heavy a question is, the more important it becomes to verify the answer yourself.</p>
        <h3>Why Does This Matter More Than It Seems?</h3>
        <p>The impact of hallucinations, though minor and insignificant in casual chats, varies depending on the application of AI:</p>
        <ul>
          <li>• A fake reference in academia can be deemed plagiarism or misrepresentation.</li>
          <li>• A mistake in medical knowledge could pose a genuine risk in healthcare.</li>
          <li>• An argument in the courtroom could be derailed by a case that is not present.</li>
          <li>• Journalism could be ruined by the use of an invented quote.</li>
        </ul>
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; italic; color: #cbd5e1;">"The cost of trusting a wrong answer is always higher than the cost of checking it."</blockquote>
        <h3>How can we address this issue?</h3>
        <p>Fortunately, hallucination is not an uncontrolled phenomenon once you realise its presence. Some basic routines can make a big difference:</p>
        <ul>
          <li>• <b>Verify any information:</b> Double-check names, dates, statistics, and citations.</li>
          <li>• <b>Request sources:</b> Ask the AI to use provided sources as input and verify their authenticity.</li>
          <li>• <b>Be specific in your prompts:</b> Uncertain questions necessitate unreliable responses.</li>
          <li>• <b>Treat AI as a prototype:</b> Use it as a starting draft, not an ultimate answer.</li>
          <li>• <b>Check with a second source:</b> If something seems strange, double-check it elsewhere.</li>
        </ul>
        <h3>The Bigger Picture</h3>
        <p>The occurrence of hallucinations does not indicate that AI is unreliable or compromised. The reminder is that AI is a potent system that matches patterns, not an all-knowing spell. Once you grasp the distinction, it becomes much more effortless to utilise AI responsibly.</p>
        <p>It is not the end of using these tools out of fear. To use them, one must use them in the same manner as any other reliable source, with curiosity and a habit of verifying facts.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788945404/AI-hallucinations-featuring-a-humanoid-AI-figure-with-a-fragmented-face-where-parts-dissolve-into-swirling-streams-of.webp" alt="Humanoid AI Fragmented Face Hallucination" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        <p>The next blog post will be about the intricacies of generative AI and the distinction between "creative" and "made up". Stay curious, ask a tough question and remember:</p>
        <p><b>An AI that appears confident is not the same as an AI that is right.</b></p>
        <p>Thanks for reading! 🚀</p>`,
        author: "Ayush Singh Rathor",
        category: "AI & ML",
        readTime: "7 min read",
        date: "Sep 10, 2026",
        views: 0,
        likes: 0,
        comments: []
      },
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

    res.json({ success: true, message: "Database seeded successfully with both articles!" });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});