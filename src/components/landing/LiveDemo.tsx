import { use } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";
import "@vimee/shiki-editor/styles.css";

const highlighterPromise = createHighlighter({
  themes: ["catppuccin-mocha"],
  langs: ["typescript"],
});

const defaultContent = `import { use } from "react";
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
