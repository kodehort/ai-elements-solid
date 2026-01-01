import { Button } from "@repo/solid-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { Input } from "@repo/solid-ui/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/solid-ui/components/ui/tooltip";
import { ChevronDown } from "lucide-solid";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  For,
  type JSX,
  type ParentProps,
  type Setter,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { cn } from "@/lib/utils";

export interface WebPreviewContextValue {
  url: Accessor<string>;
  setUrl: (url: string) => void;
  consoleOpen: Accessor<boolean>;
  setConsoleOpen: Setter<boolean>;
}

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

function useWebPreview() {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview");
  }
  return context;
}

export type WebPreviewProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

export function WebPreview(props: WebPreviewProps) {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "defaultUrl",
    "onUrlChange",
  ]);

  const [url, setUrlSignal] = createSignal(local.defaultUrl ?? "");
  const [consoleOpen, setConsoleOpen] = createSignal(false);

  const setUrl = (newUrl: string) => {
    setUrlSignal(newUrl);
    local.onUrlChange?.(newUrl);
  };

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl,
    consoleOpen,
    setConsoleOpen,
  };

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        class={cn(
          "flex size-full flex-col rounded-lg border bg-card",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </WebPreviewContext.Provider>
  );
}

export type WebPreviewNavigationProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function WebPreviewNavigation(props: WebPreviewNavigationProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn("flex items-center gap-1 border-b p-2", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type WebPreviewNavigationButtonProps = Parameters<typeof Button>[0] & {
  tooltip?: string;
};

export function WebPreviewNavigationButton(
  props: WebPreviewNavigationButtonProps
) {
  const [local, others] = splitProps(props, [
    "onClick",
    "disabled",
    "tooltip",
    "children",
  ]);

  return (
    <Tooltip>
      <TooltipTrigger as="span">
        <Button
          class="h-8 w-8 p-0 hover:text-foreground"
          disabled={local.disabled}
          onClick={local.onClick}
          size="sm"
          variant="ghost"
          {...others}
        >
          {local.children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{local.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export type WebPreviewUrlProps = Parameters<typeof Input>[0];

export function WebPreviewUrl(props: WebPreviewUrlProps) {
  const [local, others] = splitProps(props, ["value", "onInput", "onKeyDown"]);
  const { url, setUrl } = useWebPreview();
  const [inputValue, setInputValue] = createSignal(url());

  // Sync input value with context URL when it changes externally
  createEffect(() => {
    setInputValue(url());
  });

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    event
  ) => {
    setInputValue(event.currentTarget.value);
    if (typeof local.onInput === "function") {
      local.onInput(event);
    }
  };

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    if (event.key === "Enter") {
      setUrl(event.currentTarget.value);
    }
    if (typeof local.onKeyDown === "function") {
      local.onKeyDown(event);
    }
  };

  return (
    <Input
      class="h-8 flex-1 text-sm"
      onInput={local.onInput ?? handleInput}
      onKeyDown={handleKeyDown}
      placeholder="Enter URL..."
      value={(local.value ?? inputValue()) as string}
      {...others}
    />
  );
}

export type WebPreviewBodyProps =
  JSX.IframeHTMLAttributes<HTMLIFrameElement> & {
    loading?: JSX.Element;
  };

export function WebPreviewBody(props: WebPreviewBodyProps) {
  const [local, others] = splitProps(props, ["class", "loading", "src"]);
  const { url } = useWebPreview();

  return (
    <div class="flex-1">
      <iframe
        class={cn("size-full", local.class)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(local.src ?? url()) || undefined}
        title="Preview"
        {...others}
      />
      {local.loading}
    </div>
  );
}

export type WebPreviewConsoleProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
> & {
  logs?: Array<{
    level: "log" | "warn" | "error";
    message: string;
    timestamp: Date;
  }>;
};

export function WebPreviewConsole(props: WebPreviewConsoleProps) {
  const [local, others] = splitProps(props, ["class", "logs", "children"]);
  const { consoleOpen, setConsoleOpen } = useWebPreview();

  const logs = () => local.logs ?? [];

  return (
    <Collapsible
      class={cn("border-t bg-muted/50 font-mono text-sm", local.class)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen()}
      {...others}
    >
      <CollapsibleTrigger as="div">
        <Button
          class="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50"
          variant="ghost"
        >
          Console
          <ChevronDown
            class={cn(
              "h-4 w-4 transition-transform duration-200",
              consoleOpen() && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        class={cn(
          "px-4 pb-4",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
        )}
      >
        <div class="max-h-48 space-y-1 overflow-y-auto">
          <Show
            fallback={<p class="text-muted-foreground">No console output</p>}
            when={logs().length > 0}
          >
            <For each={logs()}>
              {(log) => (
                <div
                  class={cn(
                    "text-xs",
                    log.level === "error" && "text-destructive",
                    log.level === "warn" && "text-yellow-600",
                    log.level === "log" && "text-foreground"
                  )}
                >
                  <span class="text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>{" "}
                  {log.message}
                </div>
              )}
            </For>
          </Show>
          {local.children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
