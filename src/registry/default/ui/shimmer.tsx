import { createMemo, type JSX, splitProps } from "solid-js";
import { Motion } from "solid-motionone";
import { cn } from "@/lib/utils";

export interface TextShimmerProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  class?: string;
  duration?: number;
  spread?: number;
}

export function Shimmer(props: TextShimmerProps) {
  const [local, others] = splitProps(props, [
    "children",
    "as",
    "class",
    "duration",
    "spread",
  ]);

  const duration = () => local.duration ?? 2;
  const spread = () => local.spread ?? 2;

  const dynamicSpread = createMemo(
    () => (local.children?.length ?? 0) * spread()
  );

  return (
    <Motion.span
      animate={{ backgroundPosition: "0% center" }}
      class={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        local.class
      )}
      initial={{ backgroundPosition: "100% center" }}
      style={{
        "--spread": `${dynamicSpread()}px`,
        "background-image":
          "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: duration(),
        easing: "linear",
      }}
      {...others}
    >
      {local.children}
    </Motion.span>
  );
}
