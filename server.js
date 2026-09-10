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

// Seed Endpoint containing all 4 posts (with index cleanup)
app.get('/api/seed', async (req, res) => {
  try {
    // Drop conflicting 'id_1' index if it exists in MongoDB Atlas
    try {
      await Post.collection.dropIndex('id_1');
      console.log('Dropped stale id_1 index from MongoDB');
    } catch (indexErr) {
      // Ignore if index doesn't exist
    }

    // Clear existing documents
    await Post.deleteMany({});

    // Insert all four posts
    await Post.insertMany([
      {
        title: "Can AI Actually Be Creative?",
        excerpt: "Exploring the tension between human intention and algorithmic innovation through the stories of Théâtre D'opéra Spatial and AlphaGo's Move 37.",
        content: `<p><b>By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</b></p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946847/gettyimages-2211086269-612x612.jpg" alt="AI and Human Creativity Concept" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"An unexpected machine is not the same as an unintended machine."</blockquote>
        
        <p>While discussing trusting AI in my previous blog, I was left perplexed by whether AI is truly innovative or simply repeating existing information. This leads me to wonder. I want to approach this issue in a way that mirrors the emotional turmoil of spending many hours debating with Nanny before meeting anyone.</p>
        <p>As a first, let me tell you: 'I think many of you have seen this painting and maybe not even seen it'.</p>
        <p>In 2022, Jason Allen from Colorado participated in the Colorado State Fair's digital arts competition by submitting his work "Théâtre D'opéra Spatial." A grand hall is adorned with statues, each depicting a classical figure gazing through alternating windows at luminous, dreamy scenery. It appears that the painting took place over a prolonged period. Despite the challenges, he managed to complete his task with Midjourney, typing and editing around 624 prompts until achieving his desired outcome. And it won first place. Artists were furious. After years of practising brushwork, you can picture yourself winning by typing words in a box.</p>
        
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946848/images_1.jpg" alt="Théâtre D'opéra Spatial Midjourney Painting" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>Here is where things become interesting. The U.S. Copyright Office refused to protect the image and declared that it was not "authorship by humans" in legal terms. Since then, Allen has been insisting, maintaining that typing 624 carefully thought-out prompts is no different from a photographer choosing an angle. However, the Copyright Office is not so convinced. That battle is currently being heard in the federal court system.</p>
        <p>Even the artists who were furious did not consider themselves to be bad because of the image. Nobody argued that. Can typing words in a box be considered making something, as the real argument was? That's a tough question to answer, right?</p>
        
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946848/images_2.jpg" alt="Human vs Machine Creation Debate" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <h3>AlphaGo and Move 37</h3>
        <p>Allow me to move on to a completely different tale. In 2016, DeepMind's AlphaGo played the world's best Go player, Lee Sedol. The second game saw AlphaGo take on a new challenge, one where the professional side would never venture. Breaks the centuries-old tradition of defining strong positions. According to the commentators, it's a glitch. After fifteen minutes, Lee Sedol leaves the room. Why?</p>
        <p>As expected, it was not a mistake. Even though people are still studying it, the decision to adopt Move 37 was remarkable. Winning strategy. By playing games against itself for the millions of hours it took AlphaGo to reach its goal, learning which patterns were most effective and applied an application that was previously unknown to anyone. The concept of elegance is not understood by it. No idea surprised anyone. Simply applying mathematical principles to achieve a better outcome resulted in redefining the way humans engage in an ancient game.</p>
        
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946848/gettyimages-1021985274-612x612.jpg" alt="Abstract Neural Network Pattern Art" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <h3>Tension Between Intent and Pattern</h3>
        <p>Do you perceive tension in this situation? The reason why this question is so difficult to answer is that these two stories are moving in opposite directions. Allen's artwork appears imaginative because of the numerous prompts, thoughtful choices, and a specific vision he was striving for. This is an artistic expression that captures his sense of purpose. Instead of imagining "Victorian dress" or "space opera," the model relies on statistical patterns from millions of images. The creative move by AlphaGo was a result of its truly innovative and valuable concept, but there was no purpose behind it. Having intention does not guarantee originality within the machine. One has a radical idea but no intention.</p>
        <p>Those two poles are where AI-generated art, writing, and music can be found. A model learns the underlying patterns and combines them in ways that are unfamiliar to us after training on millions of samples. That is genuinely useful. Sometimes it's genuinely beautiful. A human artist would not have chosen precisely the same colour if they were trying to find a certain memory or emotion. Why? But the AI has no choice. It has a probability distribution.</p>
        
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946847/gettyimages-1366124869-612x612.jpg" alt="Artist Painting Studio Creative Process" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <h3>Is Originality Possible?</h3>
        <p>Is it possible for AI to possess originality? Honestly, it depends on the area of creativity you are asking about. Move 37 is a clear demonstration of the importance of creating something new and valuable that was not possible before. The intention behind the work is not present in any existing objects, but rather in an inner reason or purpose. This is a subjective statement. When an AI painting is created, the human artist is genuinely creating the message by typing the instructions. The model's the brush. A very capable brush. Still a brush.</p>
        
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"The process of developing a machine is effortless. Our job is still to add meaning."</blockquote>
        
        <p>If we are to truly appreciate the creativity of AI, it is perhaps best to prioritise how much we want that technology to contribute to our own processes. Midjourney provided the vision, but Allen continued to have it. The crucial point is to be truthful about where our creative decisions terminate, and the model's pattern-matching begins.</p>
        
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946848/images_4.jpg" alt="Human and AI Working Together Collaboration" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <h3>The Bigger Picture</h3>
        <p>During the next discussion, I'd like to explore whether using AI for homework is actually improving our intelligence or simply making us more insecure.</p>
        <p>Until that moment, keep exploring, persist in creating new things, and remember:</p>
        <p><b>The image can be generated by the machine. You must still decide if it's important.</b></p>
        <p>Thanks for reading! 🚀</p>`,
        author: "Ayush Singh Rathor",
        category: "AI & ML",
        readTime: "7 min read",
        date: "Sep 6, 2026",
        views: 0,
        likes: 0,
        comments: []
      },
      {
        title: "Can We Trust AI-Generated Information?",
        excerpt: "From courtroom errors to invented book lists and Google AI Overviews, exploring real-world case studies of why confident AI fluency isn't the same as truth.",
        content: `<p><b>By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</b></p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946158/image_5b8374ed.jpg" alt="Trust in AI Verification" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>The concept of AI trust digital verification utilises a checkmark/question-mark combination with digital elements to visually connect.</p>
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"Fluent is not a true statement."</blockquote>
        <p>The three authentic narratives that tackle this challenge in a way that surpasses any other interpretation.</p>
        <p>I wrote about AI hallucination in my previous blog, which is the peculiar customary behaviour of artificial intelligence models that involves making false statements with absolute confidence. I aim to push the idea out of the world of theory and into the real world, as the notion that AI can be wrong may appear inconsequential until it is proven accurate without any examination.</p>
        
        <h3>Three Real-World Case Studies</h3>
        <p>I want to start with three stories instead of a definition. What are they? Using ChatGPT, an Attorney with a Court Case Provided Me With Them. The example of a legal case can be found in the law court gavel document.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946157/ChatGPT-Image-Dec-3-2025-06_40_26-PM.png.webp" alt="Legal Case Gavel Document" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>A New York lawyer, Steven Schwartz, utilised ChatGPT to gather legal precedent for a personal injury case, Mata v. Avianca, in 2023. The device provided him with entirely genuine case citations that contained the cases' names, courts, and legal reasoning. When he asked ChatGPT directly about the cases, the chatbot provided him with an assurance that they were genuine.</p>
        <p>They weren't. The lawyers who tried to find the cases did not discover any. In addition, the lawyers were fined for creating false judicial opinions with fake quotes and citations generated by ChatGPT, according to one of the federal judges in charge of overseeing the case.</p>
        <p>This story is worth knowing for more than just a mistake. It should be noted that this was not an isolated incident. The latest information reveals that there are roughly 900 individuals in question. From 2023 onwards, US courts have documented AI hallucinations, and in 2026, a federal judge punished two lawyers for submitting false references and phoney quotes in one case, which resulted in the most significant penalty for AI law violations. It's a regular occurrence in courtrooms, not an uncommon anomaly. Confidentiality and genuine citations are not the same, and the gap can be quite costly in professional fields.</p>
        
        <h3>When Google's AI Advised People to Eat Rocks</h3>
        <p>During the time when Google's AI advised people to eat rocks, this search-related AI error problem is depicted in this picture — Search engine error concept.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788970025/images.jpg" alt="Search Engine AI Error Concept" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>Google unveiled "AI Overviews" in May 2024, which offers a feature to display search results at the top of the page using artificial intelligence. The tool's witty suggestions, which included the suggestion of eating rocks and using glue to stick cheese on pizza, were shared online within days.</p>
        <p>The advice given for rock music was based on a humorous post, and the idea for glue was inspired by an old Reddit thread that suggested using non-toxic glue in pizza sauce. The AI did not recognise the jokes as such, but rather adopted the form of frank, authoritative language and repeated it as if it were real-life advice.</p>
        <p>Google's director of search admitted the results emphasised areas that the tool should be working on to improve, such as handling silly questions and parodies. An AI model is incapable of distinguishing between a joke and believable facts, instead recognising patterns in the way confident words are written.</p>
        
        <h3>A Publication That Suggested Books That Were Not Available...</h3>
        <p>A publication that suggested books that were not available....</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946158/download.jpg" alt="Press Books Printing Publication" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>The publishing example is a good fit for the publication being printed using press books.</p>
        <p>The Chicago Sun-Times and the Philadelphia Inquirer both released a suggested summer reading list in May 2025, featuring books by established, authentic authors. Despite the recommendation of fifteen books, only five were genuine, which was problematic. The rest were AI-generated masterpieces, containing plausible plot summaries, that were attributed to authors who had never written them.</p>
        <p>The freelance writer who was in charge of the list admitted to using AI and not verifying its content before submitting it. This was unacceptable to the newspaper, which immediately launched an inquiry into how it got printed there.</p>
        <p>The significance of this story lies in the fact that unlike a search engine or courtroom, it was primarily derived from e-books, which many readers believe had some sort of editorial process before being published. Publishers may overlook AI-generated content that appears polished and professionally written, but is actually entirely artificial.</p>
        
        <h3>How Do These Three Stories Compare to Each Other?</h3>
        <p>"Graphic connection concept illustration" This image shows how the three examples are related visually.</p>
        <p><img src="https://res.cloudinary.com/dbef59ec/image/upload/v1788946157/download_1.jpg" alt="Graphic Connection Concept Illustration" style="width:100%; max-width:700px; margin: 20px 0; border-radius: 8px;" /></p>
        
        <p>An attorney, a search engine, and a newspaper. The reason for trusting AI-generated content in the same way as trusting a verified source is evident in three distinct fields, but not related to it.</p>
        <p>These are not intentional AI actions, which implies that they are unintentional. The model produced fluent, confident-sounding content that matched the shape of an accurate answer in each case without being true. It was not the kind of person who fell into that trap, as an experienced lawyer, a large tech firm and even an established newspaper would. It is easy to trust something more when it appears more official, such as a citation, summary or printed list, and AI has the ability to create that impression with great accuracy.</p>
        
        <h3>Can We Rely on AI-Generated Data?</h3>
        <p>The concept of checking checklists and verifying steps is reinforced in the practical habits section.</p>
        <p>It is only with some effort that we can say honestly: partially.</p>
        <p>The use of AI can aid in writing, summarising, brainstorming, and attempting to make sense of a topic. The final word on facts, particularly specific ones like names, numbers, quotes, citations, and sources, is its weakest point.</p>
        <p><b>A few habits that could have prevented the collapse of the three stories above:</b></p>
        <ul>
          <li>• Never submit or publish AI-generated facts without verifying them against an independent source.</li>
          <li>• Citations, quotes and statistics should be treated as unverified until confirmed, even if the AI itself confirms them.</li>
          <li>• Be aware that a confident demeanour is not indicative of accuracy.</li>
          <li>• Despite its intended message, AI does not appear uncertain.</li>
          <li>• The use of AI for structure and drafting, while humans or verified databases are used for facts.</li>
        </ul>
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"The cost of trusting a wrong answer is always greater than the cost to verify it."</blockquote>
        
        <h3>The Bigger Picture</h3>
        <p>The use of AI tools is still prevalent among all three involved organisations, not just those stories. They serve as reminders that AI-generated information is not classified as confirmed, even if it reads similarly.</p>
        <p>Its voice will not be hesitant due to the technology. Those responsible for reading, publishing, and citing its output are still under our responsibility.</p>
        <p>Next month, I intend to examine the boundary between AI's ability to create original content and its tendency to repeat outdated patterns.</p>
        <p>So, until then... stay curious and ask questions first... And remember:</p>
        <p><b>Just because it sounds good does not mean it is.</b></p>
        <p>Thanks for reading! 🚀</p>`,
        author: "Ayush Singh Rathor",
        category: "AI & ML",
        readTime: "8 min read",
        date: "Sep 2, 2026",
        views: 0,
        likes: 0,
        comments: []
      },
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
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"A model that's guessing well still sounds like a model that knows."</blockquote>
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
        <blockquote style="border-left: 4px solid #06b6d4; padding-left: 12px; margin: 16px 0; font-style: italic; color: #cbd5e1;">"The cost of trusting a wrong answer is always higher than the cost of checking it."</blockquote>
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
        readTime: "8 min read",
        date: "Aug 30, 2026",
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
        readTime: "7 min read",
        date: "Aug 27, 2026",
        views: 0,
        likes: 0,
        comments: []
      }
    ]);

    res.json({ success: true, message: "Database seeded successfully with all 4 articles!" });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed", details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});