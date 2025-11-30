
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedPage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const pageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Professional editorial title (H1). Focus on 'Analysis', 'Report', 'Data'. No clickbait." },
    metaTitle: { type: Type.STRING, description: "SEO title tag: Primary Keyword | Region | Equinox Analytics." },
    metaDescription: { type: Type.STRING, description: "Compelling SEO description (max 155 chars). Summarize unique stats found in the report and use persuasive language to drive clicks." },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "8-12 specific LSI keywords and long-tail phrases extracted from the report content." },
    category: { type: Type.STRING, description: "Category: Economics, Demographics, Real Estate, Technology, Cost of Living, or Quality of Life." },
    htmlContent: { 
      type: Type.STRING, 
      description: "Full editorial report HTML. Structure: Executive Summary (bold), H2 Market Overview, H2 Key Data Points, H2 Regional Analysis, H2 Outlook. Use <ul> for lists. Tone: Analytical, Wall Street Journal style. Length: 1000+ words." 
    },
    summary: { type: Type.STRING, description: "3-sentence executive summary highlighting the most important statistic found." },
    authorName: { type: Type.STRING, description: "Author Name (e.g. 'Dr. Elena Rostova', 'James K. Thorne')." },
    dataBox: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        headers: { type: Type.ARRAY, items: { type: Type.STRING } },
        rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
        source: { type: Type.STRING, description: "The primary source of the data (will be overwritten by actual search citations)." }
      },
      required: ["title", "headers", "rows", "source"]
    },
    sidebarFacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 hard-hitting statistics/numbers related to the topic." },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        }
      },
      description: "5 SEO-optimized FAQs. Questions people actually ask."
    }
  },
  required: ["title", "metaTitle", "metaDescription", "keywords", "htmlContent", "summary", "dataBox", "sidebarFacts", "faq", "authorName", "category"]
};

export const generatePageContent = async (keyword: string): Promise<GeneratedPage> => {
  const model = "gemini-2.5-flash"; 
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const systemInstruction = `
    You are the Chief Economist at Equinox Analytics.
    Your job is to produce high-value, SEO-optimized market intelligence reports.
    
    CRITICAL INSTRUCTION:
    You have access to the Google Search tool. **You MUST use it to fetch REAL-TIME data.**
    Do not rely on your internal knowledge cutoff. Actively search for the latest ${currentYear} statistics.
    
    DATA SOURCES:
    Prioritize data from: World Bank, IMF, OECD, Bureau of Labor Statistics, Numbeo, Statista, Trading Economics, and official government reports.
    
    GUIDELINES:
    1.  **Real-Time Context**: Today is ${currentDate}. Write from this perspective.
    2.  **Authority**: Write with absolute confidence. Use professional financial terminology.
    3.  **Formatting**: Use HTML tags <h2>, <h3>, <p>, <ul>, <li>. Structure the article for high readability and SEO scanning.
    4.  **Data Integrity**: Use the search tool to fill the Data Table with ACTUAL current numbers.
    5.  **No Fluff**: Every sentence must convey information.
    6.  **Zero AI Disclosure**: This is a human-written report. Never break character.
    7.  **SEO**: Ensure the keyword appears in the first 100 words and in at least one H2.
    8.  **Metadata**: Meta description must be click-worthy and factual. Keywords must be relevant long-tail variations.
  `;

  const prompt = `
    Generate a comprehensive market analysis report for: "${keyword}".
    
    Using the Search Tool, find:
    1. Latest statistical data for ${currentYear}.
    2. Recent trends and forecasts for ${nextYear}.
    3. Competitor or regional comparison data.
    
    Then produce the full report JSON including the Article HTML, Data Table, FAQs, and optimized SEO metadata.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: pageSchema,
        temperature: 0.3, 
        // Enable Google Search Grounding to fetch real-time data
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.text) throw new Error("No response from Gemini");

    const rawData = JSON.parse(response.text);
    const date = new Date().toISOString();
    
    // Extract Grounding Metadata (Real citations from Google Search)
    // @ts-ignore - The SDK types might lag behind the actual live response structure for tools
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    let verifiedSources: string[] = [];
    if (groundingChunks.length > 0) {
      // Extract domains from the search results to create a credible source list
      const domains = groundingChunks
        .map((c: any) => c.web?.uri ? new URL(c.web.uri).hostname.replace('www.', '') : null)
        .filter((d: string | null) => d);
      
      verifiedSources = [...new Set(domains)].slice(0, 3) as string[];
    }

    // Overwrite the generic source with actual verified sources if found
    if (verifiedSources.length > 0) {
      rawData.dataBox.source = `${verifiedSources.join(', ')} (Verified ${currentYear})`;
    }

    const slug = rawData.metaTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const page: GeneratedPage = {
      id: crypto.randomUUID(),
      slug: slug,
      topic: keyword,
      title: rawData.title,
      htmlContent: rawData.htmlContent,
      summary: rawData.summary,
      author: rawData.authorName,
      publishDate: currentDate,
      lastUpdated: currentDate,
      category: rawData.category,
      dataBox: rawData.dataBox,
      sidebarFacts: rawData.sidebarFacts,
      faq: rawData.faq,
      status: 'PUBLISHED',
      internalLinks: [],
      seo: {
        metaTitle: rawData.metaTitle,
        metaDescription: rawData.metaDescription,
        keywords: rawData.keywords, // Use AI-generated specific keywords
        slug: slug
      },
      schema: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: rawData.title,
        datePublished: date,
        dateModified: date,
        author: {
          "@type": "Person",
          name: rawData.authorName
        },
        publisher: {
          "@type": "Organization",
          name: "Equinox Analytics"
        }
      }
    };

    return page;
  } catch (error) {
    console.error("Content generation failed:", error);
    throw error;
  }
};
