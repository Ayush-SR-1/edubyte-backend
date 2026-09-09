const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

// Trust proxy headers for Render deployment
app.set('trust proxy', true);

// Owner admin secret key
const OWNER_SECRET_KEY = 'ayush-admin-secret'; 

// In-memory posts store
let posts = [
    {
        id: "1",
        title: "AI Myths and Facts: Separating What’s Real from the Hype",
        category: "AI & ML",
        snippet: "From JEE Problems to AI Prompts: An Introduction by Ayush Singh Rathor. Dispelling the biggest misconceptions about AI and differentiating between reality and fiction.",
        content: `
            <p class="text-sm font-mono text-cyan-400 mb-6">--- By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</p>

            <h2>From JEE Problems to AI Prompts: An Introduction</h2>
            <p>Despite taking several years to prepare, I finally succeeded in getting into the engineering branch where I had set my sights. VIT has a CSE program in CSEN, which includes courses in Artificial Intelligence and Machine Learning. Like many other engineering students, I was raised around technology and gadgets, programming especially, but AI always had its own distinct feel to it. The appearance of machines that could think, create, and converse seemed to be from a science fiction perspective.</p>
            
            <p>In the present day, AI is ubiquitous. You can count on it to suggest the next video you watch, navigate traffic properly, filter out spam emails or junk mail, modify photos, write essays, and create art. ChatGPT, machine learning and generative AI have become terms that are used in everyday conversation within a few years.</p>
            
            <p>Despite the excitement, there is a great deal of confusion. However, it is believed by some that AI may soon take over the world. Others believe it's always correct. The general belief is that it can solely be used by individuals in the programming and technology fields. There is a much more captivating and less dramatic reality.</p>
            
            <p>I want to dispel some of the biggest misconceptions about AI and differentiate between reality and fiction in this blog.</p>

            <h2>What Exactly Is AI?</h2>
            <p>Artificial Intelligence, or AI, is a broad term used for computer systems that perform tasks requiring human-like intelligence. These tasks include learning from data, recognising patterns, understanding language, making recommendations, and solving problems.</p>
            <p>AI isn't a new concept. Simple AI has been present in video games, search engines, automated customer service systems, and recommendation systems for decades. Moreover, many advanced AI technologies are still being developed.</p>

            <img src="./Fundamental-concept-of-Ai.png" alt="Fundamental Concepts of AI Mind Map" class="rounded-lg my-6 w-full object-cover max-h-96" />

            <p>Nowadays, when people talk about AI, they tend to make a big deal about it.</p>
            
            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300">
                <strong>Machine Learning (ML):</strong> An area of artificial intelligence where systems learn from data and improve over time rather than following fixed instructions.
            </blockquote>

            <p>Having grasped the basics of AI, let's decipher some familiar myths.</p>

            <h2>Myth #1: AI is set to dominate the world.</h2>
            <p>This is probably the most popular myth, thanks to movies and science fiction stories. The idea of super-intelligent machines controlling humanity sounds exciting, but it is far from reality.</p>
            
            <p>Modern AI systems are engineered to serve specific tasks. A text-generating AI cannot operate a car, bank account, or power grid without human intervention.</p>
            
            <p>AI lacks any specific aims, feelings, goals, or desires. It doesn't “want” anything. The system's functionality is based on its ability to recognise patterns from data and react to the input it receives.</p>

            <img src="./original.webp" alt="Misinformation and Fake News Illustration" class="rounded-lg my-6 w-full object-cover max-h-96" />

            <p>Science-fiction scenarios are not as pressing as issues like misinformation, privacy concerns, algorithmic bias, and excessive reliance on AI systems.</p>

            <p><strong>Fact:</strong> AI is a system that is designed and engineered by humans. People are always responsible for its actions, not machines.</p>

            <h2>Myth #2: Artificial Intelligence Is Always Correct.</h2>
            <p>Many people assume that if an AI can provide a response with confidence, it must be accurate. Unfortunately, that isn't true.</p>
            
            <p>Patterns acquired from vast amounts of text are used in ChatGPT, a language model that predicts the most probable arrangement of words. Unlike humans, they lack the ability to comprehend facts. This leads to the creation of information that appears convincing but is entirely inaccurate. An umbrella term frequently used to describe this phenomenon is <strong>AI hallucination</strong>.</p>

            <img src="./examples-of-ai-hallucination-explained-1536x851.png" alt="Understanding AI Hallucinations Diagram" class="rounded-lg my-6 w-full object-cover max-h-96" />

            <p><strong>The limitations of AI are due to:</strong></p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>Biases or inaccuracies in training data.</li>
                <li>Information becoming outdated over time.</li>
                <li>Persistent challenges in complex logical reasoning.</li>
            </ul>

            <p><strong>Fact:</strong> It is crucial to ensure that you are getting the correct information, particularly in fields like academia, law, healthcare, finance, and research.</p>

            <h2>Myth #3: Only Technologists Are Allowed to Use AI.</h2>
            <p>This myth could not be further from the truth. Modern AI tools are available to anyone—designed to be user-friendly for students, artists, teachers, entrepreneurs, and professionals alike.</p>

            <p><strong>You are already utilizing AI on a daily basis:</strong></p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>Google Maps suggests optimal routes.</li>
                <li>Netflix recommends movies you might like.</li>
                <li>Your phone organizes and tags photos.</li>
                <li>Email services filter out spam automatically.</li>
                <li>Voice assistants answer your everyday questions.</li>
            </ul>

            <p>The majority of widely used AI tools are accessible through simple websites or apps requiring minimal technical expertise. While math, programming, and data science skills are necessary to <em>build</em> AI systems, utilizing them requires no coding at all.</p>

            <img src="./ai-learning-classroom-innovation.jpeg" alt="Students and Teachers Using AI Technology in Classroom" class="rounded-lg my-6 w-full object-cover max-h-96" />

            <p><strong>Fact:</strong> AI can be used effectively without coding knowledge. Asking the right questions (prompt engineering) is crucial.</p>

            <h2>The Bigger Picture</h2>
            <p>There is no magic formula for every problem or threat, and AI is not a machine to be conquered. Education, business, healthcare, entertainment, and daily life are all being transformed by this powerful tool.</p>
            <p>Like any technology, AI has its advantages and disadvantages. Using it responsibly requires understanding both aspects. In my opinion, the study of AI and ML is no longer solely the responsibility of engineers—it is becoming a fundamental capability for everyone.</p>

            <p class="font-semibold text-cyan-300 my-4 text-lg">Until then, stay curious, continue to learn, and remember: AI's objective is to enhance human intelligence, not to replace it.</p>
            <p class="text-sm font-mono text-muted">Thanks for reading! 🚀</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],      
        commentedIPs: [],  
        comments: []
    },
    {
        id: "2",
        title: "Why Does AI \"Lie\"? Understanding Hallucination in Large Language Models",
        category: "AI Ethics",
        snippet: "A confident response that was completely wrong. Exploring why LLMs hallucinate false statistics, papers, and facts, and how to verify AI output.",
        content: `
            <p class="text-sm font-mono text-cyan-400 mb-6">--- By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</p>

            <h2>A confident response that was completely wrong.</h2>
            <p>A few weeks ago, while working on an assignment, I asked an AI chatbot for a reference for a fact I wanted to include. It gave me a neat, official-sounding citation — author name, journal, year, everything. It looked completely legitimate.</p>
            <p>There was just one problem. The paper did not exist.</p>
            <p>It was my initial exposure to the phenomenon referred to as "hallucination" by AI researchers, and when one becomes aware of its presence, it becomes ubiquitous. Why? Experts caution against trusting an AI blindly, despite its odd and misunderstood behaviour in modern AI.</p>

            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80" alt="AI Neural Network Visualizing Data Flow" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <p>On this blog, I am going to elucidate what hallucinations are and why they occur and suggest some strategies for managing them.</p>

            <h2>What Is AI Hallucination?</h2>
            <p>In simple terms, hallucination is when an AI model generates information that sounds correct and confident, but is actually false, made up, or not grounded in reality.</p>
            <p>This could be:</p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>A fake statistic.</li>
                <li>A statement that was never made by anyone.</li>
                <li>A book, case, or research paper that is not available.</li>
                <li>An event that never happened.</li>
                <li>A date, name or fact that was incorrectly stated with absolute confidence.</li>
            </ul>

            <p>The issue at hand is not whether AI causes incorrect behaviour. Humans get things wrong too. It is a complex process that ensures AI conveys the wrong message with precision, accuracy, and sophistication. There's no built-in hesitation in its tone to warn you. Why?</p>

            <h2>Why Does This Happen?</h2>
            <p>To understand hallucination, it helps to remember what a large language model (LLM) is actually doing under the hood. The knowledge acquired through ChatGPT and other models is not comparable to that of a textbook or database. Patterns acquired from vast amounts of text enable them to predict the most probable next word.</p>

            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80" alt="Complex Data Analysis Network" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <p>The model does not need to search a memory bank for the correct answer when you ask if anything is wrong. It's producing a set of words that presents essentially an adequate answer, considering all its previous observations. The outcome is positive.</p>
            <p>Generally speaking, this works exceptionally well because the patterns in correct writing and facts often coincide. The model may fill a gap in its knowledge with an object that does not actually exist but instead conforms to the pattern of resolving the question.</p>

            <p><strong>A few typical causes of a hallucination:</strong></p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li><strong>Gaps in training data:</strong> If the model was never trained on the specific fact, it may generate a plausible-sounding guess instead of admitting it doesn't know.</li>
                <li><strong>No real "understanding":</strong> The model recognises patterns in language, not facts about the world.</li>
                <li><strong>Ambiguous or tricky prompts:</strong> Vague questions can push the model toward invented specifics.</li>
                <li><strong>Pressure to sound complete:</strong> Models are trained to give fluent, confident-sounding responses, not to say "I'm not sure."</li>
            </ul>

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300">
                <strong>Fact:</strong> Hallucination isn't a bug that shows up occasionally by accident — it's a natural side effect of how these models are built to generate language.
            </blockquote>

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300 font-serif text-lg">
                "A model that's guessing well still sounds like a model that knows."
            </blockquote>

            <h2>Myth: Only "Bad" or Older AI Models Hallucinate.</h2>
            <p>It's tempting to think that hallucination is a problem that newer, more advanced models will simply outgrow. Unfortunately, that isn't quite true. Even the most advanced models available today can hallucinate, especially when:</p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>Asked about very recent events.</li>
                <li>Asked for precise numbers, citations, or sources.</li>
                <li>Pushed to answer something outside their training data.</li>
                <li>Asked highly specific or niche questions.</li>
            </ul>

            <p>Newer models have gotten noticeably better at reducing hallucinations, and some tools now cross-check answers using live web search, which helps a lot. But no model, however capable, can guarantee that every single response is 100% factually accurate.</p>

            <p><strong>Fact:</strong> The more specific and detail-heavy a question is, the more important it becomes to verify the answer yourself.</p>

            <h2>Why Does This Matter More Than It Seems?</h2>
            <p>The impact of hallucinations, though minor and insignificant in casual contexts, varies depending on the application of AI:</p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>A fake reference in academia can be deemed plagiarism or misrepresentation.</li>
                <li>A mistake in medical knowledge could pose a genuine risk in healthcare.</li>
                <li>An argument in the courtroom could be derailed by a case that is not present.</li>
                <li>Journalism could be ruined by the use of an invented quote.</li>
            </ul>

            <p>To be precise, AI should only be viewed as a starting point and not an ultimate decision-maker. While an immediate response may be convenient, it still requires a rigorous examination to determine the validity of the answer.</p>

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300 font-serif text-lg">
                "The cost of trusting a wrong answer is always higher than the cost of checking it."
            </blockquote>

            <h2>How can we address this issue?</h2>
            <p>Fortunately, hallucination is not an uncontrolled phenomenon once you realise its presence. Some basic routines can make a big difference:</p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li><strong>Verify any information:</strong> It is advisable to double-check names, dates and statistics along with citations on an individual basis.</li>
                <li><strong>Request sources:</strong> Ask the AI to use sources as input and verify their authenticity.</li>
                <li><strong>Be specific in your prompts:</strong> Uncertain questions necessitate unreliable and sometimes fabricated responses.</li>
                <li><strong>Treat AI as a prototype:</strong> Treat outputs as drafts rather than ultimate answers, especially for academic, professional, or factual purposes.</li>
                <li><strong>Check with a second source:</strong> If something seems strange, double-check it elsewhere before trusting anything.</li>
            </ul>

            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80" alt="Verifying Information Concept Visual" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <p><strong>Fact:</strong> With a healthy dose of doubt, AI becomes an effective tool rather than just posing an evasive danger.</p>

            <h2>The Bigger Picture</h2>
            <p>The occurrence of hallucinations does not indicate that AI is unreliable or compromised. The reminder is that AI is a potent system that matches patterns, not an all-knowing spell. Once you grasp the distinction, it becomes much more effortless to utilise AI responsibly.</p>
            <p>It is not the end of using these tools out of fear. To use them, one must use them in the same manner as any other reliable source, with curiosity and a habit of verifying facts.</p>

            <p>The next blog post will be about the intricacies of generative AI and the distinction between "creative" and "made up".</p>

            <p class="font-semibold text-cyan-300 my-4 text-lg">Until then... stay curious, ask a tough question and remember: An AI that appears confident is not the same as an AI that is right.</p>
            <p class="text-sm font-mono text-muted">Thanks for reading! 🚀</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],
        commentedIPs: [],
        comments: []
    },
    {
        id: "3",
        title: "Can We Trust AI-Generated Information?",
        category: "AI Verification",
        snippet: "Three real-world cautionary tales from courtrooms, search engines, and news publications showing why fluent language is not the same as a true statement.",
        content: `
            <p class="text-sm font-mono text-cyan-400 mb-6">--- By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</p>

            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80" alt="AI Trust Digital Verification" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300 font-serif text-lg">
                "Fluent is not a true statement."
            </blockquote>

            <p>I wrote about AI hallucination in my previous blog — the peculiar behavior of artificial intelligence models making false statements with absolute confidence. I want to push this idea out of the world of theory and into the real world, because the notion that AI can be wrong may appear inconsequential until it occurs without any examination.</p>

            <h2>1. An Attorney with Fake Legal Precedents</h2>
            <p>In 2023, a New York lawyer, Steven Schwartz, used ChatGPT to gather legal precedents for a personal injury case (Mata v. Avianca). The tool provided him with official-sounding citations containing case names, courts, and legal reasoning. When asked directly, the chatbot reassured him that the cases were genuine.</p>
            <p>They were not. Opposing lawyers and the judge found no trace of them. The lawyers involved were ultimately sanctioned and fined for submitting false judicial opinions generated by ChatGPT.</p>

            <h2>2. Search Engines Recommending Glue and Rocks</h2>
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80" alt="Search Engine Error Concept" class="rounded-lg my-6 w-full object-cover max-h-80" />
            <p>When Google unveiled "AI Overviews" to display search summaries at the top of pages, users quickly noticed bizarre results. Within days, screenshots went viral showing the AI suggesting people eat rocks or use non-toxic glue to keep cheese stuck to pizza.</p>

            <h2>3. Newspapers Recommending Books That Don't Exist</h2>
            <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80" alt="Printed Publication and E-Books" class="rounded-lg my-6 w-full object-cover max-h-80" />
            <p>In May 2025, major publications released recommended summer reading lists featuring books attributed to well-known authors. Out of fifteen suggested titles, only five were real books. The rest were completely invented by AI, complete with plausible plot summaries.</p>

            <h2>How Do These Three Stories Compare?</h2>
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80" alt="Graphic Connection Concept Illustration" class="rounded-lg my-6 w-full object-cover max-h-80" />
            <p>An attorney, a search engine, and a newspaper — three distinct fields sharing the exact same vulnerability. These were not intentional deceptions; the models simply produced fluent, authoritative text that matched the shape of a true statement.</p>

            <h2>Can We Rely on AI-Generated Data?</h2>
            <p>The short answer is: <strong>Only partially.</strong></p>
            <p><strong>Key Practical Habits:</strong></p>
            <ul class="list-disc pl-6 mb-4 space-y-1">
                <li>Never submit or publish AI-generated facts without checking independent sources.</li>
                <li>Treat all citations, quotes, and stats as unverified until confirmed.</li>
                <li>A confident demeanour does not equal accuracy.</li>
                <li>Use AI for structure and drafting; use humans or verified databases for hard facts.</li>
            </ul>

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300">
                "The cost of trusting a wrong answer is always greater than the cost to verify it."
            </blockquote>

            <p class="font-semibold text-cyan-300 my-4 text-lg">So, until next time... stay curious, ask questions first, and remember: Just because it sounds good does not mean it is true.</p>
            <p class="text-sm font-mono text-muted">Thanks for reading! 🚀</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],
        commentedIPs: [],
        comments: []
    },
    {
        id: "4",
        title: "Can AI Actually Be Creative?",
        category: "AI & Art",
        snippet: "An unexpected machine is not the same as an unintended machine. Exploring move 37, digital art competitions, and whether statistical probability equals artistic originality.",
        content: `
            <p class="text-sm font-mono text-cyan-400 mb-6">--- By Ayush Singh Rathor, B.Tech CSE (AI & ML), VIT</p>

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300 font-serif text-lg">
                "An unexpected machine is not the same as an unintended machine."
            </blockquote>

            <p>While discussing trusting AI in my previous blog, I was left perplexed by whether AI is truly innovative or simply repeating existing information.</p>

            <h2>1. Typing Words in a Box</h2>
            <p>In 2022, Jason Allen entered the Colorado State Fair's digital arts competition with his piece <em>"Théâtre D'opéra Spatial."</em> He created it using Midjourney with roughly 624 text prompts. And it won first place.</p>
            <img src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80" alt="AI-Generated Digital Artwork" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <h2>2. The Infamous Move 37</h2>
            <p>In 2016, DeepMind's AlphaGo played against world champion Lee Sedol in Go and executed Move 37—a move no professional human player would have ever made. It turned out to be a brilliant, winning move generated by analyzing millions of self-played games.</p>
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80" alt="Abstract Neural Network Pattern Art" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <h2>The Tension Between Purpose and Pattern</h2>
            <p>Allen's artwork appeared imaginative due to human vision and prompts, but the model relied on statistical patterns. AlphaGo's Move 37 was genuinely innovative, but possessed no human intention behind it.</p>
            <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80" alt="Artist Painting Studio Creative Process" class="rounded-lg my-6 w-full object-cover max-h-80" />

            <blockquote class="border-l-4 border-cyan-500 pl-4 italic my-6 text-slate-300">
                "The process of developing a machine is effortless. Our job is still to add meaning."
            </blockquote>

            <h2>Human and AI Collaboration</h2>
            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80" alt="Human and AI Working Together" class="rounded-lg my-6 w-full object-cover max-h-80" />
            <p>If we are to appreciate AI's role in creativity, we must decide how much we want technology to contribute to our creative processes while keeping human purpose at the core.</p>

            <p class="font-semibold text-cyan-300 my-4 text-lg">Until next time, keep exploring, persist in creating new things, and remember: The image can be generated by the machine, but you must still decide if it matters.</p>
            <p class="text-sm font-mono text-muted">Thanks for reading! 🚀</p>
        `,
        likes: 0,
        views: 0,
        likedIPs: [],
        commentedIPs: [],
        comments: []
    }
];

// Helper functions
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress;
}

function isOwner(req) {
    return req.headers['x-owner-key'] === OWNER_SECRET_KEY;
}

// Routes

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));