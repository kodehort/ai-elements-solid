import type { Component } from "solid-js";

export interface PageMeta {
  title: string;
  description?: string;
  path?: string;
}

export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export interface DocPage {
  slug: string;
  meta: PageMeta;
  Content: Component;
}

// Navigation structure with all components
export const navigation: NavItem[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Usage", href: "/docs/usage" },
  { title: "Troubleshooting", href: "/docs/troubleshooting" },
  { title: "MCP", href: "/docs/mcp" },
  {
    title: "Examples",
    href: "/examples",
    items: [
      { title: "ChatGPT Clone", href: "/docs/components/demo-chatgpt" },
      { title: "Claude Clone", href: "/docs/components/demo-claude" },
      { title: "v0 Clone", href: "/docs/components/v0-clone" },
    ],
  },
  {
    title: "Chatbot Components",
    href: "/docs/components/conversation",
    items: [
      { title: "Chain of Thought", href: "/docs/components/chain-of-thought" },
      { title: "Checkpoint", href: "/docs/components/checkpoint" },
      { title: "Confirmation", href: "/docs/components/confirmation" },
      { title: "Context", href: "/docs/components/context" },
      { title: "Conversation", href: "/docs/components/conversation" },
      { title: "Inline Citation", href: "/docs/components/inline-citation" },
      { title: "Message", href: "/docs/components/message" },
      { title: "Model Selector", href: "/docs/components/model-selector" },
      { title: "Plan", href: "/docs/components/plan" },
      { title: "Prompt Input", href: "/docs/components/prompt-input" },
      { title: "Queue", href: "/docs/components/queue" },
      { title: "Reasoning", href: "/docs/components/reasoning" },
      { title: "Shimmer", href: "/docs/components/shimmer" },
      { title: "Sources", href: "/docs/components/sources" },
      { title: "Suggestion", href: "/docs/components/suggestion" },
      { title: "Task", href: "/docs/components/task" },
      { title: "Tool", href: "/docs/components/tool" },
    ],
  },
  {
    title: "Vibe Coding",
    href: "/docs/components/artifact",
    items: [
      { title: "Artifact", href: "/docs/components/artifact" },
      { title: "Web Preview", href: "/docs/components/web-preview" },
    ],
  },
  {
    title: "Utilities",
    href: "/docs/components/code-block",
    items: [
      { title: "Code Block", href: "/docs/components/code-block" },
      { title: "Image", href: "/docs/components/image" },
      { title: "Loader", href: "/docs/components/loader" },
    ],
  },
  {
    title: "Documentation",
    href: "/docs/components/open-in-chat",
    items: [{ title: "Open in Chat", href: "/docs/components/open-in-chat" }],
  },
];

// Helper to find current page in navigation
export function findNavItem(href: string): NavItem | undefined {
  for (const item of navigation) {
    if (item.href === href) {
      return item;
    }
    if (item.items) {
      const found = item.items.find((sub) => sub.href === href);
      if (found) {
        return found;
      }
    }
  }
  return;
}

// Get previous and next pages for navigation
export function getPageNavigation(href: string): {
  prev?: NavItem;
  next?: NavItem;
} {
  const flatNav: NavItem[] = [];
  for (const item of navigation) {
    flatNav.push(item);
    if (item.items) {
      flatNav.push(...item.items);
    }
  }

  const index = flatNav.findIndex((item) => item.href === href);
  return {
    prev: index > 0 ? flatNav[index - 1] : undefined,
    next: index < flatNav.length - 1 ? flatNav[index + 1] : undefined,
  };
}
