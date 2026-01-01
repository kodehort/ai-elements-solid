import { useParams } from "@solidjs/router";
import {
  type Component,
  createMemo,
  ErrorBoundary,
  For,
  lazy,
  Show,
  Suspense,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { DocsLayout } from "@/components/layout";

// Load examples from packages/examples/src/
const examples = import.meta.glob(
  "../../../../../../packages/examples/src/*.tsx"
);

// Load MDX content from content/docs/components/
const mdxContent = import.meta.glob("../../../content/docs/components/*.mdx");

const componentMeta: Record<string, { title: string; description: string }> = {
  // Chatbot Components
  conversation: {
    title: "Conversation",
    description: "Container for chat messages with auto-scroll support.",
  },
  message: {
    title: "Message",
    description: "Message bubble with support for branching and attachments.",
  },
  "prompt-input": {
    title: "Prompt Input",
    description:
      "Rich text input with file attachments, speech input, and model selection.",
  },
  tool: {
    title: "Tool",
    description: "Tool call display with input/output and confirmation states.",
  },
  confirmation: {
    title: "Confirmation",
    description: "Approval request UI for tool execution confirmation.",
  },
  reasoning: {
    title: "Reasoning",
    description:
      "Chain-of-thought and reasoning display with streaming support.",
  },
  "chain-of-thought": {
    title: "Chain of Thought",
    description: "Step-by-step reasoning visualization with search results.",
  },
  sources: {
    title: "Sources",
    description: "Citation and reference display for AI responses.",
  },
  "inline-citation": {
    title: "Inline Citation",
    description: "Inline citation badges with hover preview.",
  },
  context: {
    title: "Context",
    description: "Context token display with usage indicators.",
  },
  "model-selector": {
    title: "Model Selector",
    description: "Dropdown for selecting AI models with provider logos.",
  },
  suggestion: {
    title: "Suggestion",
    description: "Suggested prompts and quick actions.",
  },
  checkpoint: {
    title: "Checkpoint",
    description: "Checkpoint marker for conversation milestones.",
  },
  plan: {
    title: "Plan",
    description: "Display AI planning steps and progress.",
  },
  task: {
    title: "Task",
    description: "Task item with status and progress indicators.",
  },
  queue: {
    title: "Queue",
    description: "Message queue with pending items display.",
  },
  // Utility Components
  "code-block": {
    title: "Code Block",
    description: "Syntax-highlighted code block with copy functionality.",
  },
  artifact: {
    title: "Artifact",
    description: "Code artifact display with actions like run, copy, download.",
  },
  image: {
    title: "Image",
    description:
      "Image display component for AI-generated or referenced images.",
  },
  loader: {
    title: "Loader",
    description: "Loading indicator for AI responses.",
  },
  shimmer: {
    title: "Shimmer",
    description: "Shimmer loading animation for content placeholders.",
  },
  // Vibe Coding Components
  "web-preview": {
    title: "Web Preview",
    description:
      "Browser-like preview for web content with navigation controls.",
  },
  "open-in-chat": {
    title: "Open in Chat",
    description: "Dropdown to open content in various AI chat providers.",
  },
  // Demo Examples
  "demo-chatgpt": {
    title: "ChatGPT Clone",
    description: "A ChatGPT-style interface with messages and streaming.",
  },
  "demo-claude": {
    title: "Claude Clone",
    description: "An Anthropic Claude-style interface with reasoning.",
  },
  "v0-clone": {
    title: "v0 Clone",
    description:
      "Vercel v0-style interface with web preview and code generation.",
  },
};

// MDX Components for rendering documentation
function Preview(_props: { path: string }) {
  return null; // Preview is replaced by the live example below
}

function ElementsInstaller(props: { path: string }) {
  return (
    <div class="my-4">
      <pre class="overflow-x-auto rounded-lg bg-muted p-4">
        <code>
          npx shadcn@latest add https://ai-elements.vercel.app/r/{props.path}
        </code>
      </pre>
    </div>
  );
}

function TypeTable(props: {
  type: Record<string, { description: string; type: string; default?: string }>;
}) {
  return (
    <div class="my-4 overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b">
            <th class="px-3 py-2 text-left font-medium">Prop</th>
            <th class="px-3 py-2 text-left font-medium">Type</th>
            <th class="px-3 py-2 text-left font-medium">Default</th>
            <th class="px-3 py-2 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.entries(props.type)}>
            {([name, info]) => (
              <tr class="border-b">
                <td class="px-3 py-2 font-mono text-primary">{name}</td>
                <td class="px-3 py-2 font-mono text-muted-foreground">
                  {info.type}
                </td>
                <td class="px-3 py-2 font-mono text-muted-foreground">
                  {info.default || "-"}
                </td>
                <td class="px-3 py-2">{info.description}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

// Provide MDX components to the content
const mdxComponents = {
  Preview,
  ElementsInstaller,
  TypeTable,
};

export default function ComponentPage() {
  const params = useParams<{ component: string }>();

  const Example = createMemo(() => {
    const componentName = params.component;
    if (!componentName) {
      return;
    }

    const importPath = `../../../../../../packages/examples/src/${componentName}.tsx`;
    const importer = examples[importPath];

    if (!importer) {
      return;
    }

    return lazy(() => importer() as Promise<{ default: Component }>);
  });

  // Load MDX documentation content using same pattern as examples
  const MdxDoc = createMemo(() => {
    const componentName = params.component;
    if (!componentName) {
      return;
    }

    const importPath = `../../../content/docs/components/${componentName}.mdx`;
    const importer = mdxContent[importPath];

    if (!importer) {
      return;
    }

    return lazy(() => importer() as Promise<{ default: Component }>);
  });

  const meta = createMemo(() => {
    const componentName = params.component || "";
    return (
      componentMeta[componentName] || {
        title: componentName
          .split("-")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        description: `AI-powered ${componentName.replace(/-/g, " ")} component.`,
      }
    );
  });

  return (
    <DocsLayout>
      <div class="space-y-6">
        <div>
          <h1 class="font-bold text-3xl tracking-tight">{meta().title}</h1>
          <p class="mt-2 text-muted-foreground">{meta().description}</p>
        </div>

        {/* Live Example */}
        <div>
          <h2 class="mb-4 font-semibold text-xl">Example</h2>
          <div class="rounded-lg border bg-background p-6">
            <ErrorBoundary
              fallback={(err) => (
                <div class="text-destructive">
                  Error loading example: {err.message}
                </div>
              )}
            >
              <Suspense
                fallback={
                  <div class="text-muted-foreground">Loading example...</div>
                }
              >
                <Show
                  fallback={
                    <div class="text-muted-foreground">
                      No example available for this component.
                    </div>
                  }
                  when={Example()}
                >
                  {(LazyComponent) => <Dynamic component={LazyComponent()} />}
                </Show>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* MDX Documentation */}
        <ErrorBoundary
          fallback={(_err) => (
            <div class="text-destructive text-sm">
              Documentation loading error
            </div>
          )}
        >
          <Suspense
            fallback={
              <div class="text-muted-foreground text-sm">
                Loading documentation...
              </div>
            }
          >
            <Show when={MdxDoc()}>
              {(LazyMdx) => (
                <div class="prose prose-neutral dark:prose-invert max-w-none">
                  <Dynamic component={LazyMdx()} components={mdxComponents} />
                </div>
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </div>
    </DocsLayout>
  );
}
