import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });

export function personalCatalog(content, personal) {
  const hiddenLessons = new Set(personal.hiddenLessonIds || []);
  const hiddenQuestions = new Set(personal.hiddenQuestionIds);
  const customLessons = (personal.customLessons || []).map(lesson => ({
    ...lesson, summary: 'Personal lesson', html: markdown.render(lesson.markdown),
    order: Number.MAX_SAFE_INTEGER, prerequisiteIds: [], relatedIds: [], sections: [],
  }));
  const customQuestions = personal.customQuestions.flatMap(question => {
    const topicId = personal.questionTopicIds?.[question.id];
    if (!topicId) return [];
    return [{ id: question.id, subjectId: question.topicId, topicId, prompt: question.q,
      answerHtml: question.a, order: Number.MAX_SAFE_INTEGER }];
  });
  return {
    ...content,
    lessons: [...content.lessons, ...customLessons].filter(lesson => !hiddenLessons.has(lesson.id)),
    questions: [...content.questions, ...customQuestions].filter(question => !hiddenQuestions.has(question.id)).map(question => {
      const edit = personal.questionEdits?.[question.id];
      return edit ? { ...question, prompt: edit.q, answerHtml: edit.a } : question;
    }),
  };
}

export const renderPersonalMarkdown = text => markdown.render(text);
