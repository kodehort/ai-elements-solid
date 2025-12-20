import {
  splitProps,
  type ParentProps,
  createContext,
  useContext,
  Show,
} from "solid-js";
import { Button } from "@repo/solid-ui/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/solid-ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/solid-ui/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-solid";
import { Shimmer } from "./shimmer";

type PlanContextValue = {
  isStreaming: boolean;
};

const PlanContext = createContext<PlanContextValue>();

const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("Plan components must be used within Plan");
  }
  return context;
};

export type PlanProps = Parameters<typeof Collapsible>[0] & {
  isStreaming?: boolean;
};

export function Plan(props: PlanProps) {
  const [local, others] = splitProps(props, ["class", "isStreaming", "children"]);

  return (
    <PlanContext.Provider value={{ isStreaming: local.isStreaming ?? false }}>
      <Collapsible data-slot="plan" {...others}>
        <Card class={cn("shadow-none", local.class)}>{local.children}</Card>
      </Collapsible>
    </PlanContext.Provider>
  );
}

export type PlanHeaderProps = Parameters<typeof CardHeader>[0];

export function PlanHeader(props: PlanHeaderProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <CardHeader
      class={cn("flex items-start justify-between", local.class)}
      data-slot="plan-header"
      {...others}
    />
  );
}

export type PlanTitleProps = Omit<Parameters<typeof CardTitle>[0], "children"> & {
  children: string;
};

export function PlanTitle(props: PlanTitleProps) {
  const [local, others] = splitProps(props, ["children"]);
  const { isStreaming } = usePlan();

  return (
    <CardTitle data-slot="plan-title" {...others}>
      <Show when={isStreaming} fallback={local.children}>
        <Shimmer>{local.children}</Shimmer>
      </Show>
    </CardTitle>
  );
}

export type PlanDescriptionProps = Omit<Parameters<typeof CardDescription>[0], "children"> & {
  children: string;
};

export function PlanDescription(props: PlanDescriptionProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const { isStreaming } = usePlan();

  return (
    <CardDescription
      class={cn("text-balance", local.class)}
      data-slot="plan-description"
      {...others}
    >
      <Show when={isStreaming} fallback={local.children}>
        <Shimmer>{local.children}</Shimmer>
      </Show>
    </CardDescription>
  );
}

export type PlanActionProps = Parameters<typeof CardAction>[0];

export function PlanAction(props: PlanActionProps) {
  return <CardAction data-slot="plan-action" {...props} />;
}

export type PlanContentProps = Parameters<typeof CardContent>[0];

export function PlanContent(props: PlanContentProps) {
  return (
    <CollapsibleContent>
      <CardContent data-slot="plan-content" {...props} />
    </CollapsibleContent>
  );
}

export type PlanFooterProps = Parameters<typeof CardFooter>[0];

export function PlanFooter(props: PlanFooterProps) {
  return <CardFooter data-slot="plan-footer" {...props} />;
}

export type PlanTriggerProps = Parameters<typeof CollapsibleTrigger>[0];

export function PlanTrigger(props: PlanTriggerProps) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <CollapsibleTrigger
      as={Button}
      class={cn("size-8", local.class)}
      data-slot="plan-trigger"
      size="icon"
      variant="ghost"
      {...others}
    >
      <ChevronsUpDownIcon class="size-4" />
      <span class="sr-only">Toggle plan</span>
    </CollapsibleTrigger>
  );
}
