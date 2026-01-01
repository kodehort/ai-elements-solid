import { Check, Copy } from "lucide-solid";
import { type BundledLanguage, codeToHtml, type ShikiTransformer } from "shiki";
import {
  createContext,
  createEffect,
  createSignal,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>> & {
  code: string;
  language: BundledLanguage;
  showLineNumbers?: boolean;
};

interface CodeBlockContextType {
  code: string;
}

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

const lineNumberTransformer: ShikiTransformer = {
  name: "line-numbers",
  line(node, line) {
    node.children.unshift({
      type: "element",
      tagName: "span",
      properties: {
        className: [
          "inline-block",
          "min-w-10",
          "mr-4",
          "text-right",
          "select-none",
          "text-muted-foreground",
        ],
      },
      children: [{ type: "text", value: String(line) }],
    });
  },
};

export async function highlightCode(
  code: string,
  language: BundledLanguage,
  showLineNumbers = false
) {
  const transformers: ShikiTransformer[] = showLineNumbers
    ? [lineNumberTransformer]
    : [];

  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: "one-light",
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: "one-dark-pro",
      transformers,
    }),
  ]);
}

export function CodeBlock(props: CodeBlockProps) {
  const [local, others] = splitProps(props, [
    "code",
    "language",
    "showLineNumbers",
    "class",
    "children",
  ]);

  const [html, setHtml] = createSignal("");
  const [darkHtml, setDarkHtml] = createSignal("");
  let mounted = false;

  createEffect(() => {
    mounted = true;
    highlightCode(
      local.code,
      local.language,
      local.showLineNumbers ?? false
    ).then(([light, dark]) => {
      if (mounted) {
        setHtml(light);
        setDarkHtml(dark);
      }
    });

    return () => {
      mounted = false;
    };
  });

  return (
    <CodeBlockContext.Provider value={{ code: local.code }}>
      <div
        class={cn(
          "group relative w-full overflow-hidden rounded-md border bg-background text-foreground",
          local.class
        )}
        {...others}
      >
        <div class="relative">
          <div
            class="overflow-auto dark:hidden [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
            innerHTML={html()}
          />
          <div
            class="hidden overflow-auto dark:block [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
            innerHTML={darkHtml()}
          />
          <Show when={local.children}>
            <div class="absolute top-2 right-2 flex items-center gap-2">
              {local.children}
            </div>
          </Show>
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
}

export type CodeBlockCopyButtonProps = Parameters<typeof Button>[0] & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export function CodeBlockCopyButton(props: CodeBlockCopyButtonProps) {
  const [local, others] = splitProps(props, [
    "onCopy",
    "onError",
    "timeout",
    "children",
    "class",
  ]);

  const [isCopied, setIsCopied] = createSignal(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      local.onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      local.onCopy?.();
      setTimeout(() => setIsCopied(false), local.timeout ?? 2000);
    } catch (error) {
      local.onError?.(error as Error);
    }
  };

  return (
    <Button
      class={cn("shrink-0", local.class)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...others}
    >
      {local.children ?? (
        <Show fallback={<Copy class="size-3.5" />} when={isCopied()}>
          <Check class="size-3.5" />
        </Show>
      )}
    </Button>
  );
}
