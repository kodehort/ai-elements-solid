import { A } from "@solidjs/router";
import { For } from "solid-js";
import { DocsLayout } from "@/components/layout";

const components = [
  // Chatbot Components
  {
    name: "Conversation",
    description: "Container for chat messages with auto-scroll support.",
    href: "/docs/components/conversation",
    category: "chatbot",
  },
  {
    name: "Message",
    description: "Message bubble with support for branching and attachments.",
    href: "/docs/components/message",
    category: "chatbot",
  },
  {
    name: "PromptInput",
    description:
      "Rich text input with file attachments, speech input, and model selection.",
    href: "/docs/components/prompt-input",
    category: "chatbot",
  },
  {
    name: "Tool",
    description: "Tool call display with input/output and confirmation states.",
    href: "/docs/components/tool",
    category: "chatbot",
  },
  {
    name: "Confirmation",
    description: "Approval request UI for tool execution confirmation.",
    href: "/docs/components/confirmation",
    category: "chatbot",
  },
  {
    name: "Reasoning",
    description:
      "Chain-of-thought and reasoning display with streaming support.",
    href: "/docs/components/reasoning",
    category: "chatbot",
  },
  {
    name: "ChainOfThought",
    description: "Step-by-step reasoning visualization with search results.",
    href: "/docs/components/chain-of-thought",
    category: "chatbot",
  },
  {
    name: "Sources",
    description: "Citation and reference display for AI responses.",
    href: "/docs/components/sources",
    category: "chatbot",
  },
  {
    name: "InlineCitation",
    description: "Inline citation badges with hover preview.",
    href: "/docs/components/inline-citation",
    category: "chatbot",
  },
  {
    name: "Context",
    description: "Context token display with usage indicators.",
    href: "/docs/components/context",
    category: "chatbot",
  },
  {
    name: "ModelSelector",
    description: "Dropdown for selecting AI models with provider logos.",
    href: "/docs/components/model-selector",
    category: "chatbot",
  },
  {
    name: "Suggestion",
    description: "Suggested prompts and quick actions.",
    href: "/docs/components/suggestion",
    category: "chatbot",
  },
  {
    name: "Checkpoint",
    description: "Checkpoint marker for conversation milestones.",
    href: "/docs/components/checkpoint",
    category: "chatbot",
  },
  {
    name: "Plan",
    description: "Display AI planning steps and progress.",
    href: "/docs/components/plan",
    category: "chatbot",
  },
  {
    name: "Task",
    description: "Task item with status and progress indicators.",
    href: "/docs/components/task",
    category: "chatbot",
  },
  {
    name: "Queue",
    description: "Message queue with pending items display.",
    href: "/docs/components/queue",
    category: "chatbot",
  },
  // Utility Components
  {
    name: "CodeBlock",
    description: "Syntax-highlighted code block with copy functionality.",
    href: "/docs/components/code-block",
    category: "utility",
  },
  {
    name: "Artifact",
    description: "Code artifact display with actions like run, copy, download.",
    href: "/docs/components/artifact",
    category: "utility",
  },
  {
    name: "Image",
    description:
      "Image display component for AI-generated or referenced images.",
    href: "/docs/components/image",
    category: "utility",
  },
  {
    name: "Loader",
    description: "Loading indicator for AI responses.",
    href: "/docs/components/loader",
    category: "utility",
  },
  {
    name: "Shimmer",
    description: "Shimmer loading animation for content placeholders.",
    href: "/docs/components/shimmer",
    category: "utility",
  },
  // Vibe Coding Components
  {
    name: "WebPreview",
    description:
      "Browser-like preview for web content with navigation controls.",
    href: "/docs/components/web-preview",
    category: "vibe-coding",
  },
  {
    name: "OpenInChat",
    description: "Dropdown to open content in various AI chat providers.",
    href: "/docs/components/open-in-chat",
    category: "documentation",
  },
];

const categories = [
  {
    id: "chatbot",
    title: "Chatbot Components",
    description: "Core components for building AI chat interfaces.",
  },
  {
    id: "utility",
    title: "Utility Components",
    description: "Helper components for content display.",
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding",
    description: "Components for code generation and preview.",
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "Components for documentation sites.",
  },
];

export default function ComponentsPage() {
  return (
    <DocsLayout>
      <div class="space-y-8">
        <div>
          <h1 class="font-bold text-3xl tracking-tight">Components</h1>
          <p class="mt-2 text-muted-foreground">
            Browse all {components.length} AI Elements components for building
            AI-powered interfaces.
          </p>
        </div>

        <For each={categories}>
          {(category) => {
            const categoryComponents = components.filter(
              (c) => c.category === category.id
            );
            return (
              <div class="space-y-4">
                <div>
                  <h2 class="font-semibold text-xl">{category.title}</h2>
                  <p class="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <For each={categoryComponents}>
                    {(component) => (
                      <A
                        class="block rounded-lg border p-4 transition-colors hover:bg-muted"
                        href={component.href}
                      >
                        <h3 class="font-semibold">{component.name}</h3>
                        <p class="mt-1 text-muted-foreground text-sm">
                          {component.description}
                        </p>
                      </A>
                    )}
                  </For>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </DocsLayout>
  );
}
