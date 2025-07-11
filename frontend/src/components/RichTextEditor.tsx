import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from '@/components/ui/toolbar';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Link } from 'lucide-react';

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <Toolbar>
        <Button
          variant={editor?.isActive('bold') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor?.isActive('italic') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor?.isActive('strike') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </Toolbar>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
