import type { ToolUIPart } from "ai";
import {
  CheckCircle,
  ChevronDown,
  Circle,
  Clock,
  Wrench,
  XCircle,
} from "lucide-solid";
import { type JSX, Show, splitProps } from "solid-js";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { CodeBlock } from "./code-block";

export type ToolProps = Parameters<typeof Collapsible>[0];

export function Tool(props: ToolProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Collapsible
      class={cn("not-prose mb-4 w-full rounded-md border", local.class)}
      {...others}
    >
      {local.children}
    </Collapsible>
  );
}

export interface ToolHeaderProps {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  class?: string;
}

function getStatusBadge(status: ToolUIPart["state"]) {
  const labels: Record<string, string> = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Responded",
    "output-available": "Completed",
    "output-error": "Error",
    "output-denied": "Denied",
  };

  const icons: Record<string, JSX.Element> = {
    "input-streaming": <Circle class="size-4" />,
    "input-available": <Clock class="size-4 animate-pulse" />,
    "approval-requested": <Clock class="size-4 text-yellow-600" />,
    "approval-responded": <CheckCircle class="size-4 text-blue-600" />,
    "output-available": <CheckCircle class="size-4 text-green-600" />,
    "output-error": <XCircle class="size-4 text-red-600" />,
    "output-denied": <XCircle class="size-4 text-orange-600" />,
  };

  return (
    <Badge class="gap-1.5 rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
}

export function ToolHeader(props: ToolHeaderProps) {
  const [local, others] = splitProps(props, [
    "class",
    "title",
    "type",
    "state",
  ]);

  const displayTitle = () =>
    local.title ?? local.type.split("-").slice(1).join("-");

  return (
    <CollapsibleTrigger
      class={cn(
        "flex w-full items-center justify-between gap-4 p-3",
        local.class
      )}
      {...others}
    >
      <div class="flex items-center gap-2">
        <Wrench class="size-4 text-muted-foreground" />
        <span class="font-medium text-sm">{displayTitle()}</span>
        {getStatusBadge(local.state)}
      </div>
      <ChevronDown class="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
}

export type ToolContentProps = Parameters<typeof CollapsibleContent>[0];

export function ToolContent(props: ToolContentProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CollapsibleContent
      class={cn(
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        local.class
      )}
      {...others}
    >
      {local.children}
    </CollapsibleContent>
  );
}

export type ToolInputProps = JSX.HTMLAttributes<HTMLDivElement> & {
  input: ToolUIPart["input"];
};

export function ToolInput(props: ToolInputProps) {
  const [local, others] = splitProps(props, ["class", "input"]);

  return (
    <div class={cn("space-y-2 overflow-hidden p-4", local.class)} {...others}>
      <h4 class="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Parameters
      </h4>
      <div class="rounded-md bg-muted/50">
        <CodeBlock
          code={JSON.stringify(local.input, null, 2)}
          language="json"
        />
      </div>
    </div>
  );
}

export type ToolOutputProps = JSX.HTMLAttributes<HTMLDivElement> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
};

export function ToolOutput(props: ToolOutputProps) {
  const [local, others] = splitProps(props, ["class", "output", "errorText"]);

  const hasContent = () => local.output || local.errorText;

  const outputContent = () => {
    if (typeof local.output === "object") {
      return JSON.stringify(local.output, null, 2);
    }
    return String(local.output ?? "");
  };

  return (
    <Show when={hasContent()}>
      <div class={cn("space-y-2 p-4", local.class)} {...others}>
        <h4 class="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          {local.errorText ? "Error" : "Result"}
        </h4>
        <div
          class={cn(
            "overflow-x-auto rounded-md text-xs [&_table]:w-full",
            local.errorText
              ? "bg-destructive/10 text-destructive"
              : "bg-muted/50 text-foreground"
          )}
        >
          <Show when={local.errorText}>
            <div class="p-4">{local.errorText}</div>
          </Show>
          <Show when={local.output}>
            <CodeBlock code={outputContent()} language="json" />
          </Show>
        </div>
      </div>
    </Show>
  );
}
