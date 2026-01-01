import { Alert, AlertDescription } from "@repo/solid-ui/components/ui/alert";
import { Button } from "@repo/solid-ui/components/ui/button";
import type { ToolUIPart } from "ai";
import {
  createContext,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { cn } from "@/lib/utils";

type ToolUIPartApproval =
  | {
      id: string;
      approved?: never;
      reason?: never;
    }
  | {
      id: string;
      approved: boolean;
      reason?: string;
    }
  | {
      id: string;
      approved: true;
      reason?: string;
    }
  | {
      id: string;
      approved: false;
      reason?: string;
    }
  | undefined;

interface ConfirmationContextValue {
  approval: ToolUIPartApproval;
  state: ToolUIPart["state"];
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(
  null
);

function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation");
  }
  return context;
}

export type ConfirmationProps = Parameters<typeof Alert>[0] & {
  approval?: ToolUIPartApproval;
  state: ToolUIPart["state"];
};

export function Confirmation(props: ConfirmationProps) {
  const [local, others] = splitProps(props, [
    "class",
    "approval",
    "state",
    "children",
  ]);

  const shouldRender = () =>
    local.approval &&
    local.state !== "input-streaming" &&
    local.state !== "input-available";

  return (
    <Show when={local.approval && shouldRender()}>
      {(approval) => (
        <ConfirmationContext.Provider
          value={{ approval: approval(), state: local.state }}
        >
          <Alert class={cn("flex flex-col gap-2", local.class)} {...others}>
            {local.children}
          </Alert>
        </ConfirmationContext.Provider>
      )}
    </Show>
  );
}

export type ConfirmationTitleProps = Parameters<typeof AlertDescription>[0];

export function ConfirmationTitle(props: ConfirmationTitleProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <AlertDescription class={cn("inline", local.class)} {...others} />;
}

export type ConfirmationRequestProps = ParentProps;

export function ConfirmationRequest(props: ConfirmationRequestProps) {
  const { state } = useConfirmation();

  // Only show when approval is requested
  const isApprovalRequested = () => (state as string) === "approval-requested";

  return <Show when={isApprovalRequested()}>{props.children}</Show>;
}

export type ConfirmationAcceptedProps = ParentProps;

export function ConfirmationAccepted(props: ConfirmationAcceptedProps) {
  const { approval, state } = useConfirmation();

  const shouldShow = () => {
    if (!approval?.approved) {
      return false;
    }
    const s = state as string;
    return (
      s === "approval-responded" ||
      s === "output-denied" ||
      s === "output-available"
    );
  };

  return <Show when={shouldShow()}>{props.children}</Show>;
}

export type ConfirmationRejectedProps = ParentProps;

export function ConfirmationRejected(props: ConfirmationRejectedProps) {
  const { approval, state } = useConfirmation();

  const shouldShow = () => {
    if (approval?.approved !== false) {
      return false;
    }
    const s = state as string;
    return (
      s === "approval-responded" ||
      s === "output-denied" ||
      s === "output-available"
    );
  };

  return <Show when={shouldShow()}>{props.children}</Show>;
}

export type ConfirmationActionsProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ConfirmationActions(props: ConfirmationActionsProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  const { state } = useConfirmation();

  // Only show when approval is requested
  const isApprovalRequested = () => (state as string) === "approval-requested";

  return (
    <Show when={isApprovalRequested()}>
      <div
        class={cn("flex items-center justify-end gap-2 self-end", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  );
}

export type ConfirmationActionProps = Parameters<typeof Button>[0];

export function ConfirmationAction(props: ConfirmationActionProps) {
  return <Button class="h-8 px-3 text-sm" type="button" {...props} />;
}
