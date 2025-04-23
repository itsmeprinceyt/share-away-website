import Link from 'next/link';

const LinkifyText = ({ text }) => {
  const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/g;
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  const elements = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = markdownRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;

    if (match.index > lastIndex) {
      const plainPart = text.slice(lastIndex, match.index);
      const subParts = plainPart.split(urlRegex);

      subParts.forEach((part) => {
        if (urlRegex.test(part)) {
          const href = part.startsWith('http') ? part : `https://${part}`;
          elements.push(
            <Link key={`url-${keyCounter++}`} href={href} target="_blank" className="text-blue-600 hover:underline">
              {part}
            </Link>
          );
        } else {
          elements.push(<span key={`text-${keyCounter++}`}>{part}</span>);
        }
      });
    }

    const href = url.startsWith('http') ? url : `https://${url}`;
    elements.push(
      <Link key={`md-${keyCounter++}`} href={href} target="_blank" className="text-blue-600 hover:underline">
        {linkText}
      </Link>
    );

    lastIndex = markdownRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    const remainingParts = remaining.split(urlRegex);

    remainingParts.forEach((part) => {
      if (urlRegex.test(part)) {
        const href = part.startsWith('http') ? part : `https://${part}`;
        elements.push(
          <Link key={`remain-url-${keyCounter++}`} href={href} target="_blank" className="text-blue-600 hover:underline">
            {part}
          </Link>
        );
      } else {
        elements.push(<span key={`remain-text-${keyCounter++}`}>{part}</span>);
      }
    });
  }

  return <>{elements}</>;
};

export default LinkifyText;