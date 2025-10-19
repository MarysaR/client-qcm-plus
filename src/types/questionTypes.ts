export interface CreateAnswerType {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionType {
  label: string;
  questionnaireId: number;
  answers: CreateAnswerType[];
}

export interface EditableAnswer extends CreateAnswerType {
  id?: number;
}

export interface EditQuestionType extends CreateQuestionType {
  id: number;
  answers: EditableAnswer[];
}
