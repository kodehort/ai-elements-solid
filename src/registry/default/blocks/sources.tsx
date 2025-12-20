import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { BookIcon, ChevronDownIcon } from "lucide-solid";
import { type JSX, type ParentProps, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export type SourcesProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function Sources(props: SourcesProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Collapsible
      class={cn("not-prose mb-4 text-primary text-xs", local.class)}
      {...others}
    >
      {local.children}
    </Collapsible>
  );
}

export type SourcesTriggerProps = Parameters<typeof CollapsibleTrigger>[0] & {
  count: number;
};

export function SourcesTrigger(props: SourcesTriggerProps) {
  const [local, others] = splitProps(props, ["class", "count", "children"]);

  return (
    <CollapsibleTrigger
      class={cn("flex items-center gap-2", local.class)}
      {...others}
    >
      {local.children ?? (
        <>
          <p class="font-medium">Used {local.count} sources</p>
          <ChevronDownIcon class="h-4 w-4" />
        </>
      )}
    </CollapsibleTrigger>
  );
}

export type SourcesContentProps = Parameters<typeof CollapsibleContent>[0];

export function SourcesContent(props: SourcesContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CollapsibleContent
      class={cn(
        "mt-3 flex w-fit flex-col gap-2",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      {local.children}
    </CollapsibleContent>
  );
}

export type SourceProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Source(props: SourceProps) {
  const [local, others] = splitProps(props, ["href", "title", "children"]);

  return (
    <a
      class="flex items-center gap-2"
      href={local.href}
      rel="noreferrer"
      target="_blank"
      {...others}
    >
      {local.children ?? (
        <>
          <BookIcon class="h-4 w-4" />
          <span class="block font-medium">{local.title}</span>
        </>
      )}
    </a>
  );
}
