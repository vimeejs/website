import { use } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";
import "@vimee/shiki-editor/styles.css";

const highlighterPromise = createHighlighter({
  themes: ["github-dark"],
  langs: ["typescript"],
});

const defaultContent = `import { useVim } from "@vimee/react";

function Editor() {
  const { content, cursor, mode, handleKeyDown } = useVim({
    content: "Hello, vimee!",
  });

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <pre>{content}</pre>
      <span>Mode: {mode}</span>
    </div>
  );
}`;

export default function LiveDemo() {
  const highlighter = use(highlighterPromise);

  return (
    <Vim
      content={defaultContent}
      highlighter={highlighter}
      lang="typescript"
      theme="github-dark"
      showLineNumbers={true}
      autoFocus={false}
    />
  );
}
