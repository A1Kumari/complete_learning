import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Code2, Home, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, X } from 'lucide-react';
import { contentHref } from '../content/adapter';

function SubjectNav({ subjects, category, activeSubject }) {
  const [expanded, setExpanded] = useState(true);
  const groupId = `nav-${category.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="nav-group">
      <button className="nav-group-title" type="button" aria-expanded={expanded} aria-controls={groupId} onClick={() => setExpanded(open => !open)}>
        {category === 'Core CS' ? <BookOpen size={17} /> : <Code2 size={17} />}
        <span>{category}</span>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <div id={groupId} className="nav-subjects" hidden={!expanded}>
        {subjects.filter(subject => subject.category === category).map(subject => (
          <a key={subject.id} className={`nav-subject ${activeSubject === subject.id ? 'active' : ''}`} href={contentHref('subject', subject.id)}>
            <span className="nav-bullet" />{subject.shortTitle || subject.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function LearningShell({ subjects, activeSubject, children, searchQuery, onSearch, legacyActions }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => window.localStorage.getItem('learning-theme') === 'dark');
  const closeMobile = () => setMobileOpen(false);
  const toggleTheme = () => setDarkTheme(current => {
    const next = !current;
    window.localStorage.setItem('learning-theme', next ? 'dark' : 'light');
    return next;
  });
  return (
    <div className={`learning-app ${darkTheme ? 'theme-dark' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="global-header">
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
        <button className="sidebar-toggle" type="button" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!sidebarCollapsed} aria-controls="learning-sidebar" onClick={() => setSidebarCollapsed(collapsed => !collapsed)}>{sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button>
        <a className="brand" href="#/home" aria-label="Learning home"><span className="brand-mark"><BookOpen size={21} /></span><span>Learning</span></a>
        <label className="global-search">
          <Search size={18} />
          <input value={searchQuery} onChange={event => onSearch(event.target.value)} placeholder="Search your interview bank..." aria-label="Search interview bank" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="header-actions">{legacyActions}<button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} theme`} title={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}>{darkTheme ? <Sun size={16} /> : <Moon size={16} />}</button><span className="profile-chip"><span className="profile-avatar">A</span><span className="profile-name">Aditya</span></span></div>
      </header>
      <aside id="learning-sidebar" className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-header"><span className="brand"><span className="brand-mark"><BookOpen size={18} /></span>Learning</span><button onClick={closeMobile} aria-label="Close navigation"><X size={19} /></button></div>
        <nav aria-label="Primary navigation" onClick={event => { if (event.target.closest('a')) closeMobile(); }}>
          <a className="nav-home" href="#/home"><Home size={17} />Home</a>
          <SubjectNav subjects={subjects} category="Core CS" activeSubject={activeSubject} />
          <SubjectNav subjects={subjects} category="Development" activeSubject={activeSubject} />
        </nav>
        <div className="sidebar-footer">
          <span className="footer-note">Your workspace</span>
          <a href="#/progress">My progress</a>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={closeMobile} />}
      <main className="learning-main">{children}</main>
    </div>
  );
}
