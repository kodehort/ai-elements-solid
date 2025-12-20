import { splitProps, type JSX, type ParentProps } from "solid-js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ModelSelectorProps = Parameters<typeof Dialog>[0];

export function ModelSelector(props: ModelSelectorProps) {
  return <Dialog {...props} />;
}

export type ModelSelectorTriggerProps = Parameters<typeof DialogTrigger>[0];

export function ModelSelectorTrigger(props: ModelSelectorTriggerProps) {
  return <DialogTrigger {...props} />;
}

export type ModelSelectorContentProps = ParentProps<
  Parameters<typeof DialogContent>[0]
> & {
  title?: JSX.Element;
};

export function ModelSelectorContent(props: ModelSelectorContentProps) {
  const [local, others] = splitProps(props, ["class", "children", "title"]);

  return (
    <DialogContent class={cn("p-0", local.class)} {...others}>
      <DialogTitle class="sr-only">{local.title ?? "Model Selector"}</DialogTitle>
      <Command class="**:data-[slot=command-input-wrapper]:h-auto">
        {local.children}
      </Command>
    </DialogContent>
  );
}

export type ModelSelectorInputProps = Parameters<typeof CommandInput>[0];

export function ModelSelectorInput(props: ModelSelectorInputProps) {
  const [local, others] = splitProps(props, ["class"]);

  return <CommandInput class={cn("h-auto py-3.5", local.class)} {...others} />;
}

export type ModelSelectorListProps = Parameters<typeof CommandList>[0];

export function ModelSelectorList(props: ModelSelectorListProps) {
  return <CommandList {...props} />;
}

export type ModelSelectorEmptyProps = Parameters<typeof CommandEmpty>[0];

export function ModelSelectorEmpty(props: ModelSelectorEmptyProps) {
  return <CommandEmpty {...props} />;
}

export type ModelSelectorGroupProps = Parameters<typeof CommandGroup>[0];

export function ModelSelectorGroup(props: ModelSelectorGroupProps) {
  return <CommandGroup {...props} />;
}

export type ModelSelectorItemProps = Parameters<typeof CommandItem>[0];

export function ModelSelectorItem(props: ModelSelectorItemProps) {
  return <CommandItem {...props} />;
}

export type ModelSelectorShortcutProps = Parameters<typeof CommandShortcut>[0];

export function ModelSelectorShortcut(props: ModelSelectorShortcutProps) {
  return <CommandShortcut {...props} />;
}

export type ModelSelectorSeparatorProps = Parameters<typeof CommandSeparator>[0];

export function ModelSelectorSeparator(props: ModelSelectorSeparatorProps) {
  return <CommandSeparator {...props} />;
}

export type ModelSelectorLogoProps = Omit<
  JSX.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  provider:
    | "moonshotai-cn"
    | "lucidquery"
    | "moonshotai"
    | "zai-coding-plan"
    | "alibaba"
    | "xai"
    | "vultr"
    | "nvidia"
    | "upstage"
    | "groq"
    | "github-copilot"
    | "mistral"
    | "vercel"
    | "nebius"
    | "deepseek"
    | "alibaba-cn"
    | "google-vertex-anthropic"
    | "venice"
    | "chutes"
    | "cortecs"
    | "github-models"
    | "togetherai"
    | "azure"
    | "baseten"
    | "huggingface"
    | "opencode"
    | "fastrouter"
    | "google"
    | "google-vertex"
    | "cloudflare-workers-ai"
    | "inception"
    | "wandb"
    | "openai"
    | "zhipuai-coding-plan"
    | "perplexity"
    | "openrouter"
    | "zenmux"
    | "v0"
    | "iflowcn"
    | "synthetic"
    | "deepinfra"
    | "zhipuai"
    | "submodel"
    | "zai"
    | "inference"
    | "requesty"
    | "morph"
    | "lmstudio"
    | "anthropic"
    | "aihubmix"
    | "fireworks-ai"
    | "modelscope"
    | "llama"
    | "scaleway"
    | "amazon-bedrock"
    | "cerebras"
    | (string & {});
};

export function ModelSelectorLogo(props: ModelSelectorLogoProps) {
  const [local, others] = splitProps(props, ["provider", "class"]);

  return (
    <img
      {...others}
      alt={`${local.provider} logo`}
      class={cn("size-3 dark:invert", local.class)}
      height={12}
      src={`https://models.dev/logos/${local.provider}.svg`}
      width={12}
    />
  );
}

export type ModelSelectorLogoGroupProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ModelSelectorLogoGroup(props: ModelSelectorLogoGroupProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "-space-x-1 flex shrink-0 items-center [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type ModelSelectorNameProps = JSX.HTMLAttributes<HTMLSpanElement>;

export function ModelSelectorName(props: ModelSelectorNameProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <span class={cn("flex-1 truncate text-left", local.class)} {...others}>
      {local.children}
    </span>
  );
}
