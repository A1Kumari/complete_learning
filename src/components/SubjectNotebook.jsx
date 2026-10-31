import MarkdownIt from 'markdown-it';
import { useState } from 'react';

const STORAGE_KEY = 'learning-subject-notebook-v1';
const markdown = new MarkdownIt({ html: false, linkify: true, breaks: true });

function loadNotebook() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).map(([subject, sections]) => [subject,
      Array.isArray(sections) ? sections.filter(section => section && typeof section.id === 'string'
        && typeof section.title === 'string' && Array.isArray(section.items)).map(section => ({
        ...section, items: section.items.filter(item => item && typeof item.id === 'string'
          && typeof item.title === 'string' && typeof item.markdown === 'string'),
      })) : [],
    ]));
  } catch { return {}; }
}

export default function SubjectNotebook({ subject }) {
  const [notebook, setNotebook] = useState(loadNotebook);
  const [addingSection, setAddingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [addingTo, setAddingTo] = useState(null);
  const [itemTitle, setItemTitle] = useState('');
  const [itemBody, setItemBody] = useState('');
  const [message, setMessage] = useState('');
  const sections = Array.isArray(notebook[subject.id]) ? notebook[subject.id] : [];

  const commit = next => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setNotebook(next);
      setMessage('');
      return true;
    } catch {
      setMessage('Could not save in this browser. Check available browser storage and try again.');
      return false;
    }
  };

  const addSection = event => {
    event.preventDefault();
    const title = sectionTitle.trim();
    if (!title) return;
    const next = { ...notebook, [subject.id]: [...sections, { id: crypto.randomUUID(), title, items: [] }] };
    if (commit(next)) { setSectionTitle(''); setAddingSection(false); }
  };

  const addMaterial = (event, section) => {
    event.preventDefault();
    const title = itemTitle.trim();
    const body = itemBody.trim();
    if (!title || !body) return;
    const updated = sections.map(item => item.id === section.id
      ? { ...item, items: [...item.items, { id: crypto.randomUUID(), title, markdown: body }] }
      : item);
    if (commit({ ...notebook, [subject.id]: updated })) {
      setItemTitle(''); setItemBody(''); setAddingTo(null);
    }
  };

  return <section className="subject-notebook" aria-labelledby="notebook-heading">
    <div className="section-heading notebook-heading"><div><span className="eyebrow">YOUR MATERIAL</span><h2 id="notebook-heading">My sections</h2><p>Add your own Markdown notes and learning material to {subject.shortTitle || subject.title}.</p></div><button className="primary-button notebook-add-section" onClick={() => setAddingSection(open => !open)}>{addingSection ? 'Cancel' : '+ Add section'}</button></div>
    {addingSection && <form className="notebook-form notebook-section-form" onSubmit={addSection}><label>Section name<input autoFocus value={sectionTitle} onChange={event => setSectionTitle(event.target.value)} placeholder="e.g. Advanced Python patterns" required maxLength={120} /></label><button className="secondary-button" type="submit">Add section</button></form>}
    {message && <p role="alert" className="notebook-error">{message}</p>}
    {sections.length === 0 && !addingSection && <div className="notebook-empty"><strong>No personal sections yet</strong><span>Create a section, then add Markdown content inside it.</span></div>}
    <div className="notebook-sections">{sections.map(section => <article className="notebook-section" key={section.id}>
      <div className="notebook-section-title"><div><span className="eyebrow">PERSONAL SECTION</span><h3>{section.title}</h3></div><button className="secondary-button" onClick={() => { setAddingTo(addingTo === section.id ? null : section.id); setItemTitle(''); setItemBody(''); }}>{addingTo === section.id ? 'Cancel' : '+ Add content'}</button></div>
      {addingTo === section.id && <form className="notebook-form" onSubmit={event => addMaterial(event, section)}><label>Content title<input autoFocus value={itemTitle} onChange={event => setItemTitle(event.target.value)} placeholder="e.g. List comprehension examples" required maxLength={160} /></label><label>Markdown content<textarea value={itemBody} onChange={event => setItemBody(event.target.value)} placeholder={'## Overview\n\nExplain the core idea.\n\n## Example\n\n```python\n# Add a code example\n```\n\n## Key takeaways\n\n- Add the important points\n- Include common mistakes or interview tips'} required rows={12} /></label><button className="secondary-button" type="submit">Add to section</button></form>}
      {section.items.length === 0 ? <p className="notebook-empty-inline">No content in this section yet.</p> : <div className="notebook-items">{section.items.map(item => <details className="notebook-item" key={item.id}><summary><strong>{item.title}</strong><span>View content</span></summary><div className="notebook-markdown" dangerouslySetInnerHTML={{ __html: markdown.render(item.markdown) }} /></details>)}</div>}
    </article>)}</div>
    <p className="notebook-storage-note">Your additions are saved in this browser and appear on this subject page.</p>
  </section>;
}
