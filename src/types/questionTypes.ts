export interface CreateAnswerType {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionType {
  label: string;
  questionnaireId: number;
  answers: CreateAnswerType[];
}
