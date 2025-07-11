import DOMPurify from 'dompurify';

const RichTextRenderer = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default RichTextRenderer;
