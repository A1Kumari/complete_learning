import { BookOpen, CheckCircle2, ChevronRight, Clock3, Flame } from 'lucide-react';
import { contentHref } from '../content/adapter';
import { localDay, studyStats } from '../studyProgress';

const percentage = (count, total) => total ? Math.round(count / total * 100) : 0;

function Metric({ icon, color, title, count, total }) {
  const percent = percentage(count, total);
  return <section className="journey-metric" style={{ '--metric-color': color }}>
    <div className="journey-metric-heading"><span className="journey-icon">{icon}</span><div><small>{title}</small><strong>{count} / {total}</strong></div></div>
    <div className="journey-meter-row"><div className="journey-meter"><i style={{ width: `${percent}%` }} /></div><b>{percent}%</b></div>
  </section>;
}

export default function ProgressPage({ subjects, data, content, personal }) {
  const tracking = studyStats(personal);
  const completed = new Set(personal.completedLessonIds);
  const questions = data.flatMap(group => group.questions);
  const reviewed = questions.filter(question => question.status !== 'not-started').length;
  const lessonCount = content.lessons.filter(lesson => completed.has(lesson.id)).length;
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() + 6) % 7 + index);
    return { day: localDay(date), label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] };
  });
  return <div className="page progress-page journey-page">
    <div className="page-heading journey-heading"><div><h1>My Progress</h1><p>Track your learning journey across all subjects.</p></div><div className="journey-time"><Clock3 size={20} /><div><small>Total Study Time</small><strong>{Math.floor(tracking.seconds / 3600)}h {Math.floor(tracking.seconds % 3600 / 60)}m</strong></div></div></div>
    <div className="journey-metrics">
      <Metric icon={<BookOpen size={20} />} color="#20bf68" title="Lessons Completed" count={lessonCount} total={content.lessons.length} />
      <Metric icon={<CheckCircle2 size={20} />} color="#2875ee" title="Questions Reviewed" count={reviewed} total={questions.length} />
      <section className="journey-metric" style={{ '--metric-color': '#f59b24' }}><div className="journey-metric-heading"><span className="journey-icon"><Flame size={20} /></span><div><small>Current Streak</small><strong>{tracking.streak} days</strong></div></div><div className="journey-week">{week.map(day => <span key={day.day}><i className={personal.studyDays[day.day] ? 'active' : ''} aria-label={`${day.day}: ${personal.studyDays[day.day] ? 'studied' : 'no activity'}`} /><small>{day.label}</small></span>)}</div></section>
    </div>
    <div className="section-heading"><h2>Progress by Subject</h2></div>
    <div className="progress-subject-list">{subjects.map(subject => {
      const lessons = content.lessons.filter(lesson => lesson.subjectId === subject.id);
      const done = lessons.filter(lesson => completed.has(lesson.id)).length;
      const subjectQuestions = data.find(group => group.id === subject.id)?.questions || [];
      const marked = subjectQuestions.filter(question => question.status !== 'not-started').length;
      const percent = percentage(done + marked, lessons.length + subjectQuestions.length);
      return <a className="progress-subject-row" href={contentHref('subject', subject.id)} key={subject.id}><span className={`progress-subject-icon accent-${subject.accent || 'blue'}`}>{subject.icon}</span><span className="progress-subject-name"><strong>{subject.title}</strong><small>{done} / {lessons.length} lessons · {marked} / {subjectQuestions.length} questions reviewed</small></span><span className="progress-track"><i style={{ width: `${percent}%` }} /></span><b className="progress-percent">{percent}%</b><ChevronRight size={17} /></a>;
    })}</div>
  </div>;
}
