import React, { forwardRef, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Write your content here...",
      className = "",
    },
    ref
  ) => {
    const quillRef = useRef<ReactQuill>(null);

    // Custom toolbar configuration
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    };

    const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "list",
      "bullet",
      "indent",
      "direction",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
    ];

    // Custom styles for the editor
    const editorStyle = {
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      minHeight: "300px",
    };

    useEffect(() => {
      // Apply custom styling
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const toolbar = document.querySelector(".ql-toolbar");
        if (toolbar) {
          (toolbar as HTMLElement).style.borderBottom = "1px solid #d1d5db";
          (toolbar as HTMLElement).style.borderTopLeftRadius = "6px";
          (toolbar as HTMLElement).style.borderTopRightRadius = "6px";
        }

        const container = document.querySelector(".ql-container");
        if (container) {
          (container as HTMLElement).style.borderBottomLeftRadius = "6px";
          (container as HTMLElement).style.borderBottomRightRadius = "6px";
          (container as HTMLElement).style.fontSize = "14px";
          (container as HTMLElement).style.fontFamily =
            "system-ui, -apple-system, sans-serif";
        }
      }
    }, []);

    return (
      <div className={`rich-text-editor ${className}`}>
        <style>{`
          .ql-editor {
            min-height: 300px;
            font-size: 14px;
            line-height: 1.6;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .ql-toolbar {
            border-top: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: #f9fafb;
          }
          
          .ql-container {
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .ql-editor.ql-blank::before {
            color: #6b7280;
            font-style: normal;
          }
          
          .ql-snow .ql-tooltip {
            z-index: 1000;
          }
          
          .ql-editor h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          
          .ql-editor h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          
          .ql-editor h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 1em 0;
          }
          
          .ql-editor h4 {
            font-size: 1em;
            font-weight: bold;
            margin: 1.33em 0;
          }
          
          .ql-editor h5 {
            font-size: 0.83em;
            font-weight: bold;
            margin: 1.67em 0;
          }
          
          .ql-editor h6 {
            font-size: 0.67em;
            font-weight: bold;
            margin: 2.33em 0;
          }
          
          .ql-editor p {
            margin: 1em 0;
          }
          
          .ql-editor blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }
          
          .ql-editor .ql-code-block-container {
            background-color: #f3f4f6;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
            font-family: 'Courier New', monospace;
            border: 1px solid #e5e7eb;
          }
        `}</style>

        <ReactQuill
          ref={ref || quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={editorStyle}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
