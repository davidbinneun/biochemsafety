import React, { useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PageLinkButton from './PageLinkButton';
import { uploadFile } from '@/lib/supabaseClient';

// Register custom font sizes
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px', '54px', '60px', '66px', '72px'];
Quill.register(Size, true);

// Register font families using inline styles
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['Arial', 'David', 'Tahoma', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Rubik', 'Heebo', 'Assistant'];
Quill.register(Font, true);

// Helper to open a native color picker and apply the chosen color
function openNativeColorPicker(quill, format) {
  const input = document.createElement('input');
  input.type = 'color';
  input.style.position = 'absolute';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  // Pre-fill with current color if any
  const current = quill.getFormat()[format];
  if (current && current !== true) input.value = current;
  document.body.appendChild(input);
  input.addEventListener('input', (e) => {
    quill.format(format, /** @type {HTMLInputElement} */ (e.target).value);
  });
  input.addEventListener('change', () => {
    document.body.removeChild(input);
  });
  // Also clean up if user cancels (blur without change)
  input.addEventListener('blur', () => {
    if (document.body.contains(input)) document.body.removeChild(input);
  });
  input.click();
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '',
  toolbarOptions = 'full' // 'full', 'simple', 'minimal'
}) {
  const quillRef = useRef(null);

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
          ['link', 'image'],
          ['custom-color', 'custom-background'],
          ['clean']
        ];
    }
  };

  const modules = useRef({
    toolbar: {
      container: getToolbarConfig(),
      handlers: {
        'custom-color': function () {
          openNativeColorPicker(this.quill, 'color');
        },
        'custom-background': function () {
          openNativeColorPicker(this.quill, 'background');
        },
        'image': function () {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
              const url = await uploadFile(file);
              const quill = this.quill;
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url);
              quill.setSelection(range.index + 1);
            } catch (err) {
              console.error('Image upload failed:', err);
              alert('שגיאה בהעלאת תמונה');
            }
          };
        }
      }
    }
  }).current;

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
      <style>{`
        .ql-custom-color, .ql-custom-background {
          width: auto !important;
          padding: 0 5px !important;
          font-size: 11px !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        .ql-custom-color::after {
          content: '🎨 צבע';
        }
        .ql-custom-background::after {
          content: '🎨 רקע';
        }
      `}</style>
      <div className="flex items-center gap-2 mb-2">
        <PageLinkButton onInsertLink={handleInsertLink} />
        <span className="text-xs text-gray-500">הוסף קישור לעמוד באתר</span>
      </div>
      <div
        className="bg-white rounded-lg border overflow-visible [&_.ql-editor_ul]:list-disc [&_.ql-editor_ul]:pr-8 [&_.ql-editor_ol]:list-decimal [&_.ql-editor_ol]:pr-8 [&_.ql-editor_li]:pr-2 [&_.ql-toolbar]:overflow-visible"
        dir="rtl"
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          className="[&_.ql-container]:h-auto [&_.ql-container]:min-h-[150px] [&_.ql-editor]:min-h-[150px]"
        />
      </div>
    </div>
  );
}