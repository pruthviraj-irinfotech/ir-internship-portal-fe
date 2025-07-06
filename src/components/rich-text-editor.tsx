'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, List, ListOrdered, Highlighter } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import React from 'react';

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap items-center gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('highlight')}
        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        aria-label="Toggle highlight"
      >
        <Highlighter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};


const RichTextEditor = ({ value, onChange }: { value: string, onChange: (richText: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
            HTMLAttributes: {
                class: 'list-disc pl-4',
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: 'list-decimal pl-4',
            },
        },
      }),
      Highlight.configure({
        multicolor: false,
        HTMLAttributes: {
            class: 'bg-yellow-400/40',
        }
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[120px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-t-0',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor) {
      const isSame = editor.getHTML() === value;
      if (isSame) {
        return;
      }
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);


  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
