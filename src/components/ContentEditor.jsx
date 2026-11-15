import { useRef, useState } from 'react';

export default function ContentEditor({ title, html, onSave, onCancel }) {
  const [question, setQuestion] = useState(title ?? '');
  const editor = useRef(null);
  const submit = event => {
    event.preventDefault();
    if (title !== undefined && !question.trim()) return;
    onSave({ title: question.trim(), html: editor.current.innerHTML });
  };
  return <form className="content-editor" onSubmit={submit}>
    {title !== undefined && <label>Question<textarea value={question} onChange={event => setQuestion(event.target.value)} rows={2} required /></label>}
    <label id="content-editor-label">{title === undefined ? 'Lesson content' : 'Answer'}</label>
    <div ref={editor} className="content-editable" contentEditable suppressContentEditableWarning role="textbox" aria-labelledby="content-editor-label" aria-multiline="true" dangerouslySetInnerHTML={{ __html: html }} />
    <div className="content-editor-actions"><button className="primary-button" type="submit">Save changes</button><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}
