import { Button } from "@repo/solid-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { ScrollArea } from "@repo/solid-ui/components/ui/scroll-area";
import { ChevronDownIcon, PaperclipIcon } from "lucide-solid";
import { type JSX, type ParentProps, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export interface QueueMessagePart {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
}

export interface QueueMessage {
  id: string;
  parts: QueueMessagePart[];
}

export interface QueueTodo {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}

export type QueueItemProps = JSX.LiHTMLAttributes<HTMLLIElement>;

export function QueueItem(props: QueueItemProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <li
      class={cn(
        "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted",
        local.class
      )}
      {...others}
    />
  );
}

export type QueueItemIndicatorProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  completed?: boolean;
};

export function QueueItemIndicator(props: QueueItemIndicatorProps) {
  const [local, others] = splitProps(props, ["completed", "class"]);

  return (
    <span
      class={cn(
        "mt-0.5 inline-block size-2.5 rounded-full border",
        local.completed
          ? "border-muted-foreground/20 bg-muted-foreground/10"
          : "border-muted-foreground/50",
        local.class
      )}
      {...others}
    />
  );
}

export type QueueItemContentProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  completed?: boolean;
};

export function QueueItemContent(props: QueueItemContentProps) {
  const [local, others] = splitProps(props, ["completed", "class"]);

  return (
    <span
      class={cn(
        "line-clamp-1 grow break-words",
        local.completed
          ? "text-muted-foreground/50 line-through"
          : "text-muted-foreground",
        local.class
      )}
      {...others}
    />
  );
}

export type QueueItemDescriptionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  completed?: boolean;
};

export function QueueItemDescription(props: QueueItemDescriptionProps) {
  const [local, others] = splitProps(props, ["completed", "class"]);

  return (
    <div
      class={cn(
        "ml-6 text-xs",
        local.completed
          ? "text-muted-foreground/40 line-through"
          : "text-muted-foreground",
        local.class
      )}
      {...others}
    />
  );
}

export type QueueItemActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export function QueueItemActions(props: QueueItemActionsProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <div class={cn("flex gap-1", local.class)} {...others} />;
}

export type QueueItemActionProps = Omit<
  Parameters<typeof Button>[0],
  "variant" | "size"
>;

export function QueueItemAction(props: QueueItemActionProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Button
      class={cn(
        "size-auto rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted-foreground/10 hover:text-foreground group-hover:opacity-100",
        local.class
      )}
      size="icon"
      type="button"
      variant="ghost"
      {...others}
    />
  );
}

export type QueueItemAttachmentProps = JSX.HTMLAttributes<HTMLDivElement>;

export function QueueItemAttachment(props: QueueItemAttachmentProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div class={cn("mt-1 flex flex-wrap gap-2", local.class)} {...others} />
  );
}

export type QueueItemImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

export function QueueItemImage(props: QueueItemImageProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <img
      alt=""
      class={cn("h-8 w-8 rounded border object-cover", local.class)}
      height={32}
      width={32}
      {...others}
    />
  );
}

export type QueueItemFileProps = ParentProps<
  JSX.HTMLAttributes<HTMLSpanElement>
>;

export function QueueItemFile(props: QueueItemFileProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <span
      class={cn(
        "flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs",
        local.class
      )}
      {...others}
    >
      <PaperclipIcon size={12} />
      <span class="max-w-[100px] truncate">{local.children}</span>
    </span>
  );
}

export type QueueListProps = Parameters<typeof ScrollArea>[0];

export function QueueList(props: QueueListProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <ScrollArea class={cn("mt-2 -mb-1", local.class)} {...others}>
      <div class="max-h-40 pr-4">
        <ul>{local.children}</ul>
      </div>
    </ScrollArea>
  );
}

export type QueueSectionProps = Parameters<typeof Collapsible>[0];

export function QueueSection(props: QueueSectionProps) {
  const [local, others] = splitProps(props, ["class", "defaultOpen"]);

  return (
    <Collapsible
      class={cn(local.class)}
      defaultOpen={local.defaultOpen ?? true}
      {...others}
    />
  );
}

export type QueueSectionTriggerProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
>;

export function QueueSectionTrigger(props: QueueSectionTriggerProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <CollapsibleTrigger
      as="button"
      class={cn(
        "group flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-muted",
        local.class
      )}
      type="button"
      {...others}
    >
      {local.children}
    </CollapsibleTrigger>
  );
}

export type QueueSectionLabelProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  count?: number;
  label: string;
  icon?: JSX.Element;
};

export function QueueSectionLabel(props: QueueSectionLabelProps) {
  const [local, others] = splitProps(props, [
    "count",
    "label",
    "icon",
    "class",
  ]);

  return (
    <span class={cn("flex items-center gap-2", local.class)} {...others}>
      <ChevronDownIcon class="size-4 transition-transform group-data-[state=closed]:-rotate-90" />
      {local.icon}
      <span>
        {local.count} {local.label}
      </span>
    </span>
  );
}

export type QueueSectionContentProps = Parameters<typeof CollapsibleContent>[0];

export function QueueSectionContent(props: QueueSectionContentProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <CollapsibleContent class={cn(local.class)} {...others} />;
}

export type QueueProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Queue(props: QueueProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-xs",
        local.class
      )}
      {...others}
    />
  );
}
