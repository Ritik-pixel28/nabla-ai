import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface DecisionRequest {
  situation: string;
}

export interface DecisionResponse {
  pros: string[];
  cons: string[];
  recommendation: string;
  action_plan: string[];
}

export const getDecision = async (situation: string): Promise<DecisionResponse> => {
  const response = await axios.post<DecisionResponse>(`${API_BASE_URL}/decision`, {
    situation,
  });
  return response.data;
};
