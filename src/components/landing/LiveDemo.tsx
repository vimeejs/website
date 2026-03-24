import { use, useState, useCallback } from "react";
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

  const handleYank = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      e.preventDefault();
      setContent(text);
      setKey((k) => k + 1);
    }
  }, []);

  return (
    <div onPaste={handlePaste}>
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
