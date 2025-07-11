import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content: string;
}

const RichTextRenderer = ({ content }: RichTextRendererProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  // Injeect our post content(html) to card
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default RichTextRenderer;