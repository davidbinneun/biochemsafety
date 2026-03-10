import React, { useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PageLinkButton from './PageLinkButton';

// Register custom font sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
Quill.register(Size, true);

// Register font families using inline styles
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['Arial', 'David', 'Tahoma', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Rubik', 'Heebo', 'Assistant'];
Quill.register(Font, true);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  toolbarOptions = 'full' // 'full', 'simple', 'minimal'
}) {
  const quillRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const getToolbarConfig = () => {
    switch (toolbarOptions) {
      case 'minimal':
        return [
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          ['clean']
        ];
      case 'simple':
        return [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'bullet' }, { 'list': 'ordered' }],
          ['clean']
        ];
      case 'full':
      default:
        return [
          [{ 'header': [1, 2, 3, false] }],
          [{ 'font': Font.whitelist }, { 'size': Size.whitelist }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link'],
          ['clean']
        ];
    }
  };

  const handleInsertLink = (text, url) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    const position = range ? range.index : quill.getLength();
    
    // Insert the text with link (internal links don't need target="_blank")
    quill.insertText(position, text);
    quill.formatText(position, text.length, 'link', url);
    
    // Move cursor after the inserted link
    quill.setSelection(position + text.length);
  };

  return (
    <div className="rich-text-editor-wrapper">
      <div className="flex items-center gap-2 mb-2">
        <PageLinkButton onInsertLink={handleInsertLink} />
        <span className="text-xs text-gray-500">הוסף קישור לעמוד באתר</span>
      </div>
      <div 
        className="bg-white rounded-lg border overflow-hidden [&_.ql-editor_ul]:list-disc [&_.ql-editor_ul]:pr-8 [&_.ql-editor_ol]:list-decimal [&_.ql-editor_ol]:pr-8 [&_.ql-editor_li]:pr-2" 
        dir="rtl"
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          modules={{
            toolbar: getToolbarConfig()
          }}
          className="[&_.ql-container]:h-auto [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[150px]"
        />
      </div>
    </div>
  );
}