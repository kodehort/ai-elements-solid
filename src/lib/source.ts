import generatedNav from "./generated-nav.json";

export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

// Build navigation from generated JSON
export const navigation: NavItem[] = [
  { title: "Introduction", href: "/docs" },
  { title: "Usage", href: "/docs/usage" },
  { title: "Troubleshooting", href: "/docs/troubleshooting" },
  { title: "MCP", href: "/docs/mcp" },
  {
    title: "Examples",
    href: "/docs/examples",
    items: generatedNav.examples.map((e) => ({ title: e.title, href: e.href })),
  },
  {
    title: "Chatbot Components",
    href: "/docs/components/conversation",
    items: generatedNav.components.chatbot.map((c) => ({
      title: c.title,
      href: c.href,
    })),
  },
  {
    title: "Vibe Coding",
    href: "/docs/components/artifact",
    items: generatedNav.components.vibe.map((c) => ({
      title: c.title,
      href: c.href,
    })),
  },
  {
    title: "Utilities",
    href: "/docs/components/code-block",
    items: generatedNav.components.utility.map((c) => ({
      title: c.title,
      href: c.href,
    })),
  },
  {
    title: "Documentation",
    href: "/docs/components/open-in-chat",
    items: generatedNav.components.docs.map((c) => ({
      title: c.title,
      href: c.href,
    })),
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
