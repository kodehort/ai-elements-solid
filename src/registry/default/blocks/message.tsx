import { Button } from "@repo/solid-ui/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@repo/solid-ui/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/solid-ui/components/ui/tooltip";
import type { FileUIPart, UIMessage } from "ai";
import { ChevronLeft, ChevronRight, Paperclip, X } from "lucide-solid";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  Index,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { cn } from "@/lib/utils";

export type MessageProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>> & {
  from: UIMessage["role"];
};

export function Message(props: MessageProps) {
  const [local, others] = splitProps(props, ["class", "from", "children"]);

  return (
    <div
      class={cn(
        "group flex w-full max-w-[95%] flex-col gap-2",
        local.from === "user" ? "is-user ml-auto justify-end" : "is-assistant",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type MessageContentProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function MessageContent(props: MessageContentProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <div
      class={cn(
        "is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm",
        "group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
        "group-[.is-assistant]:text-foreground",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type MessageActionsProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function MessageActions(props: MessageActionsProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("flex items-center gap-1", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export type MessageActionProps = Parameters<typeof Button>[0] & {
  tooltip?: string;
  label?: string;
};

export function MessageAction(props: MessageActionProps) {
  const [local, others] = splitProps(props, [
    "tooltip",
    "children",
    "label",
    "variant",
    "size",
  ]);

  const button = (
    <Button
      size={local.size ?? "icon-sm"}
      type="button"
      variant={local.variant ?? "ghost"}
      {...others}
    >
      {local.children}
      <span class="sr-only">{local.label || local.tooltip}</span>
    </Button>
  );

  return (
    <Show fallback={button} when={local.tooltip}>
      <Tooltip>
        <TooltipTrigger as="span">{button}</TooltipTrigger>
        <TooltipContent>
          <p>{local.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </Show>
  );
}

// Branch Context
interface MessageBranchContextType {
  currentBranch: Accessor<number>;
  totalBranches: Accessor<number>;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: Accessor<JSX.Element[]>;
  setBranches: (branches: JSX.Element[]) => void;
}

const MessageBranchContext = createContext<MessageBranchContextType | null>(
  null
);

function useMessageBranch() {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error(
      "MessageBranch components must be used within MessageBranch"
    );
  }
  return context;
}

export type MessageBranchProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export function MessageBranch(props: MessageBranchProps) {
  const [local, others] = splitProps(props, [
    "defaultBranch",
    "onBranchChange",
    "class",
    "children",
  ]);

  const [currentBranch, setCurrentBranch] = createSignal(
    local.defaultBranch ?? 0
  );
  const [branches, setBranches] = createSignal<JSX.Element[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    local.onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const total = branches().length;
    const newBranch = currentBranch() > 0 ? currentBranch() - 1 : total - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const total = branches().length;
    const newBranch = currentBranch() < total - 1 ? currentBranch() + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: MessageBranchContextType = {
    currentBranch,
    totalBranches: () => branches().length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  };

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div
        class={cn("grid w-full gap-2 [&>div]:pb-0", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </MessageBranchContext.Provider>
  );
}

export type MessageBranchContentProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function MessageBranchContent(props: MessageBranchContentProps) {
  const [local, others] = splitProps(props, ["children"]);
  const { currentBranch, setBranches, branches } = useMessageBranch();

  // Convert children to array
  const childrenArray = () => {
    const c = local.children;
    if (Array.isArray(c)) {
      return c;
    }
    return c ? [c] : [];
  };

  // Update branches when children change
  createEffect(() => {
    const children = childrenArray();
    if (branches().length !== children.length) {
      setBranches(children);
    }
  });

  return (
    <Index each={childrenArray()}>
      {(branch, index) => (
        <div
          class={cn(
            "grid gap-2 overflow-hidden [&>div]:pb-0",
            index === currentBranch() ? "block" : "hidden"
          )}
          {...others}
        >
          {branch()}
        </div>
      )}
    </Index>
  );
}

export type MessageBranchSelectorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  from: UIMessage["role"];
};

export function MessageBranchSelector(props: MessageBranchSelectorProps) {
  const [_local, others] = splitProps(props, ["class", "from"]);
  const { totalBranches } = useMessageBranch();

  return (
    <Show when={totalBranches() > 1}>
      <ButtonGroup
        class="[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md"
        orientation="horizontal"
        {...others}
      />
    </Show>
  );
}

export type MessageBranchPreviousProps = Parameters<typeof Button>[0];

export function MessageBranchPrevious(props: MessageBranchPreviousProps) {
  const [local, others] = splitProps(props, ["children"]);
  const { goToPrevious, totalBranches } = useMessageBranch();

  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches() <= 1}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...others}
    >
      {local.children ?? <ChevronLeft size={14} />}
    </Button>
  );
}

export type MessageBranchNextProps = Parameters<typeof Button>[0];

export function MessageBranchNext(props: MessageBranchNextProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const { goToNext, totalBranches } = useMessageBranch();

  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches() <= 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...others}
    >
      {local.children ?? <ChevronRight size={14} />}
    </Button>
  );
}

export type MessageBranchPageProps = JSX.HTMLAttributes<HTMLDivElement>;

export function MessageBranchPage(props: MessageBranchPageProps) {
  const [local, others] = splitProps(props, ["class"]);
  const { currentBranch, totalBranches } = useMessageBranch();

  return (
    <ButtonGroupText
      class={cn(
        "border-none bg-transparent text-muted-foreground shadow-none",
        local.class
      )}
      {...others}
    >
      {currentBranch() + 1} of {totalBranches()}
    </ButtonGroupText>
  );
}

export type MessageResponseProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  children: string;
};

export function MessageResponse(props: MessageResponseProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "prose prose-sm dark:prose-invert size-full max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        local.class
      )}
      {...others}
    >
      <div class="whitespace-pre-wrap">{local.children}</div>
    </div>
  );
}

export type MessageAttachmentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart;
  onRemove?: () => void;
};

export function MessageAttachment(props: MessageAttachmentProps) {
  const [local, others] = splitProps(props, ["data", "class", "onRemove"]);

  const filename = () => local.data.filename || "";
  const isImage = () =>
    local.data.mediaType?.startsWith("image/") && local.data.url;
  const attachmentLabel = () =>
    filename() || (isImage() ? "Image" : "Attachment");

  return (
    <div
      class={cn(
        "group relative size-24 overflow-hidden rounded-lg",
        local.class
      )}
      {...others}
    >
      <Show
        fallback={
          <>
            <Tooltip>
              <TooltipTrigger
                as="div"
                class="flex size-full shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
              >
                <Paperclip class="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{attachmentLabel()}</p>
              </TooltipContent>
            </Tooltip>
            <Show when={local.onRemove}>
              <Button
                aria-label="Remove attachment"
                class="size-6 shrink-0 rounded-full p-0 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 [&>svg]:size-3"
                onClick={(e) => {
                  e.stopPropagation();
                  local.onRemove?.();
                }}
                type="button"
                variant="ghost"
              >
                <X />
                <span class="sr-only">Remove</span>
              </Button>
            </Show>
          </>
        }
        when={isImage()}
      >
        <img
          alt={filename() || "attachment"}
          class="size-full object-cover"
          height={100}
          src={local.data.url}
          width={100}
        />
        <Show when={local.onRemove}>
          <Button
            aria-label="Remove attachment"
            class="absolute top-2 right-2 size-6 rounded-full bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 [&>svg]:size-3"
            onClick={(e) => {
              e.stopPropagation();
              local.onRemove?.();
            }}
            type="button"
            variant="ghost"
          >
            <X />
            <span class="sr-only">Remove</span>
          </Button>
        </Show>
      </Show>
    </div>
  );
}

export type MessageAttachmentsProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function MessageAttachments(props: MessageAttachmentsProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <Show when={local.children}>
      <div
        class={cn(
          "ml-auto flex w-fit flex-wrap items-start gap-2",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
}

export type MessageToolbarProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function MessageToolbar(props: MessageToolbarProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "mt-4 flex w-full items-center justify-between gap-4",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}
