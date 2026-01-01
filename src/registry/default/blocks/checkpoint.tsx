import { Button } from "@repo/solid-ui/components/ui/button";
import { Separator } from "@repo/solid-ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/solid-ui/components/ui/tooltip";
import { BookmarkIcon } from "lucide-solid";
import { type JSX, type ParentProps, Show, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export type CheckpointProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function Checkpoint(props: CheckpointProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "flex items-center gap-0.5 overflow-hidden text-muted-foreground",
        local.class
      )}
      {...others}
    >
      {local.children}
      <Separator />
    </div>
  );
}

export type CheckpointIconProps = ParentProps<
  JSX.SvgSVGAttributes<SVGSVGElement>
>;

export function CheckpointIcon(props: CheckpointIconProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Show fallback={local.children} when={!local.children}>
      <BookmarkIcon class={cn("size-4 shrink-0", local.class)} {...others} />
    </Show>
  );
}

export type CheckpointTriggerProps = Parameters<typeof Button>[0] & {
  tooltip?: string;
};

export function CheckpointTrigger(props: CheckpointTriggerProps) {
  const [local, others] = splitProps(props, [
    "children",
    "class",
    "variant",
    "size",
    "tooltip",
  ]);

  return (
    <Show
      fallback={
        <Button
          size={local.size ?? "sm"}
          type="button"
          variant={local.variant ?? "ghost"}
          {...others}
        >
          {local.children}
        </Button>
      }
      when={local.tooltip}
    >
      <Tooltip>
        <TooltipTrigger
          as={Button}
          size={local.size ?? "sm"}
          type="button"
          variant={local.variant ?? "ghost"}
          {...others}
        >
          {local.children}
        </TooltipTrigger>
        <TooltipContent align="start" side="bottom">
          {local.tooltip}
        </TooltipContent>
      </Tooltip>
    </Show>
  );
}
