import { use, Suspense } from "react";
import { Vim } from "@vimee/shiki-editor";
import "@vimee/shiki-editor/styles.css";
import { createHighlighter } from "shiki";

const CODE = `import { use } from "react";
import { Vim } from "@vimee/shiki-editor";
import { createHighlighter } from "shiki";

const highlighter = createHighlighter({
  themes: ["catppuccin-mocha"],
  langs: ["typescript"],
});

export default function Editor() {
  const hl = use(highlighter);

  return (
    <Vim
      content="const greeting: string = 'Hello, Vim!';"
      highlighter={hl}
      lang="typescript"
      theme="catppuccin-mocha"
    />
  );
}`;

const highlighterPromise = createHighlighter({
  themes: ["catppuccin-mocha"],
  langs: ["tsx"],
});

function Editor() {
  const highlighter = use(highlighterPromise);

  return (
    <div className="min-h-[320px]">
      <Vim
        content={CODE}
        highlighter={highlighter}
        lang="tsx"
        theme="catppuccin-mocha"
        showLineNumbers
        autoFocus={false}
        indentStyle="space"
        indentWidth={2}
        onYank={(text) => navigator.clipboard.writeText(text)}
      />
    </div>
  );
}

export default function QuickStartEditor() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[320px] flex items-center justify-center">
          <span className="animate-pulse text-text-primary/40 font-mono text-sm">
            Loading editor...
          </span>
        </div>
      }
    >
      <Editor />
    </Suspense>
  );
}
