import { apiRequest } from './queryClient';

/**
 * Interface for content generation parameters
 */
export interface ContentGenerationParams {
  contentType: string;
  businessType: string;
  tone: string;
  length: string;
  details: string;
  language: string;
}

/**
 * Interface for content generation response
 */
export interface ContentGenerationResponse {
  title: string;
  content: string;
}

/**
 * Generates content using the OpenAI API through our backend
 * @param params Content generation parameters
 * @returns Promise with generated content
 */
export async function generateContent(params: ContentGenerationParams): Promise<ContentGenerationResponse> {
  try {
    const response = await apiRequest('POST', '/api/content/generate', params);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}

/**
 * Saves generated content to the user's account
 * @param title Content title
 * @param contentType Type of content
 * @param content The generated content
 * @param prompt The prompt used to generate the content
 * @param language The language of the content
 * @returns Promise with save response
 */
export async function saveContent(
  title: string,
  contentType: string,
  content: string,
  prompt: string,
  language: string
): Promise<any> {
  try {
    const response = await apiRequest('POST', '/api/content/save', {
      title,
      contentType,
      content,
      prompt,
      language
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving content:', error);
    throw new Error('Failed to save content');
  }
}
