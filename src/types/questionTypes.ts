export interface CreateAnswerDto {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  label: string;
  questionnaireId: number;
  answers: CreateAnswerDto[];
}
