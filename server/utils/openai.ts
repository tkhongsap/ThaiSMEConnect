import { ContentGeneration } from "@shared/schema";

// OpenAI API Key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

/**
 * Generate content using OpenAI API
 * @param params Parameters for content generation
 * @returns Generated content and title
 */
export async function generateContentPrompt(params: ContentGeneration): Promise<{ title: string; content: string }> {
  // Make sure API key is available
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    // Prepare the prompt based on content type and language
    const prompt = createPrompt(params);
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: getSystemPrompt(params.language),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    let content = "";
    let title = "";

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      content = parsedContent.content || "";
      title = parsedContent.title || getDefaultTitle(params);
    } catch (e) {
      // Fallback if parsing fails
      content = data.choices[0].message.content || "";
      title = getDefaultTitle(params);
    }

    return { title, content };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again later.");
  }
}

/**
 * Create specific prompt based on content parameters
 */
function createPrompt(params: ContentGeneration): string {
  const { contentType, businessType, tone, length, details, language } = params;
  
  const languageText = language === "th" ? "Thai" : "English";
  const lengthText = getLengthDescription(length);
  
  return `
Please generate ${languageText} content for a ${businessType} business with the following specifications:

Content Type: ${contentType}
Business Type: ${businessType}
Tone: ${tone}
Length: ${lengthText}

Additional Details: ${details || "No specific details provided"}

Please format your response as a JSON object with "title" and "content" fields.
  `;
}

/**
 * Get system prompt based on language
 */
function getSystemPrompt(language: string): string {
  if (language === "th") {
    return `You are an expert Thai marketing content creator for small to medium businesses. 
Create compelling, culturally relevant Thai language content that sounds natural and native. 
Use appropriate Thai idioms, expressions, and tone. 
Format your responses as JSON objects with "title" and "content" fields.
For social media posts, use appropriate emojis and hashtags.`;
  } else {
    return `You are an expert English marketing content creator for small to medium businesses in Thailand.
Create compelling, culturally relevant English language content for the Thai market.
Format your responses as JSON objects with "title" and "content" fields.
For social media posts, use appropriate emojis and hashtags.`;
  }
}

/**
 * Get default title if none is returned from API
 */
function getDefaultTitle(params: ContentGeneration): string {
  const languageText = params.language === "th" ? "ไทย" : "English";
  const contentTypeText = params.language === "th" 
    ? getThaiContentType(params.contentType) 
    : params.contentType;
  
  return `${contentTypeText} - ${params.businessType} (${languageText})`;
}

/**
 * Get Thai translation of content type
 */
function getThaiContentType(contentType: string): string {
  const types = {
    social: "โพสต์โซเชียลมีเดีย",
    ad: "โฆษณา",
    email: "อีเมลการตลาด",
    blog: "บทความบล็อก",
    promo: "โปรโมชัน"
  };
  
  return types[contentType] || contentType;
}

/**
 * Get length description based on length parameter
 */
function getLengthDescription(length: string): string {
  switch (length) {
    case "short":
      return "Short (around 50-100 words)";
    case "medium":
      return "Medium (around 100-200 words)";
    case "long":
      return "Long (around 300-500 words)";
    default:
      return "Medium length";
  }
}
