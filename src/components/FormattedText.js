// Converts **bold** and *italic* markdown into real <strong>/<em> elements instead of
// literal asterisks. Deliberately narrow (no arbitrary HTML/markdown parsing) since
// this only ever receives AI-generated plain text, not trusted rich content.
export default function FormattedText({ text }) {
  if (!text) return null;

  // Split on bold first (so **x** isn't mistaken for two italic markers), then
  // split whatever's left on single-asterisk italic segments.
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);

  const nodes = [];
  let key = 0;

  for (const chunk of boldSplit) {
    if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length > 4) {
      nodes.push(<strong key={key++}>{chunk.slice(2, -2)}</strong>);
      continue;
    }

    const italicSplit = chunk.split(/(\*[^*]+\*)/g);
    for (const piece of italicSplit) {
      if (piece.startsWith("*") && piece.endsWith("*") && piece.length > 2) {
        nodes.push(<em key={key++}>{piece.slice(1, -1)}</em>);
      } else if (piece) {
        nodes.push(<span key={key++}>{piece}</span>);
      }
    }
  }

  return nodes;
}
