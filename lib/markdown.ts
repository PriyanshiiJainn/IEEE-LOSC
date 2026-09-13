/**
 * Helpers that make admin-authored text render on the public site exactly as it
 * was typed.
 *
 * Plain markdown normalises whitespace and swallows anything that looks like an
 * HTML tag, so text an admin typed could silently change or disappear. The two
 * helpers here close those gaps; `MarkdownContent` pairs them with
 * `white-space: pre-wrap` so runs of spaces and single newlines survive to the
 * page.
 */

/** Minimal shape of the mdast nodes we walk — mdast types aren't a dependency. */
type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
};

type ProcessorLike = {
  data: () => { micromarkExtensions?: unknown[] };
};

/** ``` or ~~~ opens/closes a fenced code block, whose contents are literal. */
const FENCE = /^\s*(```|~~~)/;

/**
 * Leading whitespace is real markdown syntax in front of these: a nested list
 * item, a quote, a heading. Those lines keep their true indentation.
 */
const BLOCK_MARKER = /^(?:[-*+][ \t]|\d+[.)][ \t]|>|#{1,6}[ \t])/;

const SPACES_PER_TAB = 4;

/**
 * Markdown strips the indentation off a line before rendering it, so text an
 * admin lined up by hand comes out flush left. Swapping leading spaces for
 * non-breaking spaces keeps that indentation visible without changing anything
 * else about the line.
 *
 * Lines inside a fenced code block are left alone (they are already literal),
 * as are lines whose indentation markdown needs — see BLOCK_MARKER.
 */
export function preserveIndentation(source: string): string {
  let inFence = false;

  return source
    .split("\n")
    .map((line) => {
      if (FENCE.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      const indent = /^[ \t]+/.exec(line);
      if (!indent) return line;

      const rest = line.slice(indent[0].length);
      if (!rest || BLOCK_MARKER.test(rest)) return line;

      return indent[0].replace(/\t/g, " ".repeat(SPACES_PER_TAB)).replace(/ /g, " ") + rest;
    })
    .join("\n");
}

/**
 * remark plugin: show anything that looks like an HTML tag as the literal text
 * that was typed.
 *
 * Without this, "we hit <100 signups" loses "<100 signups" entirely — markdown
 * reads it as a tag and react-markdown then drops it. Turning those nodes into
 * text keeps the characters on the page and still renders no HTML, so nothing
 * an admin types can inject markup.
 */
export function remarkHtmlAsText() {
  return (tree: MdNode) => {
    const walk = (node: MdNode, isRoot: boolean) => {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        if (child.type === "html") {
          const text: MdNode = { type: "text", value: child.value ?? "" };
          // A tag on its own line sits at the root, where a bare text node has
          // no paragraph to style; wrap it so it reads like any other line.
          return isRoot ? { type: "paragraph", children: [text] } : text;
        }
        walk(child, false);
        return child;
      });
    };

    walk(tree, true);
  };
}

/**
 * remark plugin: stop four leading spaces from turning a line into a grey code
 * block. Admins indent text to lay it out, not to write code, and the code
 * block was the most surprising thing markdown did to ordinary typing.
 * Fenced blocks (```) still work.
 */
export function remarkNoIndentedCode(this: unknown) {
  const data = (this as ProcessorLike).data();
  const extensions = data.micromarkExtensions ?? (data.micromarkExtensions = []);
  extensions.push({ disable: { null: ["codeIndented"] } });
}
