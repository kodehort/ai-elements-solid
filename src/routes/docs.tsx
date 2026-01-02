import { type ParentProps } from "solid-js";
import { DocsLayout } from "@/components/layout";

export default function DocsLayoutWrapper(props: ParentProps) {
  return (
    <DocsLayout>
      <div class="container py-6">
        <article class="prose prose-neutral dark:prose-invert max-w-3xl">
          {props.children}
        </article>
      </div>
    </DocsLayout>
  );
}
