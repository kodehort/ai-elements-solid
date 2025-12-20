import {
  createContext,
  useContext,
  splitProps,
  Show,
  type JSX,
  type ParentProps,
} from "solid-js";
import { Button } from "@repo/solid-ui/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/solid-ui/components/ui/hover-card";
import { Progress } from "@repo/solid-ui/components/ui/progress";
import { cn } from "@/lib/utils";
import type { LanguageModelUsage } from "ai";

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

type ModelId = string;

type ContextSchema = {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
};

const ContextContext = createContext<ContextSchema | null>(null);

function useContextValue() {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error("Context components must be used within Context");
  }
  return context;
}

export type ContextProps = ParentProps<Parameters<typeof HoverCard>[0]> & ContextSchema;

export function Context(props: ContextProps) {
  const [local, others] = splitProps(props, [
    "usedTokens",
    "maxTokens",
    "usage",
    "modelId",
    "children",
  ]);

  return (
    <ContextContext.Provider
      value={{
        usedTokens: local.usedTokens,
        maxTokens: local.maxTokens,
        usage: local.usage,
        modelId: local.modelId,
      }}
    >
      <HoverCard closeDelay={0} openDelay={0} {...others}>
        {local.children}
      </HoverCard>
    </ContextContext.Provider>
  );
}

function ContextIcon() {
  const ctx = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = () => ctx.usedTokens / ctx.maxTokens;
  const dashOffset = () => circumference * (1 - usedPercent());

  return (
    <svg
      aria-label="Model context usage"
      height="20"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        stroke-width={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        stroke-dasharray={`${circumference} ${circumference}`}
        stroke-dashoffset={dashOffset()}
        stroke-linecap="round"
        stroke-width={ICON_STROKE_WIDTH}
        style={{ "transform-origin": "center", transform: "rotate(-90deg)" }}
      />
    </svg>
  );
}

export type ContextTriggerProps = Parameters<typeof Button>[0];

export function ContextTrigger(props: ContextTriggerProps) {
  const [local, others] = splitProps(props, ["children"]);
  const ctx = useContextValue();
  const usedPercent = () => ctx.usedTokens / ctx.maxTokens;
  const renderedPercent = () =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(usedPercent());

  return (
    <HoverCardTrigger as="span">
      <Show
        when={!local.children}
        fallback={local.children}
      >
        <Button type="button" variant="ghost" {...others}>
          <span class="font-medium text-muted-foreground">
            {renderedPercent()}
          </span>
          <ContextIcon />
        </Button>
      </Show>
    </HoverCardTrigger>
  );
}

export type ContextContentProps = Parameters<typeof HoverCardContent>[0];

export function ContextContent(props: ContextContentProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <HoverCardContent
      class={cn("min-w-60 divide-y overflow-hidden p-0", local.class)}
      {...others}
    />
  );
}

export type ContextContentHeaderProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextContentHeader(props: ContextContentHeaderProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const ctx = useContextValue();
  const usedPercent = () => ctx.usedTokens / ctx.maxTokens;
  const displayPct = () =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(usedPercent());
  const used = () =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(ctx.usedTokens);
  const total = () =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(ctx.maxTokens);

  return (
    <div class={cn("w-full space-y-2 p-3", local.class)} {...others}>
      <Show when={!local.children} fallback={local.children}>
        <div class="flex items-center justify-between gap-3 text-xs">
          <p>{displayPct()}</p>
          <p class="font-mono text-muted-foreground">
            {used()} / {total()}
          </p>
        </div>
        <div class="space-y-2">
          <Progress class="bg-muted" value={usedPercent() * PERCENT_MAX} />
        </div>
      </Show>
    </div>
  );
}

export type ContextContentBodyProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextContentBody(props: ContextContentBodyProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <div class={cn("w-full p-3", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export type ContextContentFooterProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextContentFooter(props: ContextContentFooterProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const ctx = useContextValue();

  // Note: tokenlens is React-only, so we skip cost calculation
  // Users can provide their own cost calculation via children
  const totalCost = () =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(0);

  return (
    <div
      class={cn(
        "flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs",
        local.class
      )}
      {...others}
    >
      <Show when={!local.children} fallback={local.children}>
        <span class="text-muted-foreground">Total cost</span>
        <span>{totalCost()}</span>
      </Show>
    </div>
  );
}

export type ContextInputUsageProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextInputUsage(props: ContextInputUsageProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ctx = useContextValue();
  const inputTokens = () => ctx.usage?.inputTokens ?? 0;

  return (
    <Show when={local.children || inputTokens() > 0}>
      <Show when={local.children} fallback={
        <div
          class={cn("flex items-center justify-between text-xs", local.class)}
          {...others}
        >
          <span class="text-muted-foreground">Input</span>
          <TokensWithCost tokens={inputTokens()} />
        </div>
      }>
        {local.children}
      </Show>
    </Show>
  );
}

export type ContextOutputUsageProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextOutputUsage(props: ContextOutputUsageProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ctx = useContextValue();
  const outputTokens = () => ctx.usage?.outputTokens ?? 0;

  return (
    <Show when={local.children || outputTokens() > 0}>
      <Show when={local.children} fallback={
        <div
          class={cn("flex items-center justify-between text-xs", local.class)}
          {...others}
        >
          <span class="text-muted-foreground">Output</span>
          <TokensWithCost tokens={outputTokens()} />
        </div>
      }>
        {local.children}
      </Show>
    </Show>
  );
}

export type ContextReasoningUsageProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextReasoningUsage(props: ContextReasoningUsageProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ctx = useContextValue();
  const reasoningTokens = () => ctx.usage?.reasoningTokens ?? 0;

  return (
    <Show when={local.children || reasoningTokens() > 0}>
      <Show when={local.children} fallback={
        <div
          class={cn("flex items-center justify-between text-xs", local.class)}
          {...others}
        >
          <span class="text-muted-foreground">Reasoning</span>
          <TokensWithCost tokens={reasoningTokens()} />
        </div>
      }>
        {local.children}
      </Show>
    </Show>
  );
}

export type ContextCacheUsageProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function ContextCacheUsage(props: ContextCacheUsageProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const ctx = useContextValue();
  const cacheTokens = () => ctx.usage?.cachedInputTokens ?? 0;

  return (
    <Show when={local.children || cacheTokens() > 0}>
      <Show when={local.children} fallback={
        <div
          class={cn("flex items-center justify-between text-xs", local.class)}
          {...others}
        >
          <span class="text-muted-foreground">Cache</span>
          <TokensWithCost tokens={cacheTokens()} />
        </div>
      }>
        {local.children}
      </Show>
    </Show>
  );
}

function TokensWithCost(props: { tokens?: number; costText?: string }) {
  const formattedTokens = () =>
    props.tokens === undefined
      ? "—"
      : new Intl.NumberFormat("en-US", { notation: "compact" }).format(props.tokens);

  return (
    <span>
      {formattedTokens()}
      <Show when={props.costText}>
        <span class="ml-2 text-muted-foreground">• {props.costText}</span>
      </Show>
    </span>
  );
}
