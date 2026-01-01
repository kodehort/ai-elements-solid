import { Badge } from "@repo/solid-ui/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { Brain, ChevronDown, Dot, type LucideIcon } from "lucide-solid";
import {
  type Accessor,
  createContext,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { cn } from "@/lib/utils";
import { createControllableState } from "./primitives/create-controllable-state";

interface ChainOfThoughtContextValue {
  isOpen: Accessor<boolean | undefined>;
  setIsOpen: (open: boolean) => void;
}

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null
);

function useChainOfThought() {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought"
    );
  }
  return context;
}

export type ChainOfThoughtProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ChainOfThought(props: ChainOfThoughtProps) {
  const [local, others] = splitProps(props, [
    "class",
    "open",
    "defaultOpen",
    "onOpenChange",
    "children",
  ]);

  const [isOpen, setIsOpen] = createControllableState({
    prop: local.open,
    defaultProp: local.defaultOpen ?? false,
    onChange: local.onOpenChange,
  });

  return (
    <ChainOfThoughtContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        class={cn("not-prose max-w-prose space-y-4", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </ChainOfThoughtContext.Provider>
  );
}

export type ChainOfThoughtHeaderProps = ParentProps<
  Parameters<typeof CollapsibleTrigger>[0]
>;

export function ChainOfThoughtHeader(props: ChainOfThoughtHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const { isOpen, setIsOpen } = useChainOfThought();

  return (
    <Collapsible onOpenChange={setIsOpen} open={isOpen()}>
      <CollapsibleTrigger
        class={cn(
          "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
          local.class
        )}
        {...others}
      >
        <Brain class="size-4" />
        <span class="flex-1 text-left">
          {local.children ?? "Chain of Thought"}
        </span>
        <ChevronDown
          class={cn(
            "size-4 transition-transform",
            isOpen() ? "rotate-180" : "rotate-0"
          )}
        />
      </CollapsibleTrigger>
    </Collapsible>
  );
}

export type ChainOfThoughtStepProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  icon?: LucideIcon;
  label: JSX.Element;
  description?: JSX.Element;
  status?: "complete" | "active" | "pending";
};

export function ChainOfThoughtStep(props: ChainOfThoughtStepProps) {
  const [local, others] = splitProps(props, [
    "class",
    "icon",
    "label",
    "description",
    "status",
    "children",
  ]);

  const Icon = local.icon ?? Dot;
  const status = local.status ?? "complete";

  const statusStyles = {
    complete: "text-muted-foreground",
    active: "text-foreground",
    pending: "text-muted-foreground/50",
  };

  return (
    <div
      class={cn(
        "flex gap-2 text-sm",
        statusStyles[status],
        "fade-in-0 slide-in-from-top-2 animate-in",
        local.class
      )}
      {...others}
    >
      <div class="relative mt-0.5">
        <Icon class="size-4" />
        <div class="absolute top-7 bottom-0 left-1/2 -mx-px w-px bg-border" />
      </div>
      <div class="flex-1 space-y-2 overflow-hidden">
        <div>{local.label}</div>
        <Show when={local.description}>
          <div class="text-muted-foreground text-xs">{local.description}</div>
        </Show>
        {local.children}
      </div>
    </div>
  );
}

export type ChainOfThoughtSearchResultsProps =
  JSX.HTMLAttributes<HTMLDivElement>;

export function ChainOfThoughtSearchResults(
  props: ChainOfThoughtSearchResultsProps
) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn("flex flex-wrap items-center gap-2", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type ChainOfThoughtSearchResultProps = Parameters<typeof Badge>[0];

export function ChainOfThoughtSearchResult(
  props: ChainOfThoughtSearchResultProps
) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Badge
      class={cn("gap-1 px-2 py-0.5 font-normal text-xs", local.class)}
      variant="secondary"
      {...others}
    >
      {local.children}
    </Badge>
  );
}

export type ChainOfThoughtContentProps = ParentProps<
  Parameters<typeof CollapsibleContent>[0]
>;

export function ChainOfThoughtContent(props: ChainOfThoughtContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const { isOpen } = useChainOfThought();

  return (
    <Collapsible open={isOpen()}>
      <CollapsibleContent
        class={cn(
          "mt-2 space-y-3",
          "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          local.class
        )}
        {...others}
      >
        {local.children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export type ChainOfThoughtImageProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  caption?: string;
};

export function ChainOfThoughtImage(props: ChainOfThoughtImageProps) {
  const [local, others] = splitProps(props, ["class", "children", "caption"]);

  return (
    <div class={cn("mt-2 space-y-2", local.class)} {...others}>
      <div class="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-muted p-3">
        {local.children}
      </div>
      <Show when={local.caption}>
        <p class="text-muted-foreground text-xs">{local.caption}</p>
      </Show>
    </div>
  );
}
