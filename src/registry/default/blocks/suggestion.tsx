import { Button } from "@repo/solid-ui/components/ui/button";
import {
  ScrollArea,
  ScrollBar,
} from "@repo/solid-ui/components/ui/scroll-area";
import { type ParentProps, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export type SuggestionsProps = ParentProps<Parameters<typeof ScrollArea>[0]>;

export function Suggestions(props: SuggestionsProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <ScrollArea class="w-full overflow-x-auto whitespace-nowrap" {...others}>
      <div class={cn("flex w-max flex-nowrap items-center gap-2", local.class)}>
        {local.children}
      </div>
      <ScrollBar class="hidden" orientation="horizontal" />
    </ScrollArea>
  );
}

export type SuggestionProps = Omit<Parameters<typeof Button>[0], "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export function Suggestion(props: SuggestionProps) {
  const [local, others] = splitProps(props, [
    "suggestion",
    "onClick",
    "class",
    "variant",
    "size",
    "children",
  ]);

  const handleClick = () => {
    local.onClick?.(local.suggestion);
  };

  return (
    <Button
      class={cn("cursor-pointer rounded-full px-4", local.class)}
      onClick={handleClick}
      size={local.size ?? "sm"}
      type="button"
      variant={local.variant ?? "outline"}
      {...others}
    >
      {local.children || local.suggestion}
    </Button>
  );
}
