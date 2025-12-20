import { splitProps, Show, type JSX, type ParentProps, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Button } from "@repo/solid-ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/solid-ui/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { X } from "lucide-solid";

export type ArtifactProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Artifact(props: ArtifactProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type ArtifactHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ArtifactHeader(props: ArtifactHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "flex items-center justify-between border-b bg-muted/50 px-4 py-3",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type ArtifactCloseProps = Parameters<typeof Button>[0];

export function ArtifactClose(props: ArtifactCloseProps) {
  const [local, others] = splitProps(props, ["class", "children", "size", "variant"]);

  return (
    <Button
      class={cn(
        "size-8 p-0 text-muted-foreground hover:text-foreground",
        local.class
      )}
      size={local.size ?? "sm"}
      type="button"
      variant={local.variant ?? "ghost"}
      {...others}
    >
      {local.children ?? <X class="size-4" />}
      <span class="sr-only">Close</span>
    </Button>
  );
}

export type ArtifactTitleProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export function ArtifactTitle(props: ArtifactTitleProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <p class={cn("font-medium text-foreground text-sm", local.class)} {...others}>
      {local.children}
    </p>
  );
}

export type ArtifactDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export function ArtifactDescription(props: ArtifactDescriptionProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <p class={cn("text-muted-foreground text-sm", local.class)} {...others}>
      {local.children}
    </p>
  );
}

export type ArtifactActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ArtifactActions(props: ArtifactActionsProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex items-center gap-1", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export type ArtifactActionProps = Parameters<typeof Button>[0] & {
  tooltip?: string;
  label?: string;
  icon?: Component<{ class?: string }>;
};

export function ArtifactAction(props: ArtifactActionProps) {
  const [local, others] = splitProps(props, [
    "tooltip",
    "label",
    "icon",
    "children",
    "class",
    "size",
    "variant",
  ]);

  const button = (
    <Button
      class={cn(
        "size-8 p-0 text-muted-foreground hover:text-foreground",
        local.class
      )}
      size={local.size ?? "sm"}
      type="button"
      variant={local.variant ?? "ghost"}
      {...others}
    >
      <Show when={local.icon} fallback={local.children}>
        <Dynamic component={local.icon} class="size-4" />
      </Show>
      <span class="sr-only">{local.label || local.tooltip}</span>
    </Button>
  );

  return (
    <Show when={local.tooltip} fallback={button}>
      <Tooltip>
        <TooltipTrigger as="span">{button}</TooltipTrigger>
        <TooltipContent>
          <p>{local.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </Show>
  );
}

export type ArtifactContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ArtifactContent(props: ArtifactContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex-1 overflow-auto p-4", local.class)} {...others}>
      {local.children}
    </div>
  );
}
