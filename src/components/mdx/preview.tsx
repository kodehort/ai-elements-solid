import { type Component, lazy, Suspense, ErrorBoundary, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

// Lazy load examples - add entries as examples are created
const examples: Record<string, () => Promise<{ default: Component }>> = {
  // Examples will be added as they're created in src/examples/
  // e.g., message: () => import("@/examples/message"),
};

interface PreviewProps {
  path: string;
  class?: string;
}

export function Preview(props: PreviewProps) {
  const Example = () => {
    const loader = examples[props.path];
    if (!loader) return undefined;
    return lazy(loader);
  };

  return (
    <div class="my-6 rounded-lg border bg-background p-6">
      <ErrorBoundary
        fallback={(err) => (
          <div class="text-destructive text-sm">Error: {err.message}</div>
        )}
      >
        <Suspense
          fallback={
            <div class="text-muted-foreground text-sm">Loading example...</div>
          }
        >
          <Show
            when={Example()}
            fallback={
              <div class="text-muted-foreground text-sm">
                No live preview available for "{props.path}"
              </div>
            }
          >
            {(LazyComponent) => <Dynamic component={LazyComponent()} />}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
