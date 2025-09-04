export type ForumReply = {
  id: string;
  author: string;
  message: string;
  createdAt: number;
};

export type ForumTopic = {
  id: string;
  title: string;
  category: string;
  author: string;
  message: string;
  createdAt: number;
  updatedAt: number;
  views: number;
  replies: ForumReply[];
};

const STORAGE_KEY = "forum_topics";

function generateId(): string {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch {}
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadTopics(): ForumTopic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ForumTopic[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTopics(topics: ForumTopic[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
}

export function getAllTopics(): ForumTopic[] {
  ensureSeeded();
  ensureMinimumPerCategory(4);
  maybeRandomActivity();
  return loadTopics().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getTopicById(id: string): ForumTopic | undefined {
  return loadTopics().find((t) => t.id === id);
}

export function createTopic(input: Omit<ForumTopic, "id" | "createdAt" | "updatedAt" | "views" | "replies">): ForumTopic {
  const now = Date.now();
  const topic: ForumTopic = {
    id: generateId(),
    title: input.title,
    category: input.category,
    author: input.author,
    message: input.message,
    createdAt: now,
    updatedAt: now,
    views: 0,
    replies: [],
  };
  const all = loadTopics();
  all.push(topic);
  saveTopics(all);
  return topic;
}

export function addReply(topicId: string, reply: Omit<ForumReply, "id" | "createdAt">): ForumTopic | undefined {
  const all = loadTopics();
  const idx = all.findIndex((t) => t.id === topicId);
  if (idx === -1) return undefined;
  const now = Date.now();
  const fullReply: ForumReply = { id: generateId(), createdAt: now, ...reply };
  const updated: ForumTopic = {
    ...all[idx],
    replies: [...all[idx].replies, fullReply],
    updatedAt: now,
  };
  all[idx] = updated;
  saveTopics(all);
  return updated;
}

export function incrementViews(topicId: string): ForumTopic | undefined {
  const all = loadTopics();
  const idx = all.findIndex((t) => t.id === topicId);
  if (idx === -1) return undefined;
  const updated: ForumTopic = { ...all[idx], views: all[idx].views + 1 };
  all[idx] = updated;
  saveTopics(all);
  return updated;
}

export function relativeTime(from: number, to: number = Date.now()): string {
  const seconds = Math.max(1, Math.floor((to - from) / 1000));
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
  ];
  let count = seconds;
  let unit = "second";
  for (let i = 0; i < units.length && count >= units[i][0]; i++) {
    count = Math.floor(count / units[i][0]);
    unit = units[i][1];
  }
  if (unit === "second" && seconds >= 31536000) {
    const years = Math.floor(seconds / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
  return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
}

// Demo data seeding to make the forum feel alive on first load
function ensureSeeded() {
  const existing = loadTopics();
  if (existing.length > 0) return;

  const now = Date.now();
  const categories = [
    "Announcements",
    "Farm Questions",
    "Pests and Problems",
    "Farm Showcase",
    "Farm Guides",
    "Team up",
    "News and Views",
    "Product Support",
    "Ads and Offers",
    "Price",
    "Tech",
    "Resources",
    "Products",
  ];
  const authors = [
    "Ravi (Maharashtra)",
    "Anita (Punjab)",
    "Kiran (Karnataka)",
    "Meera (UP)",
    "Suresh (TN)",
    "Pooja (MP)",
  ];
  const seedTitles = [
    "Best price for onion this week?",
    "Low-cost drip irrigation tips",
    "Organic pest control for tomato leaf miner",
    "Share your cotton yield numbers",
    "Looking for tractor rental in village",
    "Weather-based sowing suggestions",
    "Soil testing kits – which one to buy?",
  ];
  const seedMessages = [
    "What rates are you getting in the local mandi? Any contacts?",
    "I built a DIY setup with 16mm laterals. Sharing my learnings.",
    "Neem + sticky traps helped me, but open to better ideas.",
    "Posting my data and asking how to improve next season.",
    "If anyone has reliable contacts, please share numbers.",
    "Monsoon is late here, should I delay by a week?",
    "Confused between two brands, need reviews from real users.",
  ];
  const replySnippets = [
    "We got slightly better price yesterday; wait a day.",
    "Try spacing emitters at 30cm for sandy soil.",
    "Use pheromone traps, they helped control the population.",
    "Great insights, thanks for sharing numbers.",
    "I can DM you a contact who is reliable.",
    "Check IMD forecast; a small delay may help.",
  ];

  const randomOf = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const seeded: ForumTopic[] = [];
  // Add 4-5 topics for EACH category, so every section looks active
  categories.forEach((cat) => {
    if (cat === "All") return;
    const count = 4 + Math.floor(Math.random() * 2); // 4..5
    for (let i = 0; i < count; i++) {
      const createdAt = now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 14);
      const base: ForumTopic = {
        id: generateId(),
        title: randomOf(seedTitles),
        category: cat,
        author: randomOf(authors),
        message: randomOf(seedMessages),
        createdAt,
        updatedAt: createdAt,
        views: Math.floor(Math.random() * 300),
        replies: [],
      };
      const replyCount = 1 + Math.floor(Math.random() * 4); // 1..4 replies
      let lastTime = createdAt;
      for (let r = 0; r < replyCount; r++) {
        const replyTime = lastTime + Math.floor(Math.random() * 1000 * 60 * 60 * 24);
        base.replies.push({
          id: generateId(),
          author: randomOf(authors),
          message: randomOf(replySnippets),
          createdAt: replyTime,
        });
        lastTime = replyTime;
      }
      base.updatedAt = lastTime;
      seeded.push(base);
    }
  });

  saveTopics(seeded);
}

// Ensure every category has at least `min` topics (useful if previous data existed)
function ensureMinimumPerCategory(min: number) {
  const all = loadTopics();
  const categories = [
    "Announcements",
    "Farm Questions",
    "Pests and Problems",
    "Farm Showcase",
    "Farm Guides",
    "Team up",
    "News and Views",
    "Product Support",
    "Ads and Offers",
    "Price",
    "Tech",
    "Resources",
    "Products",
  ];
  const authors = [
    "Ravi (Maharashtra)", "Anita (Punjab)", "Kiran (Karnataka)", "Meera (UP)", "Suresh (TN)", "Pooja (MP)"
  ];
  const titles = [
    "Best price for onion this week?", "Low-cost drip irrigation tips", "Organic pest control for tomato", "Share your yield numbers", "Looking for equipment rental", "Weather-based sowing suggestions", "Soil testing kits – which one to buy?"
  ];
  const messages = [
    "What rates are you getting in the local mandi?", "DIY setup learnings.", "Neem + traps helped me.", "Posting data for feedback.", "Share reliable contacts.", "Monsoon is late here, delay?", "Need reviews from real users."
  ];
  const replySnippets = [
    "We got better price yesterday.", "Try 30cm emitter spacing.", "Use pheromone traps.", "Great insights, thanks.", "I can DM you a contact.", "Check IMD forecast."
  ];

  let mutated = false;
  const byCategoryCount: Record<string, number> = {};
  for (const t of all) {
    byCategoryCount[t.category] = (byCategoryCount[t.category] ?? 0) + 1;
  }

  const now = Date.now();
  const randomOf = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  categories.forEach((cat) => {
    const have = byCategoryCount[cat] ?? 0;
    for (let i = have; i < min; i++) {
      const createdAt = now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7);
      const base: ForumTopic = {
        id: crypto.randomUUID(),
        title: randomOf(titles),
        category: cat,
        author: randomOf(authors),
        message: randomOf(messages),
        createdAt,
        updatedAt: createdAt,
        views: Math.floor(Math.random() * 200),
        replies: [],
      };
      const replyCount = 1 + Math.floor(Math.random() * 3);
      let last = createdAt;
      for (let r = 0; r < replyCount; r++) {
        const time = last + Math.floor(Math.random() * 1000 * 60 * 60 * 12);
        base.replies.push({ id: crypto.randomUUID(), author: randomOf(authors), message: randomOf(replySnippets), createdAt: time });
        last = time;
      }
      base.updatedAt = last;
      all.push(base);
      mutated = true;
    }
  });

  if (mutated) saveTopics(all);
}

// Light random activity on each load: new views, occasional reply/topic
function maybeRandomActivity() {
  const all = loadTopics();
  if (all.length === 0) return;
  let mutated = false;

  // Randomly bump views
  for (const t of all) {
    const inc = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
    if (inc > 0) {
      t.views += inc;
      mutated = true;
    }
  }

  // Occasionally add a reply to a random topic
  if (Math.random() < 0.35) {
    const idx = Math.floor(Math.random() * all.length);
    const authors = [
      "Ravi (Maharashtra)",
      "Anita (Punjab)",
      "Kiran (Karnataka)",
      "Meera (UP)",
      "Suresh (TN)",
      "Pooja (MP)",
    ];
    const messages = [
      "Agree with this, tried it last season.",
      "Sharing my notes in a reply below.",
      "Check the moisture before irrigating.",
      "Rates improved in evening session.",
      "Good point, also watch for caterpillars.",
    ];
    const reply: ForumReply = {
      id: generateId(),
      author: authors[Math.floor(Math.random() * authors.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      createdAt: Date.now(),
    };
    all[idx].replies.push(reply);
    all[idx].updatedAt = reply.createdAt;
    mutated = true;
  }

  // Occasionally add a fresh topic
  if (Math.random() < 0.2) {
    const categories = [
      "Announcements","Farm Questions","Pests and Problems","Farm Showcase","Farm Guides","Team up","News and Views","Product Support","Ads and Offers","Price","Tech","Resources","Products",
    ];
    const titles = ["Quick update from field", "Need advice urgently", "Market rates today", "Small hack that helped", "Tool review"];
    const authors = ["Nikhil (RJ)", "Divya (MH)", "Vikram (KA)", "Geeta (BR)"];
    const messages = ["Posting a short update.", "What would you do in this case?", "These are the rates near me.", "This tweak saved water.", "Sharing pros/cons after a week."];
    const now = Date.now();
    all.push({
      id: generateId(),
      title: titles[Math.floor(Math.random() * titles.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      createdAt: now,
      updatedAt: now,
      views: Math.floor(Math.random() * 20),
      replies: [],
    });
    mutated = true;
  }

  if (mutated) saveTopics(all);
}


