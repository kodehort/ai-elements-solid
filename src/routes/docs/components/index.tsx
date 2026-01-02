import { A } from "@solidjs/router";
import { For } from "solid-js";
import generatedNav from "@/lib/generated-nav.json";

const categories = [
  {
    id: "chatbot",
    title: "Chatbot Components",
    description: "Core components for building AI chat interfaces.",
    items: generatedNav.components.chatbot,
  },
  {
    id: "vibe",
    title: "Vibe Coding",
    description: "Components for code generation and preview.",
    items: generatedNav.components.vibe,
  },
  {
    id: "utility",
    title: "Utility Components",
    description: "Helper components for content display.",
    items: generatedNav.components.utility,
  },
  {
    id: "docs",
    title: "Documentation",
    description: "Components for documentation sites.",
    items: generatedNav.components.docs,
  },
];

export default function ComponentsPage() {
  const totalComponents = generatedNav.components.all.length;

  return (
    <div class="space-y-8">
      <div>
        <h1 class="font-bold text-3xl tracking-tight">Components</h1>
        <p class="mt-2 text-muted-foreground">
          Browse all {totalComponents} AI Elements components for building
          AI-powered interfaces.
        </p>
      </div>

      <For each={categories}>
        {(category) => (
          <div class="space-y-4">
            <div>
              <h2 class="font-semibold text-xl">{category.title}</h2>
              <p class="text-muted-foreground text-sm">
                {category.description}
              </p>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <For each={category.items}>
                {(component) => (
                  <A
                    class="block rounded-lg border p-4 transition-colors hover:bg-muted"
                    href={component.href}
                  >
                    <h3 class="font-semibold">{component.title}</h3>
                  </A>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
