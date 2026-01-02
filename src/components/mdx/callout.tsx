import { type ParentProps, Show } from "solid-js";
import { cn } from "@/lib/utils";

interface Props extends ParentProps {
  type?: "info" | "warning" | "error";
  label?: boolean | string;
}

export function Callout(props: Props) {
  const type = () => props.type ?? "info";

  return (
    <div
      class={cn(
        "my-4 rounded-lg border p-4",
        type() === "warning" &&
          "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
        type() === "error" && "border-red-500 bg-red-50 dark:bg-red-950",
        type() === "info" && "border-blue-500 bg-blue-50 dark:bg-blue-950"
      )}
    >
      <Show when={props.label !== false}>
        <strong class="mb-2 block capitalize">
          {typeof props.label === "string" ? props.label : type()}
        </strong>
      </Show>
      {props.children}
    </div>
  );
}
