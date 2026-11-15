import MarkdownIt from 'markdown-it';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Clock3, FileText, Pencil, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { contentHref } from '../content/adapter';

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

function notebookHref(subjectId, sectionId, itemId = '', edit = '') {
  const query = new URLSearchParams({ notebook: sectionId });
  if (itemId) query.set('entry', itemId);
  if (edit) query.set('edit', edit);
  return `${contentHref('subject', subjectId)}?${query}`;
}

function CloseLink({ href, label }) {
  return <a href={href} className="notebook-close" aria-label={label} title={label}><X size={17} /></a>;
}

export default function SubjectNotebook({ subject, sectionId, itemId = '', edit = '' }) {
  const [notebook, setNotebook] = useState(loadNotebook);
  const sections = Array.isArray(notebook[subject.id]) ? notebook[subject.id] : [];
  const selectedSection = sections.find(section => section.id === sectionId);
  const selectedItem = selectedSection?.items.find(item => item.id === itemId);
  const [addingSection, setAddingSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(selectedSection?.title || '');
  const [sectionDescription, setSectionDescription] = useState(selectedSection?.description || '');
  const [itemTitle, setItemTitle] = useState(selectedItem?.title || '');
  const [itemBody, setItemBody] = useState(selectedItem?.markdown || '');
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState('');
  const page = useRef(null);
  const subjectHref = contentHref('subject', subject.id);
  const sectionHref = sectionId ? notebookHref(subject.id, sectionId) : subjectHref;
  const itemHref = selectedItem ? notebookHref(subject.id, sectionId, itemId) : sectionHref;
  const editingContent = edit === 'add' || (edit === 'content' && selectedItem);
  const editingSection = edit === 'section';
  const readingItem = selectedItem && !editingContent && !editingSection;
  const backHref = editingSection ? sectionHref : editingContent ? itemHref : readingItem ? sectionHref : subjectHref;

  useEffect(() => {
    if (sectionId === undefined) return;
    page.current?.scrollIntoView({ block: 'start' });
    const target = page.current?.querySelector('input') || page.current;
    target?.focus({ preventScroll: true });
  }, [sectionId, itemId, edit]);

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

  const saveSection = event => {
    event.preventDefault();
    const title = sectionTitle.trim();
    if (!title) return;
    const description = sectionDescription.trim();
    const id = selectedSection?.id || crypto.randomUUID();
    const updated = selectedSection
      ? sections.map(section => section.id === id ? { ...section, title, description } : section)
      : [...sections, { id, title, description, items: [] }];
    if (commit({ ...notebook, [subject.id]: updated })) window.location.assign(notebookHref(subject.id, id));
  };

  const saveMaterial = event => {
    event.preventDefault();
    const title = itemTitle.trim();
    const body = itemBody.trim();
    if (!title) return;
    if (!body) { setPreview(false); setMessage('Add Markdown content before saving.'); return; }
    const id = edit === 'content' ? selectedItem.id : crypto.randomUUID();
    const updated = sections.map(section => section.id === sectionId ? { ...section,
      items: edit === 'content'
        ? section.items.map(item => item.id === id ? { ...item, title, markdown: body } : item)
        : [...section.items, { id, title, markdown: body }],
    } : section);
    if (commit({ ...notebook, [subject.id]: updated })) window.location.assign(notebookHref(subject.id, sectionId, id));
  };

  const sectionFields = <>
    <label>Section name<input value={sectionTitle} onChange={event => setSectionTitle(event.target.value)} placeholder="e.g. Subarray patterns" required maxLength={120} /></label>
    <label>Description <span className="notebook-optional">(optional)</span><textarea className="notebook-description-input" value={sectionDescription} onChange={event => setSectionDescription(event.target.value)} placeholder="What will you learn in this section?" rows={3} /></label>
  </>;

  if (sectionId === undefined) return <section className="subject-notebook" aria-labelledby="notebook-heading">
    <div className="section-heading notebook-heading">
      <div><span className="eyebrow">YOUR MATERIAL</span><h2 id="notebook-heading">My sections</h2><p>Your notes, examples, and learning material for {subject.shortTitle || subject.title}.</p></div>
      {addingSection ? <button className="notebook-close" aria-label="Cancel new section" title="Cancel new section" onClick={() => setAddingSection(false)}><X size={17} /></button>
        : <button className="notebook-button notebook-button-primary" onClick={() => { setSectionTitle(''); setSectionDescription(''); setAddingSection(true); }}><Plus size={16} />Add section</button>}
    </div>
    {message && <p role="alert" className="notebook-error">{message}</p>}
    {addingSection && <form className="notebook-editor notebook-create-form" onSubmit={saveSection}>
      {sectionFields}<div className="notebook-editor-footer"><span>You can add content after creating your section.</span><button className="notebook-button notebook-button-primary" type="submit"><Check size={16} />Create section</button></div>
    </form>}
    {!sections.length && !addingSection && <div className="notebook-empty"><strong>A space for your own learning</strong><span>Create a section to collect notes and Markdown content.</span></div>}
    <div className="notebook-section-grid">{sections.map(section => <article className="notebook-section-card" key={section.id}>
      <a className="notebook-section-link" href={notebookHref(subject.id, section.id)}>
        <div className="notebook-card-label"><span className="notebook-file-icon"><BookOpen size={18} /></span><span>PERSONAL SECTION</span><ChevronRight size={17} /></div>
        <h3>{section.title}</h3><p>{section.description || 'Your notes, explanations, and code examples, all in one place.'}</p>
      </a>
      <div className="notebook-card-footer"><span><FileText size={14} />{section.items.length} {section.items.length === 1 ? 'entry' : 'entries'}</span><div className="notebook-inline-actions">
        <a className="notebook-icon-button" href={notebookHref(subject.id, section.id, '', 'section')} aria-label={`Edit ${section.title}`} title="Edit section"><Pencil size={15} /></a>
        <a className="notebook-icon-button" href={notebookHref(subject.id, section.id, '', 'add')} aria-label={`Add content to ${section.title}`} title="Add content"><Plus size={17} /></a>
      </div></div>
    </article>)}</div>
    <p className="notebook-storage-note">Saved in this browser.</p>
  </section>;

  if (!selectedSection || (itemId && !selectedItem)) return <div className="lesson-page-frame notebook-page" ref={page} tabIndex={-1}>
    <a className="notebook-back" href={selectedSection ? sectionHref : subjectHref}><ArrowLeft size={16} />Back to {selectedSection ? 'section' : subject.shortTitle || subject.title}</a>
    <div className="notebook-empty"><strong>Content not found</strong><span>This personal content may have been created in another browser.</span></div>
  </div>;

  const itemIndex = selectedSection.items.findIndex(item => item.id === itemId);
  const previous = selectedSection.items[itemIndex - 1];
  const next = selectedSection.items[itemIndex + 1];

  return <div className="lesson-page-frame notebook-page" ref={page} tabIndex={-1}>
    <div className="notebook-toolbar">
      <a className="notebook-back" href={backHref}><ArrowLeft size={16} /><span>Back to {editingSection || editingContent ? 'reading' : readingItem ? selectedSection.title : subject.shortTitle || subject.title}</span></a>
      <div className="notebook-inline-actions">
        {!editingSection && !editingContent && <>
          <a className="notebook-button" href={notebookHref(subject.id, sectionId, readingItem ? itemId : '', readingItem ? 'content' : 'section')}><Pencil size={15} /><span>Edit{readingItem ? ' content' : ' section'}</span></a>
          <a className="notebook-button notebook-button-primary" href={notebookHref(subject.id, sectionId, '', 'add')}><Plus size={16} /><span>Add content</span></a>
        </>}
        <CloseLink href={backHref} label={editingSection || editingContent ? 'Cancel editing' : 'Close page'} />
      </div>
    </div>
    <nav className="notebook-breadcrumbs" aria-label="Breadcrumb"><a href={subjectHref}>{subject.shortTitle || subject.title}</a><ChevronRight size={13} /><a href={sectionHref}>{selectedSection.title}</a>{(readingItem || editingContent || editingSection) && <><ChevronRight size={13} /><span>{editingSection ? 'Edit section' : editingContent ? edit === 'add' ? 'New content' : 'Edit content' : selectedItem.title}</span></>}</nav>
    <header className="notebook-page-heading">
      <span className="eyebrow">{editingSection ? 'SECTION DETAILS' : editingContent ? 'YOUR EDITOR' : readingItem ? 'PERSONAL NOTES' : 'PERSONAL SECTION'}</span>
      <h1>{editingSection ? 'Edit section' : editingContent ? edit === 'add' ? 'Add content' : 'Edit content' : readingItem ? selectedItem.title : selectedSection.title}</h1>
      {!readingItem && !editingContent && !editingSection && selectedSection.description && <p>{selectedSection.description}</p>}
      {!editingSection && !editingContent && <div className="notebook-page-meta"><span><FileText size={14} />{readingItem ? 'Markdown' : `${selectedSection.items.length} content ${selectedSection.items.length === 1 ? 'entry' : 'entries'}`}</span>{readingItem && <span><Clock3 size={14} />{Math.max(1, Math.ceil(selectedItem.markdown.split(/\s+/).length / 200))} min read</span>}</div>}
    </header>
    {message && <p role="alert" className="notebook-error">{message}</p>}
    {editingSection ? <form className="notebook-editor" onSubmit={saveSection}>{sectionFields}<div className="notebook-editor-footer"><span>Update how this section appears in your library.</span><button className="notebook-button notebook-button-primary" type="submit"><Check size={16} />Save section</button></div></form>
      : editingContent ? <form className="notebook-editor" onSubmit={saveMaterial}>
        <label>Content title<input value={itemTitle} onChange={event => setItemTitle(event.target.value)} placeholder="e.g. Minimum sum subarray — approach and solution" required maxLength={160} /></label>
        <div className="notebook-editor-label"><label htmlFor="notebook-markdown">Markdown content</label><button type="button" className="notebook-preview-toggle" aria-pressed={preview} onClick={() => setPreview(value => !value)}>{preview ? 'Continue editing' : 'Preview'}</button></div>
        <textarea id="notebook-markdown" hidden={preview} value={itemBody} onChange={event => setItemBody(event.target.value)} placeholder={'## Overview\n\nExplain the idea in your own words.\n\n## Solution\n\n```python\n# Add your code here\n```\n\n## Key takeaways\n\n- What did you learn?'} required={!preview} rows={20} />
        {preview && <div className="lesson-body notebook-preview" dangerouslySetInnerHTML={{ __html: markdown.render(itemBody || '*Your preview will appear here.*') }} />}
        <div className="notebook-editor-footer"><span>Supports headings, lists, links, tables, and fenced code blocks.</span><button className="notebook-button notebook-button-primary" type="submit"><Check size={16} />{edit === 'add' ? 'Save content' : 'Save changes'}</button></div>
      </form>
        : readingItem ? <article className="lesson-reader notebook-reader"><div className="lesson-body" dangerouslySetInnerHTML={{ __html: markdown.render(selectedItem.markdown) }} />
          <nav className="notebook-reading-nav" aria-label="Section entries">{previous && <a href={notebookHref(subject.id, sectionId, previous.id)}><ArrowLeft size={16} /><span><small>Previous</small>{previous.title}</span></a>}{next && <a className="notebook-next" href={notebookHref(subject.id, sectionId, next.id)}><span><small>Next</small>{next.title}</span><ArrowRight size={16} /></a>}</nav>
        </article>
          : <section className="notebook-entry-list" aria-label="Section content">
            <div className="notebook-list-heading"><h2>Contents</h2><span>{selectedSection.items.length} {selectedSection.items.length === 1 ? 'entry' : 'entries'}</span></div>
            {selectedSection.items.map((item, index) => <div className="notebook-entry-row" key={item.id}>
              <a className="notebook-entry-link" href={notebookHref(subject.id, sectionId, item.id)}><span className="notebook-entry-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.title}</strong><small>Notes & code examples · Markdown</small></span><ChevronRight size={18} /></a>
              <a className="notebook-icon-button" href={notebookHref(subject.id, sectionId, item.id, 'content')} aria-label={`Edit ${item.title}`} title="Edit content"><Pencil size={15} /></a>
            </div>)}
            {!selectedSection.items.length && <div className="notebook-empty notebook-content-empty"><BookOpen size={28} /><strong>Your section is ready</strong><span>Add your first note, explanation, or code example.</span><a className="notebook-button notebook-button-primary" href={notebookHref(subject.id, sectionId, '', 'add')}><Plus size={16} />Add your first content</a></div>}
          </section>}
    <p className="notebook-storage-note">Personal material · Saved in this browser.</p>
  </div>;
}
