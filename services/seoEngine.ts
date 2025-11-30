
import { GeneratedPage } from "../types";

const TARGET_COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "Switzerland", "United Arab Emirates", "Japan",
  "Singapore", "Netherlands", "Sweden", "Norway"
];

const TARGET_CITIES = [
  "New York", "London", "San Francisco", "Zurich", "Singapore", 
  "Dubai", "Sydney", "Toronto", "Berlin", "Tokyo", "Geneva"
];

const HIGH_CPM_TOPICS = [
  "Software Engineer Salary", 
  "Cost of Living Breakdown", 
  "Real Estate Price Trends", 
  "Healthcare Costs", 
  "Average Retirement Savings",
  "Tech Startup Funding",
  "Digital Marketing Rates",
  "Cybersecurity Analyst Pay"
];

// Generates high-value keyword permutations
export const generateKeywordQueue = (count: number = 5): string[] => {
  const queue: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const topic = HIGH_CPM_TOPICS[Math.floor(Math.random() * HIGH_CPM_TOPICS.length)];
    const isCity = Math.random() > 0.4; // 60% chance of country, 40% city
    const location = isCity 
      ? TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)]
      : TARGET_COUNTRIES[Math.floor(Math.random() * TARGET_COUNTRIES.length)];
      
    queue.push(`${topic} in ${location} 2024 Analysis`);
  }
  
  return queue;
};

// Internal Linking Logic
export const generateInternalLinks = (currentPage: GeneratedPage, allPages: GeneratedPage[]): { title: string; slug: string }[] => {
  // 1. Filter out self
  const candidates = allPages.filter(p => p.id !== currentPage.id);
  
  // 2. Score by category relevance
  const scored = candidates.map(p => ({
    page: p,
    score: (p.category === currentPage.category ? 2 : 0) + (Math.random()) // Add randomness for variety
  }));
  
  // 3. Sort and slice
  scored.sort((a, b) => b.score - a.score);
  
  const result = scored.slice(0, 5).map(item => ({
    title: item.page.title,
    slug: item.page.slug
  }));

  // Fallback if no pages exist yet
  if (result.length < 3) {
    return [
      { title: `Global Trends in ${currentPage.category}`, slug: '#' },
      { title: `Market Analysis: ${currentPage.topic.split(' ')[0]}`, slug: '#' },
      { title: `2025 Economic Outlook`, slug: '#' }
    ];
  }

  return result;
};
