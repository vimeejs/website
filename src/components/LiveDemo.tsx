import { useState, useEffect } from "react";
import { Vim } from "@vimee/shiki-editor";
import "@vimee/shiki-editor/styles.css";
import { createHighlighter } from "shiki";
import type { Highlighter } from "shiki";

const DEFAULT_CONTENT = `import {
  processKeystroke,
  createInitialContext,
  TextBuffer,
  type VimAction,
  type VimContext,
} from "@vimee/core";

// Create a text buffer with initial content
const buffer = new TextBuffer("Hello, Vim!");
let ctx: VimContext = createInitialContext({ line: 0, col: 0 });

// Process keystrokes — pure function, no side effects
function handleKey(key: string): VimAction[] {
  const result = processKeystroke(key, ctx, buffer);
  ctx = result.newCtx;
  return result.actions;
}

// Every action is a discriminated union
function applyActions(actions: VimAction[]) {
  for (const action of actions) {
    switch (action.type) {
      case "cursor-move":
        console.log(\`Cursor: \${action.position.line}:\${action.position.col}\`);
        break;
      case "content-change":
        console.log(\`Content updated: \${action.content.length} chars\`);
        break;
      case "mode-change":
        console.log(\`Mode: \${action.mode}\`);
        break;
      case "yank":
        console.log(\`Yanked: \${action.text}\`);
        break;
      case "save":
        console.log("Saved!");
        break;
    }
  }
}

// Try these Vim commands:
//   hjkl  - move cursor
//   dd    - delete line
//   yy    - yank line
//   p     - paste
//   ciw   - change inner word
//   /     - search
//   gg    - jump to top
//   G     - jump to bottom
//   :w    - save

const actions = handleKey("dd");
applyActions(actions);
`;

export default function LiveDemo() {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    createHighlighter({
      themes: ["catppuccin-mocha"],
      langs: ["typescript"],
    }).then(setHighlighter);
  }, []);

  if (!highlighter) {
    return (
      <div className="rounded-xl border border-border-subtle overflow-hidden bg-[#1e1e2e] max-w-4xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-text-primary/40 font-mono text-sm">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden bg-[#1e1e2e] max-w-4xl mx-auto h-[500px]">
      <Vim
        content={DEFAULT_CONTENT}
        highlighter={highlighter}
        lang="typescript"
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
