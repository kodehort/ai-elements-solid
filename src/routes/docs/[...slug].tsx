import { A, useParams } from "@solidjs/router";
import { createMemo, type JSX, Show } from "solid-js";
import { DocsLayout } from "@/components/layout";
import { findNavItem, getPageNavigation } from "@/lib/source";

// Static content for each page
const pageContent: Record<
  string,
  { title: string; description: string; content: () => JSX.Element }
> = {
  usage: {
    title: "Usage",
    description:
      "How to use AI Elements components in your SolidJS application.",
    content: () => (
      <>
        <h2>Installation</h2>
        <p>
          AI Elements components can be installed using the shadcn/ui CLI or by
          copying the component code directly into your project.
        </p>
        <h2>Basic Usage</h2>
        <p>
          Import the component you need and use it in your SolidJS application:
        </p>
        <pre class="overflow-x-auto rounded-lg bg-muted p-4">
          <code>{`import { Conversation, Message } from "@/components/ai-elements";

function Chat() {
  return (
    <Conversation>
      <Message role="user">Hello!</Message>
      <Message role="assistant">Hi there!</Message>
    </Conversation>
  );
}`}</code>
        </pre>
      </>
    ),
  },
  troubleshooting: {
    title: "Troubleshooting",
    description: "Common issues and solutions when using AI Elements.",
    content: () => (
      <>
        <h2>Common Issues</h2>
        <h3>Component not rendering</h3>
        <p>
          Make sure you have installed all peer dependencies and configured
          Tailwind CSS correctly.
        </p>
        <h3>Styles not applying</h3>
        <p>
          Ensure your Tailwind configuration includes the AI Elements component
          paths in the content array.
        </p>
      </>
    ),
  },
  mcp: {
    title: "MCP",
    description: "Model Context Protocol integration with AI Elements.",
    content: () => (
      <>
        <h2>About MCP</h2>
        <p>
          The Model Context Protocol (MCP) allows AI models to interact with
          external tools and services. AI Elements provides components that work
          seamlessly with MCP-enabled applications.
        </p>
      </>
    ),
  },
  "components/conversation": {
    title: "Conversation",
    description: "A container component for chat messages.",
    content: () => (
      <>
        <h2>Overview</h2>
        <p>
          The Conversation component provides a scrollable container for chat
          messages with automatic scroll-to-bottom behavior.
        </p>
        <h2>Usage</h2>
        <pre class="overflow-x-auto rounded-lg bg-muted p-4">
          <code>{`import { Conversation, Message } from "@/components/ai-elements";

<Conversation>
  <Message role="user">Hello!</Message>
  <Message role="assistant">Hi there!</Message>
</Conversation>`}</code>
        </pre>
      </>
    ),
  },
  "components/code-block": {
    title: "Code Block",
    description: "Syntax-highlighted code display component.",
    content: () => (
      <>
        <h2>Overview</h2>
        <p>
          The Code Block component displays code with syntax highlighting and
          optional copy functionality.
        </p>
        <h2>Usage</h2>
        <pre class="overflow-x-auto rounded-lg bg-muted p-4">
          <code>{`import { CodeBlock } from "@/components/ai-elements";

<CodeBlock language="typescript">
  const greeting = "Hello, World!";
</CodeBlock>`}</code>
        </pre>
      </>
    ),
  },
  "components/loader": {
    title: "Loader",
    description: "Loading indicator component.",
    content: () => (
      <>
        <h2>Overview</h2>
        <p>
          The Loader component displays a spinning indicator for loading states.
        </p>
        <h2>Usage</h2>
        <pre class="overflow-x-auto rounded-lg bg-muted p-4">
          <code>{`import { Loader } from "@/components/ai-elements";

<Loader size={32} />`}</code>
        </pre>
      </>
    ),
  },
  "components/shimmer": {
    title: "Shimmer",
    description: "Animated placeholder component.",
    content: () => (
      <>
        <h2>Overview</h2>
        <p>
          The Shimmer component provides an animated loading placeholder effect.
        </p>
        <h2>Usage</h2>
        <pre class="overflow-x-auto rounded-lg bg-muted p-4">
          <code>{`import { Shimmer } from "@/components/ai-elements";

<Shimmer>Loading content...</Shimmer>`}</code>
        </pre>
      </>
    ),
  },
};

export default function DocPage() {
  const params = useParams();

  const slug = createMemo(() => params.slug || "");
  const page = createMemo(() => pageContent[slug()]);
  const _currentPage = createMemo(() => findNavItem(`/docs/${slug()}`));
  const pageNav = createMemo(() => getPageNavigation(`/docs/${slug()}`));

  return (
    <DocsLayout>
      <Show
        fallback={
          <div class="py-12 text-center">
            <h1 class="mb-4 font-bold text-2xl">Page Not Found</h1>
            <p class="mb-4 text-muted-foreground">
              The requested documentation page could not be found.
            </p>
            <A
              class="mt-4 inline-block text-primary hover:underline"
              href="/docs"
            >
              Go to Documentation
            </A>
          </div>
        }
        when={page()}
      >
        {(pageData) => (
          <article class="max-w-3xl">
            <div class="mb-8">
              <h1 class="mb-2 font-bold text-4xl tracking-tight">
                {pageData().title}
              </h1>
              <p class="text-lg text-muted-foreground">
                {pageData().description}
              </p>
            </div>

            <div class="prose prose-neutral dark:prose-invert max-w-none">
              {pageData().content()}
            </div>

            <nav class="mt-12 flex items-center justify-between border-t pt-6">
              <Show when={pageNav().prev}>
                {(prev) => (
                  <A
                    class="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={prev().href}
                  >
                    <span>&larr;</span>
                    <span>{prev().title}</span>
                  </A>
                )}
              </Show>
              <div class="flex-1" />
              <Show when={pageNav().next}>
                {(next) => (
                  <A
                    class="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
                    href={next().href}
                  >
                    <span>{next().title}</span>
                    <span>&rarr;</span>
                  </A>
                )}
              </Show>
            </nav>
          </article>
        )}
      </Show>
    </DocsLayout>
  );
}
