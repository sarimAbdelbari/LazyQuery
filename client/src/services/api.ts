/**
 * API Client for Backend Communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessage {
  user: string;
  assistant: string;
}

export interface ChatQueryRequest {
  schemaContent: string;
  userQuery: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatQueryResponse {
  success: boolean;
  sqlQuery?: string;
  explanation?: string;
  rawResponse?: string;
  error?: string;
}

export interface ChatStatusResponse {
  success: boolean;
  connected: boolean;
  models?: string[];
  hasMistral?: boolean;
  error?: string;
}

/**
 * Check Ollama connection status
 */
export async function checkChatStatus(): Promise<ChatStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/status`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Failed to connect to backend',
    };
  }
}

/**
 * Send chat query to generate SQL
 */
export async function sendChatQuery(
  request: ChatQueryRequest
): Promise<ChatQueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate SQL',
    };
  }
}

