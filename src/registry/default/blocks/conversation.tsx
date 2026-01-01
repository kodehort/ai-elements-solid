import { Button } from "@repo/solid-ui/components/ui/button";
import { ArrowDown } from "lucide-solid";
import {
  type Accessor,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
} from "solid-js";
import { cn } from "@/lib/utils";
import {
  createStickToBottom,
  type UseStickToBottomOptions,
} from "./primitives/create-stick-to-bottom";

export type ConversationProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & {
    initial?: UseStickToBottomOptions["initial"];
    resize?: UseStickToBottomOptions["resize"];
    isAtBottom?: Accessor<boolean>;
    scrollToBottom?: () => void;
  }
>;

export function Conversation(props: ConversationProps) {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "initial",
    "resize",
    "isAtBottom",
    "scrollToBottom",
  ]);

  // If external controls provided, use them; otherwise create our own
  const ownControls = createStickToBottom({
    initial: local.initial ?? "smooth",
    resize: local.resize ?? "smooth",
  });

  const isAtBottom = () => local.isAtBottom?.() ?? ownControls.isAtBottom();
  const scrollToBottom = () =>
    local.scrollToBottom?.() ?? ownControls.scrollToBottom();

  return (
    <div
      class={cn("relative flex-1 overflow-y-auto", local.class)}
      ref={ownControls.scrollRef}
      role="log"
      {...others}
    >
      <div ref={ownControls.contentRef}>{local.children}</div>
      <Show when={!isAtBottom()}>
        <Button
          class="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full"
          onClick={scrollToBottom}
          size="icon"
          type="button"
          variant="outline"
        >
          <ArrowDown class="size-4" />
        </Button>
      </Show>
    </div>
  );
}

export type ConversationContentProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function ConversationContent(props: ConversationContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex flex-col gap-8 p-4", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export type ConversationEmptyStateProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  title?: string;
  description?: string;
  icon?: JSX.Element;
};

export function ConversationEmptyState(props: ConversationEmptyStateProps) {
  const [local, others] = splitProps(props, [
    "class",
    "title",
    "description",
    "icon",
    "children",
  ]);

  return (
    <div
      class={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        local.class
      )}
      {...others}
    >
      <Show fallback={local.children} when={!local.children}>
        <Show when={local.icon}>
          <div class="text-muted-foreground">{local.icon}</div>
        </Show>
        <div class="space-y-1">
          <h3 class="font-medium text-sm">
            {local.title ?? "No messages yet"}
          </h3>
          <Show when={local.description}>
            <p class="text-muted-foreground text-sm">
              {local.description ?? "Start a conversation to see messages here"}
            </p>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export type ConversationScrollButtonProps = Parameters<typeof Button>[0];

export function ConversationScrollButton(props: ConversationScrollButtonProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <Button
      class={cn(
        "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
        local.class
      )}
      size="icon"
      type="button"
      variant="outline"
      {...others}
    >
      <ArrowDown class="size-4" />
    </Button>
  );
}
