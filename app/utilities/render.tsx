/**
 * Renderer: JSON → JSX
 */

import { SerializedEditorState } from "lexical";

export function LexicalRenderer({ state }: { state: SerializedEditorState }) {
  if (!state?.root) return null;

  return (
    <div className="max-w-none">
      {state.root.children.map((node: any, i: number) => {
        switch (node.type) {
          case "paragraph":
            return (
              <p key={i} className="text-md">
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </p>
            );

          case "list":
            if (node.listType === "number") {
              return (
                <ol key={i} className="list-decimal ml-6 mb-3">
                  {node.children?.map((li: any, j: number) => (
                    <li key={j}>
                      {li.children?.map((c: any, k: number) =>
                        renderNode(c, k)
                      )}
                    </li>
                  ))}
                </ol>
              );
            } else {
              return (
                <ul key={i} className="list-disc ml-6 mb-3">
                  {node.children?.map((li: any, j: number) => (
                    <li key={j}>
                      {li.children?.map((c: any, k: number) =>
                        renderNode(c, k)
                      )}
                    </li>
                  ))}
                </ul>
              );
            }

          case "heading":
            return (
              <h2 key={i} className="mt-4 mb-2 font-bold text-xl">
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-muted pl-4 italic text-muted-foreground my-3"
              >
                {node.children?.map((child: any, j: number) =>
                  renderNode(child, j)
                )}
              </blockquote>
            );

          case "table":
            return <div key={i} />; // Placeholder for TableParser

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Render inline nodes (text, link, etc.)
 */
export function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null;

  switch (node.type) {
    case "text": {
      let el: React.ReactNode = (
        <span
          key={key}
          style={{ ...parseStyle(node.style), whiteSpace: "pre-wrap" }}
        >
          {node.text}
        </span>
      );

      // Apply formatting
      if (node.format & 1) el = <strong key={key}>{el}</strong>; // Bold
      if (node.format & 2) el = <em key={key}>{el}</em>; // Italic
      if (node.format & 8) el = <u key={key}>{el}</u>; // Underline
      if (node.format & 4) el = <code key={key}>{el}</code>; // Code

      return el;
    }

    case "link":
      return (
        <a
          key={key}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {node.children?.map((c: any, i: number) => renderNode(c, i))}
        </a>
      );

    default:
      return null;
  }
}

/**
 * Helper: Convert inline style string → React style object
 */
function parseStyle(style: string): React.CSSProperties {
  if (!style) return {};
  return style.split(";").reduce((acc: any, rule) => {
    const [prop, value] = rule.split(":").map((s) => s.trim());
    if (prop && value) {
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelProp] = value;
    }
    return acc;
  }, {});
}
