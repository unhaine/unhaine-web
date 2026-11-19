import { marked } from "marked";
import { Link } from "react-router";

const SITE_ROUTE = /^\/(?:about(?:\/(?:career|education|values))?|portfolio(?:\/(?:billain|kata))?|blog(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?|contact)?$/;

function inline(tokens = [], onNavigate) {
  return tokens.map((token, index) => {
    const content = token.tokens
      ? inline(token.tokens, onNavigate)
      : token.text || token.raw;
    if (token.type === "strong") return <strong key={index}>{content}</strong>;
    if (token.type === "em") return <em key={index}>{content}</em>;
    if (token.type === "codespan") return <code key={index}>{token.text}</code>;
    if (token.type === "br") return <br key={index} />;
    if (token.type === "link") {
      try {
        const url = new URL(token.href, "https://unhaine.com");
        if (
          url.origin === "https://unhaine.com" &&
          url.pathname === "/" &&
          SITE_ROUTE.test(url.hash.slice(1))
        ) {
          return (
            <Link key={index} to={url.hash.slice(1)} onClick={onNavigate}>
              {content}
            </Link>
          );
        }
      } catch {
        /* Unsupported links remain plain text. */
      }
    }
    return <span key={index}>{content}</span>;
  });
}

function blocks(tokens, onNavigate) {
  return tokens.map((token, index) => {
    if (token.type === "space") return null;
    if (["paragraph", "heading", "text"].includes(token.type))
      return (
        <p key={index}>{inline(token.tokens || [{ text: token.text }], onNavigate)}</p>
      );
    if (token.type === "list") {
      const List = token.ordered ? "ol" : "ul";
      return (
        <List key={index}>
          {token.items.map((item, i) => (
            <li key={i}>{blocks(item.tokens, onNavigate)}</li>
          ))}
        </List>
      );
    }
    if (token.type === "code")
      return (
        <pre key={index}>
          <code>{token.text}</code>
        </pre>
      );
    if (token.type === "blockquote")
      return <blockquote key={index}>{blocks(token.tokens, onNavigate)}</blockquote>;
    return <p key={index}>{token.text || token.raw}</p>;
  });
}

export default function ChatMessage({ text, onNavigate }) {
  // Model output is untrusted: render React nodes, never raw HTML.
  // GFM's single-tilde deletion rule otherwise eats Korean ranges such as 1~2일 / 3~4시간.
  return <div className="chat-markdown">{blocks(marked.lexer(text, { gfm: false }), onNavigate)}</div>;
}
