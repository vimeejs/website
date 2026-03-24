import { use } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";
import "@vimee/shiki-editor/styles.css";

const highlighterPromise = createHighlighter({
  themes: ["catppuccin-mocha"],
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
      theme="catppuccin-mocha"
      showLineNumbers={true}
      autoFocus={false}
    />
  );
}
