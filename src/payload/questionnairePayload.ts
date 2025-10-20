export interface CreateQuestionnairePayload {
  name: string;
  description?: string;
}

export interface QuestionnaireCreationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UpdateQuestionnairePayload extends CreateQuestionnairePayload {
  id: number;
}
