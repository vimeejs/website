import { use, useState, useCallback, useRef, useEffect } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";
import "@vimee/shiki-editor/styles.css";

const highlighterPromise = createHighlighter({
  themes: ["catppuccin-mocha"],
  langs: ["typescript"],
});

const initialContent = `import { use } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";
import "@vimee/shiki-editor/styles.css";

const highlighterPromise = createHighlighter({
  themes: ["github-dark"],
  langs: ["typescript"],
});

function App() {
  const highlighter = use(highlighterPromise);

  return (
    <Vim
      content="const hello = 'world';"
      highlighter={highlighter}
      lang="typescript"
      theme="github-dark"
      onChange={(content) => console.log(content)}
    />
  );
}`;

export default function LiveDemo() {
  const highlighter = use(highlighterPromise);
  const [content, setContent] = useState(initialContent);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYank = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text/plain");
      if (text) {
        e.preventDefault();
        setContent(text);
        setKey((k) => k + 1); // Force re-mount to reset Vim state with new content
      }
    };

    container.addEventListener("paste", handlePaste);
    return () => container.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div ref={containerRef}>
      <Vim
        key={key}
        content={content}
        highlighter={highlighter}
        lang="typescript"
        theme="catppuccin-mocha"
        showLineNumbers={true}
        autoFocus={false}
        onYank={handleYank}
        onChange={setContent}
      />
    </div>
  );
}
