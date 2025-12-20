import { splitProps, type ParentProps, type JSX, Show } from "solid-js";
import { Button } from "@repo/solid-ui/components/ui/button";
import { Separator } from "@repo/solid-ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/solid-ui/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "lucide-solid";

export type CheckpointProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function Checkpoint(props: CheckpointProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn("flex items-center gap-0.5 text-muted-foreground overflow-hidden", local.class)}
      {...others}
    >
      {local.children}
      <Separator />
    </div>
  );
}

export type CheckpointIconProps = ParentProps<JSX.SvgSVGAttributes<SVGSVGElement>>;

export function CheckpointIcon(props: CheckpointIconProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Show when={!local.children} fallback={local.children}>
      <BookmarkIcon class={cn("size-4 shrink-0", local.class)} {...others} />
    </Show>
  );
}

export type CheckpointTriggerProps = Parameters<typeof Button>[0] & {
  tooltip?: string;
};

export function CheckpointTrigger(props: CheckpointTriggerProps) {
  const [local, others] = splitProps(props, ["children", "class", "variant", "size", "tooltip"]);

  return (
    <Show
      when={local.tooltip}
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
    >
      <Tooltip>
        <TooltipTrigger as={Button} size={local.size ?? "sm"} type="button" variant={local.variant ?? "ghost"} {...others}>
          {local.children}
        </TooltipTrigger>
        <TooltipContent align="start" side="bottom">
          {local.tooltip}
        </TooltipContent>
      </Tooltip>
    </Show>
  );
}
