import { BookOpen, CheckCircle2, ChevronRight, Clock3, Flame } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
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

function StudyCalendar({ days, onClose }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(new Date());
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  const seconds = days[localDay(selected)] || 0;
  return <dialog ref={dialog} className="study-calendar-dialog" aria-labelledby="study-calendar-title" onCancel={onClose}>
    <div className="study-calendar-heading"><div><h2 id="study-calendar-title">Study activity</h2><p>Explore your study days and time.</p></div><button className="secondary-button" onClick={onClose}>Close</button></div>
    <DayPicker mode="single" selected={selected} onSelect={day => day && setSelected(day)} modifiers={{ studied: day => Boolean(days[localDay(day)]) }} modifiersClassNames={{ studied: 'study-day-active' }} />
    <p className="study-calendar-detail" aria-live="polite"><strong>{selected.toLocaleDateString(undefined, { dateStyle: 'long' })}</strong> · {seconds ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m ${seconds % 60}s studied` : 'No study activity'}</p>
    <p className="study-calendar-note">Activity is saved in this browser on the hosted site.</p>
  </dialog>;
}

export default function ProgressPage({ subjects, data, content, personal, onMarkStudyDay }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const tracking = studyStats(personal);
  const today = localDay();
  const todaySeconds = personal.studyDays[today] || 0;
  const todayComplete = personal.completedStudyDays.includes(today);
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
      <section className="journey-metric" style={{ '--metric-color': '#f59b24' }}><div className="journey-metric-heading"><span className="journey-icon"><Flame size={20} /></span><div><small>Current Streak</small><strong>{tracking.streak} days</strong></div></div><div className="journey-week">{week.map(day => <span key={day.day}><i className={personal.completedStudyDays.includes(day.day) ? 'active' : ''} aria-label={`${day.day}: ${personal.completedStudyDays.includes(day.day) ? 'streak completed' : 'not completed'}`} /><small>{day.label}</small></span>)}</div><button className="streak-calendar-link" onClick={() => setCalendarOpen(true)} aria-haspopup="dialog">View calendar →</button><button className="secondary-button streak-complete-button" onClick={onMarkStudyDay} disabled={todayComplete || todaySeconds < 3600}>{todayComplete ? 'Today completed' : todaySeconds >= 3600 ? 'Mark today complete' : `Study ${Math.ceil((3600 - todaySeconds) / 60)} more min to mark complete`}</button></section>
    </div>
    {calendarOpen && <StudyCalendar days={personal.studyDays} onClose={() => setCalendarOpen(false)} />}
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
