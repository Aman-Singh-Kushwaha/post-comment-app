import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from '@/components/ui/toolbar';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

const RichTextEditor = ({ value, onChange, minHeight = 'min-h-[300px]' }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender:false,
  });

  return (
    <div>
      <Toolbar>
        <Button
          type="button"
          variant={editor?.isActive('bold') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive('italic') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor?.isActive('strike') ? 'secondary' : 'ghost'}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </Toolbar>
      <EditorContent className={cn(" border-solid", minHeight)} editor={editor} />

    </div>
  );
};

export default RichTextEditor;
