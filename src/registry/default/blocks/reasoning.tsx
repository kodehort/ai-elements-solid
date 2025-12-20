import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  onCleanup,
  splitProps,
  Show,
  type JSX,
  type ParentProps,
  type Accessor,
} from "solid-js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Brain, ChevronDown } from "lucide-solid";
import { Shimmer } from "./shimmer";
import { createControllableState } from "./primitives/create-controllable-state";

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: Accessor<boolean | undefined>;
  setIsOpen: (open: boolean) => void;
  duration: Accessor<number | undefined>;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export function useReasoning() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
}

export type ReasoningProps = ParentProps<Parameters<typeof Collapsible>[0]> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export function Reasoning(props: ReasoningProps) {
  const [local, others] = splitProps(props, [
    "class",
    "isStreaming",
    "open",
    "defaultOpen",
    "onOpenChange",
    "duration",
    "children",
  ]);

  const [isOpen, setIsOpen] = createControllableState({
    prop: local.open,
    defaultProp: local.defaultOpen ?? true,
    onChange: local.onOpenChange,
  });

  const [duration, setDuration] = createControllableState({
    prop: local.duration,
    defaultProp: undefined,
  });

  const [hasAutoClosed, setHasAutoClosed] = createSignal(false);
  const [startTime, setStartTime] = createSignal<number | null>(null);

  // Track duration when streaming starts and ends
  createEffect(() => {
    const streaming = local.isStreaming ?? false;
    if (streaming) {
      if (startTime() === null) {
        setStartTime(Date.now());
      }
    } else if (startTime() !== null) {
      setDuration(Math.ceil((Date.now() - startTime()!) / MS_IN_S));
      setStartTime(null);
    }
  });

  // Auto-open when streaming starts, auto-close when streaming ends (once only)
  createEffect(() => {
    const defaultOpen = local.defaultOpen ?? true;
    const streaming = local.isStreaming ?? false;

    if (defaultOpen && !streaming && isOpen() && !hasAutoClosed()) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);

      onCleanup(() => clearTimeout(timer));
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  return (
    <ReasoningContext.Provider
      value={{
        isStreaming: local.isStreaming ?? false,
        isOpen,
        setIsOpen: handleOpenChange,
        duration,
      }}
    >
      <Collapsible
        class={cn("not-prose mb-4", local.class)}
        onOpenChange={handleOpenChange}
        open={isOpen()}
        {...others}
      >
        {local.children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
}

export type ReasoningTriggerProps = ParentProps<
  Parameters<typeof CollapsibleTrigger>[0]
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => JSX.Element;
};

function defaultGetThinkingMessage(
  isStreaming: boolean,
  duration?: number
): JSX.Element {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  if (duration === undefined) {
    return <p>Thought for a few seconds</p>;
  }
  return <p>Thought for {duration} seconds</p>;
}

export function ReasoningTrigger(props: ReasoningTriggerProps) {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "getThinkingMessage",
  ]);
  const { isStreaming, isOpen, duration } = useReasoning();

  const getMessage = local.getThinkingMessage ?? defaultGetThinkingMessage;

  return (
    <CollapsibleTrigger
      class={cn(
        "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
        local.class
      )}
      {...others}
    >
      <Show when={!local.children} fallback={local.children}>
        <Brain class="size-4" />
        {getMessage(isStreaming, duration())}
        <ChevronDown
          class={cn(
            "size-4 transition-transform",
            isOpen() ? "rotate-180" : "rotate-0"
          )}
        />
      </Show>
    </CollapsibleTrigger>
  );
}

export type ReasoningContentProps = ParentProps<
  Parameters<typeof CollapsibleContent>[0]
> & {
  children: string;
};

export function ReasoningContent(props: ReasoningContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CollapsibleContent
      class={cn(
        "mt-4 text-sm",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      <div class="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
        {local.children}
      </div>
    </CollapsibleContent>
  );
}
