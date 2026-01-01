import { A } from "@solidjs/router";
import { DocsLayout } from "@/components/layout";
import { getPageNavigation } from "@/lib/source";

export default function DocsIndexPage() {
  const pageNav = getPageNavigation("/docs");

  return (
    <DocsLayout>
      <article class="max-w-3xl">
        <div class="mb-8">
          <h1 class="mb-2 font-bold text-4xl tracking-tight">Introduction</h1>
          <p class="text-lg text-muted-foreground">
            What is AI Elements and why you should use it.
          </p>
        </div>

        <div class="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <a href="https://www.npmjs.com/package/ai-elements">AI Elements</a>{" "}
            is a component library and custom registry built on top of{" "}
            <a href="https://ui.shadcn.com/">shadcn/ui</a> to help you build
            AI-native applications faster. It provides pre-built components like
            conversations, messages and more.
          </p>
          <p>
            This is the <strong>SolidJS</strong> port of AI Elements, providing
            the same great components with SolidJS reactivity.
          </p>

          <h2>Quick Start</h2>
          <p>
            Here are some basic examples of what you can achieve using
            components from AI Elements.
          </p>

          <h2>Prerequisites</h2>
          <p>
            Before installing AI Elements, make sure your environment meets the
            following requirements:
          </p>
          <ul>
            <li>
              <a href="https://nodejs.org/en/download/">Node.js</a>, version 18
              or later
            </li>
            <li>
              A <a href="https://start.solidjs.com/">SolidStart</a> project with
              the <a href="https://ai-sdk.dev/">AI SDK</a> installed.
            </li>
            <li>
              <a href="https://ui.shadcn.com/">shadcn/ui</a> installed in your
              project.
            </li>
          </ul>

          <h2>Installing Components</h2>
          <p>
            You can install AI Elements components using the shadcn/ui CLI. The
            CLI will download the component's code and integrate it into your
            project's directory.
          </p>
        </div>

        <nav class="mt-12 flex items-center justify-between border-t pt-6">
          <div class="flex-1" />
          {pageNav.next && (
            <A
              class="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
              href={pageNav.next.href}
            >
              <span>{pageNav.next.title}</span>
              <span>&rarr;</span>
            </A>
          )}
        </nav>
      </article>
    </DocsLayout>
  );
}
