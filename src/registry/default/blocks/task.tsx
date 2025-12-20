import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { ChevronDownIcon, SearchIcon } from "lucide-solid";
import { type JSX, type ParentProps, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export type TaskItemFileProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function TaskItemFile(props: TaskItemFileProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <div
      class={cn(
        "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-foreground text-xs",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type TaskItemProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function TaskItem(props: TaskItemProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <div class={cn("text-muted-foreground text-sm", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export type TaskProps = Parameters<typeof Collapsible>[0];

export function Task(props: TaskProps) {
  const [local, others] = splitProps(props, ["defaultOpen", "class"]);

  return (
    <Collapsible
      class={cn(local.class)}
      defaultOpen={local.defaultOpen ?? true}
      {...others}
    />
  );
}

export type TaskTriggerProps = Parameters<typeof CollapsibleTrigger>[0] & {
  title: string;
};

export function TaskTrigger(props: TaskTriggerProps) {
  const [local, others] = splitProps(props, ["children", "class", "title"]);

  return (
    <CollapsibleTrigger class={cn("group", local.class)} {...others}>
      {local.children ?? (
        <div class="flex w-full cursor-pointer items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground">
          <SearchIcon class="size-4" />
          <p class="text-sm">{local.title}</p>
          <ChevronDownIcon class="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </div>
      )}
    </CollapsibleTrigger>
  );
}

export type TaskContentProps = Parameters<typeof CollapsibleContent>[0];

export function TaskContent(props: TaskContentProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <CollapsibleContent
      class={cn(
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      <div class="mt-4 space-y-2 border-muted border-l-2 pl-4">
        {local.children}
      </div>
    </CollapsibleContent>
  );
}
