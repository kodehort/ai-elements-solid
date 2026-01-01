import { Button } from "@repo/solid-ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/solid-ui/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/solid-ui/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/solid-ui/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@repo/solid-ui/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/solid-ui/components/ui/select";
import type { ChatStatus, FileUIPart } from "ai";
import {
  CornerDownLeft,
  Image as ImageIcon,
  Loader2,
  Mic,
  Paperclip,
  Plus,
  Square,
  X,
} from "lucide-solid";
import { nanoid } from "nanoid";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  For,
  type JSX,
  onCleanup,
  type ParentProps,
  children as resolveChildren,
  Show,
  splitProps,
  useContext,
} from "solid-js";
import { isServer } from "solid-js/web";
import { cn } from "@/lib/utils";

// ============================================================================
// Provider Context & Types
// ============================================================================

export interface AttachmentsContext {
  files: Accessor<(FileUIPart & { id: string })[]>;
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: { current: HTMLInputElement | null };
}

export interface TextInputContext {
  value: Accessor<string>;
  setInput: (v: string) => void;
  clear: () => void;
}

export interface PromptInputControllerProps {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  __registerFileInput: (
    ref: { current: HTMLInputElement | null },
    open: () => void
  ) => void;
}

const PromptInputController = createContext<PromptInputControllerProps | null>(
  null
);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(
  null
);

// SSR-safe dummy controller
const serverDummyController: PromptInputControllerProps = {
  textInput: {
    value: () => "",
    setInput: () => undefined,
    clear: () => undefined,
  },
  attachments: {
    files: () => [],
    add: () => undefined,
    remove: () => undefined,
    clear: () => undefined,
    openFileDialog: () => undefined,
    fileInputRef: { current: null },
  },
  __registerFileInput: () => undefined,
};

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    // During SSR, return dummy controller to avoid errors
    if (isServer) {
      return serverDummyController;
    }
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController()."
    );
  }
  return ctx;
};

const useOptionalPromptInputController = () =>
  useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments()."
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () =>
  useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = ParentProps<{
  initialInput?: string;
}>;

export function PromptInputProvider(props: PromptInputProviderProps) {
  const [local] = splitProps(props, ["initialInput", "children"]);

  const [textInput, setTextInput] = createSignal(local.initialInput ?? "");
  const clearInput = () => setTextInput("");

  const [attachmentFiles, setAttachmentFiles] = createSignal<
    (FileUIPart & { id: string })[]
  >([]);
  const fileInputRef: { current: HTMLInputElement | null } = { current: null };
  let openRef: () => void = () => undefined;

  const add = (files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) {
      return;
    }

    setAttachmentFiles((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: nanoid(),
          type: "file" as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        }))
      )
    );
  };

  const remove = (id: string) => {
    setAttachmentFiles((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clear = () => {
    setAttachmentFiles((prev) => {
      for (const f of prev) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
      return [];
    });
  };

  onCleanup(() => {
    for (const f of attachmentFiles()) {
      if (f.url) {
        URL.revokeObjectURL(f.url);
      }
    }
  });

  const openFileDialog = () => openRef?.();

  const attachments: AttachmentsContext = {
    files: attachmentFiles,
    add,
    remove,
    clear,
    openFileDialog,
    fileInputRef,
  };

  const __registerFileInput = (
    ref: { current: HTMLInputElement | null },
    open: () => void
  ) => {
    fileInputRef.current = ref.current;
    openRef = open;
  };

  const controller: PromptInputControllerProps = {
    textInput: {
      value: textInput,
      setInput: setTextInput,
      clear: clearInput,
    },
    attachments,
    __registerFileInput,
  };

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {local.children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
}

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);

// SSR-safe dummy context for when components render on server without proper context
const serverDummyContext: AttachmentsContext = {
  files: () => [],
  add: () => undefined,
  remove: () => undefined,
  clear: () => undefined,
  openFileDialog: () => undefined,
  fileInputRef: { current: null },
};

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = provider ?? local;
  if (!context) {
    // During SSR, return dummy context to avoid errors
    if (isServer) {
      return serverDummyContext;
    }
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider"
    );
  }
  return context;
};

export type PromptInputAttachmentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart & { id: string };
};

export function PromptInputAttachment(props: PromptInputAttachmentProps) {
  const [local, others] = splitProps(props, ["data", "class"]);
  const attachments = usePromptInputAttachments();

  const filename = () => local.data.filename || "";
  const isImage = () =>
    local.data.mediaType?.startsWith("image/") && local.data.url;
  const attachmentLabel = () =>
    filename() || (isImage() ? "Image" : "Attachment");

  return (
    <PromptInputHoverCard>
      <HoverCardTrigger as="div">
        <div
          class={cn(
            "group relative flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-md border border-border px-1.5 font-medium text-sm transition-all hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            local.class
          )}
          {...others}
        >
          <div class="relative size-5 shrink-0">
            <div class="absolute inset-0 flex size-5 items-center justify-center overflow-hidden rounded bg-background transition-opacity group-hover:opacity-0">
              <Show
                fallback={
                  <div class="flex size-5 items-center justify-center text-muted-foreground">
                    <Paperclip class="size-3" />
                  </div>
                }
                when={isImage()}
              >
                <img
                  alt={filename() || "attachment"}
                  class="size-5 object-cover"
                  height={20}
                  src={local.data.url}
                  width={20}
                />
              </Show>
            </div>
            <Button
              aria-label="Remove attachment"
              class="absolute inset-0 size-5 cursor-pointer rounded p-0 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 [&>svg]:size-2.5"
              onClick={(e) => {
                e.stopPropagation();
                attachments.remove(local.data.id);
              }}
              type="button"
              variant="ghost"
            >
              <X />
              <span class="sr-only">Remove</span>
            </Button>
          </div>
          <span class="flex-1 truncate">{attachmentLabel()}</span>
        </div>
      </HoverCardTrigger>
      <PromptInputHoverCardContent class="w-auto p-2">
        <div class="w-auto space-y-3">
          <Show when={isImage()}>
            <div class="flex max-h-96 w-96 items-center justify-center overflow-hidden rounded-md border">
              <img
                alt={filename() || "attachment preview"}
                class="max-h-full max-w-full object-contain"
                height={384}
                src={local.data.url}
                width={448}
              />
            </div>
          </Show>
          <div class="flex items-center gap-2.5">
            <div class="min-w-0 flex-1 space-y-1 px-0.5">
              <h4 class="truncate font-semibold text-sm leading-none">
                {filename() || (isImage() ? "Image" : "Attachment")}
              </h4>
              <Show when={local.data.mediaType}>
                <p class="truncate font-mono text-muted-foreground text-xs">
                  {local.data.mediaType}
                </p>
              </Show>
            </div>
          </div>
        </div>
      </PromptInputHoverCardContent>
    </PromptInputHoverCard>
  );
}

export type PromptInputAttachmentsProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: (attachment: FileUIPart & { id: string }) => JSX.Element;
};

export function PromptInputAttachments(props: PromptInputAttachmentsProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const attachments = usePromptInputAttachments();

  return (
    <Show when={attachments.files().length > 0}>
      <div
        class={cn("flex w-full flex-wrap items-center gap-2 p-3", local.class)}
        {...others}
      >
        <For each={attachments.files()}>{(file) => local.children(file)}</For>
      </div>
    </Show>
  );
}

export type PromptInputActionAddAttachmentsProps = Parameters<
  typeof DropdownMenuItem
>[0] & {
  label?: string;
};

export function PromptInputActionAddAttachments(
  props: PromptInputActionAddAttachmentsProps
) {
  const [local, others] = splitProps(props, ["label"]);
  const attachments = usePromptInputAttachments();

  return (
    <DropdownMenuItem
      {...others}
      onSelect={() => {
        attachments.openFileDialog();
      }}
    >
      <ImageIcon class="mr-2 size-4" /> {local.label ?? "Add photos or files"}
    </DropdownMenuItem>
  );
}

export interface PromptInputMessage {
  text: string;
  files: FileUIPart[];
}

export type PromptInputProps = Omit<
  JSX.HTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onError"
> & {
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: {
    code: "max_files" | "max_file_size" | "accept";
    message: string;
  }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: SubmitEvent
  ) => void | Promise<void>;
};

export function PromptInput(props: PromptInputProps) {
  const [local, others] = splitProps(props, [
    "class",
    "accept",
    "multiple",
    "globalDrop",
    "syncHiddenInput",
    "maxFiles",
    "maxFileSize",
    "onError",
    "onSubmit",
    "children",
  ]);

  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;

  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const [formRef, setFormRef] = createSignal<HTMLFormElement | null>(null);

  const [items, setItems] = createSignal<(FileUIPart & { id: string })[]>([]);
  const files = () =>
    usingProvider ? controller?.attachments.files() : items();

  const openFileDialogLocal = () => inputRef()?.click();

  const matchesAccept = (f: File) => {
    if (!local.accept || local.accept.trim() === "") {
      return true;
    }
    const patterns = local.accept
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return patterns.some((pattern) => {
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, -1);
        return f.type.startsWith(prefix);
      }
      return f.type === pattern;
    });
  };

  const addLocal = (fileList: File[] | FileList) => {
    const incoming = Array.from(fileList);
    const accepted = incoming.filter((f) => matchesAccept(f));
    if (incoming.length && accepted.length === 0) {
      local.onError?.({
        code: "accept",
        message: "No files match the accepted types.",
      });
      return;
    }
    const withinSize = (f: File) =>
      local.maxFileSize ? f.size <= local.maxFileSize : true;
    const sized = accepted.filter(withinSize);
    if (accepted.length > 0 && sized.length === 0) {
      local.onError?.({
        code: "max_file_size",
        message: "All files exceed the maximum size.",
      });
      return;
    }

    setItems((prev) => {
      const capacity =
        typeof local.maxFiles === "number"
          ? Math.max(0, local.maxFiles - prev.length)
          : undefined;
      const capped =
        typeof capacity === "number" ? sized.slice(0, capacity) : sized;
      if (typeof capacity === "number" && sized.length > capacity) {
        local.onError?.({
          code: "max_files",
          message: "Too many files. Some were not added.",
        });
      }
      const next: (FileUIPart & { id: string })[] = [];
      for (const file of capped) {
        next.push({
          id: nanoid(),
          type: "file",
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        });
      }
      return prev.concat(next);
    });
  };

  const removeLocal = (id: string) =>
    setItems((prev) => {
      const found = prev.find((file) => file.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((file) => file.id !== id);
    });

  const clearLocal = () =>
    setItems((prev) => {
      for (const file of prev) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
      return [];
    });

  const add = usingProvider ? controller?.attachments.add : addLocal;
  const remove = usingProvider ? controller?.attachments.remove : removeLocal;
  const clear = usingProvider ? controller?.attachments.clear : clearLocal;
  const openFileDialog = usingProvider
    ? controller?.attachments.openFileDialog
    : openFileDialogLocal;

  createEffect(() => {
    if (!usingProvider) {
      return;
    }
    const input = inputRef();
    controller?.__registerFileInput({ current: input }, () => input?.click());
  });

  createEffect(() => {
    const input = inputRef();
    if (local.syncHiddenInput && input && files().length === 0) {
      input.value = "";
    }
  });

  // Form drop handlers
  createEffect(() => {
    const form = formRef();
    if (!form || local.globalDrop) {
      return;
    }

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener("dragover", onDragOver);
    form.addEventListener("drop", onDrop);
    onCleanup(() => {
      form.removeEventListener("dragover", onDragOver);
      form.removeEventListener("drop", onDrop);
    });
  });

  // Global drop handlers
  createEffect(() => {
    if (!local.globalDrop) {
      return;
    }

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) {
        e.preventDefault();
      }
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    onCleanup(() => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    });
  });

  onCleanup(() => {
    if (!usingProvider) {
      for (const f of items()) {
        if (f.url) {
          URL.revokeObjectURL(f.url);
        }
      }
    }
  });

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (
    event
  ) => {
    if (event.currentTarget.files) {
      add(event.currentTarget.files);
    }
    event.currentTarget.value = "";
  };

  const convertBlobUrlToDataUrl = async (
    url: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const ctx: AttachmentsContext = {
    files,
    add,
    remove,
    clear,
    openFileDialog,
    fileInputRef: {
      get current() {
        return inputRef();
      },
    },
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
    event
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const text = usingProvider
      ? controller?.textInput.value()
      : (() => {
          const formData = new FormData(form);
          return (formData.get("message") as string) || "";
        })();

    if (!usingProvider) {
      form.reset();
    }

    Promise.all(
      files().map(async ({ id, ...item }) => {
        if (item.url?.startsWith("blob:")) {
          const dataUrl = await convertBlobUrlToDataUrl(item.url);
          return { ...item, url: dataUrl ?? item.url };
        }
        return item;
      })
    )
      .then((convertedFiles: FileUIPart[]) => {
        try {
          const result = local.onSubmit({ text, files: convertedFiles }, event);

          if (result instanceof Promise) {
            result
              .then(() => {
                clear();
                if (usingProvider) {
                  controller?.textInput.clear();
                }
              })
              .catch(() => undefined);
          } else {
            clear();
            if (usingProvider) {
              controller?.textInput.clear();
            }
          }
        } catch {
          // Don't clear on error
        }
      })
      .catch(() => undefined);
  };

  const inner = (
    <>
      <input
        accept={local.accept}
        aria-label="Upload files"
        class="hidden"
        multiple={local.multiple}
        onChange={handleChange}
        ref={setInputRef}
        title="Upload files"
        type="file"
      />
      <form
        class={cn("w-full", local.class)}
        onSubmit={handleSubmit}
        ref={setFormRef}
        {...others}
      >
        <InputGroup class="overflow-hidden">{local.children}</InputGroup>
      </form>
    </>
  );

  return usingProvider ? (
    inner
  ) : (
    <LocalAttachmentsContext.Provider value={ctx}>
      {inner}
    </LocalAttachmentsContext.Provider>
  );
}

export type PromptInputBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputBody(props: PromptInputBodyProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("contents", local.class)} {...others} />;
}

export type PromptInputTextareaProps = Parameters<typeof InputGroupTextarea>[0];

export function PromptInputTextarea(props: PromptInputTextareaProps) {
  const [local, others] = splitProps(props, [
    "onInput",
    "class",
    "placeholder",
    "value",
  ]);
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const [isComposing, setIsComposing] = createSignal(false);

  const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (
    e
  ) => {
    if (e.key === "Enter") {
      if (isComposing() || e.isComposing) {
        return;
      }
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();

      const form = e.currentTarget.form;
      const submitButton = form?.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (submitButton?.disabled) {
        return;
      }

      form?.requestSubmit();
    }

    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      attachments.files().length > 0
    ) {
      e.preventDefault();
      const lastAttachment = attachments.files().at(-1);
      if (lastAttachment) {
        attachments.remove(lastAttachment.id);
      }
    }
  };

  const handlePaste: JSX.EventHandler<HTMLTextAreaElement, ClipboardEvent> = (
    event
  ) => {
    const items = event.clipboardData?.items;
    if (!items) {
      return;
    }

    const files: File[] = [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      event.preventDefault();
      attachments.add(files);
    }
  };

  const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (
    e
  ) => {
    if (controller) {
      controller.textInput.setInput(e.currentTarget.value);
    }
    if (typeof local.onInput === "function") {
      local.onInput(e);
    }
  };

  return (
    <InputGroupTextarea
      class={cn("field-sizing-content max-h-48 min-h-16", local.class)}
      name="message"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={local.placeholder ?? "What would you like to know?"}
      value={controller ? controller.textInput.value() : local.value}
      {...others}
    />
  );
}

export type PromptInputHeaderProps = Omit<
  Parameters<typeof InputGroupAddon>[0],
  "align"
>;

export function PromptInputHeader(props: PromptInputHeaderProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <InputGroupAddon
      align="block-end"
      class={cn("order-first flex-wrap gap-1", local.class)}
      {...others}
    />
  );
}

export type PromptInputFooterProps = Omit<
  Parameters<typeof InputGroupAddon>[0],
  "align"
>;

export function PromptInputFooter(props: PromptInputFooterProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <InputGroupAddon
      align="block-end"
      class={cn("justify-between gap-1", local.class)}
      {...others}
    />
  );
}

export type PromptInputToolsProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputTools(props: PromptInputToolsProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("flex items-center gap-1", local.class)} {...others} />;
}

export type PromptInputButtonProps = Parameters<typeof InputGroupButton>[0];

export function PromptInputButton(props: PromptInputButtonProps) {
  const [local, others] = splitProps(props, [
    "variant",
    "class",
    "size",
    "children",
  ]);
  const resolved = resolveChildren(() => local.children);
  const childCount = () => {
    const c = resolved();
    if (Array.isArray(c)) {
      return c.length;
    }
    return c ? 1 : 0;
  };
  const newSize = () => local.size ?? (childCount() > 1 ? "sm" : "icon-sm");

  return (
    <InputGroupButton
      class={cn(local.class)}
      size={newSize()}
      type="button"
      variant={local.variant ?? "ghost"}
      {...others}
    >
      {local.children}
    </InputGroupButton>
  );
}

export type PromptInputActionMenuProps = Parameters<typeof DropdownMenu>[0];

export function PromptInputActionMenu(props: PromptInputActionMenuProps) {
  return <DropdownMenu {...props} />;
}

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export function PromptInputActionMenuTrigger(
  props: PromptInputActionMenuTriggerProps
) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <DropdownMenuTrigger as={PromptInputButton} class={local.class} {...others}>
      {local.children ?? <Plus class="size-4" />}
    </DropdownMenuTrigger>
  );
}

export type PromptInputActionMenuContentProps = Parameters<
  typeof DropdownMenuContent
>[0];

export function PromptInputActionMenuContent(
  props: PromptInputActionMenuContentProps
) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <DropdownMenuContent align="start" class={cn(local.class)} {...others} />
  );
}

export type PromptInputActionMenuItemProps = Parameters<
  typeof DropdownMenuItem
>[0];

export function PromptInputActionMenuItem(
  props: PromptInputActionMenuItemProps
) {
  const [local, others] = splitProps(props, ["class"]);
  return <DropdownMenuItem class={cn(local.class)} {...others} />;
}

export type PromptInputSubmitProps = Parameters<typeof InputGroupButton>[0] & {
  status?: ChatStatus;
};

export function PromptInputSubmit(props: PromptInputSubmitProps) {
  const [local, others] = splitProps(props, [
    "class",
    "variant",
    "size",
    "status",
    "children",
  ]);

  const Icon = () => {
    if (local.status === "submitted") {
      return <Loader2 class="size-4 animate-spin" />;
    }
    if (local.status === "streaming") {
      return <Square class="size-4" />;
    }
    if (local.status === "error") {
      return <X class="size-4" />;
    }
    return <CornerDownLeft class="size-4" />;
  };

  return (
    <InputGroupButton
      aria-label="Submit"
      class={cn(local.class)}
      size={local.size ?? "icon-sm"}
      type="submit"
      variant={local.variant ?? "default"}
      {...others}
    >
      {local.children ?? <Icon />}
    </InputGroupButton>
  );
}

// Speech Recognition Types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

export type PromptInputSpeechButtonProps = Parameters<
  typeof PromptInputButton
>[0] & {
  textareaRef?: { current: HTMLTextAreaElement | null };
  onTranscriptionChange?: (text: string) => void;
};

export function PromptInputSpeechButton(props: PromptInputSpeechButtonProps) {
  const [local, others] = splitProps(props, [
    "class",
    "textareaRef",
    "onTranscriptionChange",
  ]);
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal<SpeechRecognition | null>(
    null
  );

  createEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognitionCtor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognitionCtor();

      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      speechRecognition.onstart = () => setIsListening(true);
      speechRecognition.onend = () => setIsListening(false);

      speechRecognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0]?.transcript ?? "";
          }
        }

        if (finalTranscript && local.textareaRef?.current) {
          const textarea = local.textareaRef.current;
          const currentValue = textarea.value;
          const newValue =
            currentValue + (currentValue ? " " : "") + finalTranscript;
          textarea.value = newValue;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          local.onTranscriptionChange?.(newValue);
        }
      };

      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    }

    onCleanup(() => recognition()?.stop());
  });

  const toggleListening = () => {
    const rec = recognition();
    if (!rec) {
      return;
    }
    if (isListening()) {
      rec.stop();
    } else {
      rec.start();
    }
  };

  return (
    <PromptInputButton
      class={cn(
        "relative transition-all duration-200",
        isListening() && "animate-pulse bg-accent text-accent-foreground",
        local.class
      )}
      disabled={!recognition()}
      onClick={toggleListening}
      {...others}
    >
      <Mic class="size-4" />
    </PromptInputButton>
  );
}

export type PromptInputSelectProps = Parameters<typeof Select>[0];

export function PromptInputSelect(props: PromptInputSelectProps) {
  return <Select {...props} />;
}

export type PromptInputSelectTriggerProps = Parameters<typeof SelectTrigger>[0];

export function PromptInputSelectTrigger(props: PromptInputSelectTriggerProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <SelectTrigger
      class={cn(
        "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
        "hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground",
        local.class
      )}
      {...others}
    />
  );
}

export type PromptInputSelectContentProps = Parameters<typeof SelectContent>[0];

export function PromptInputSelectContent(props: PromptInputSelectContentProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <SelectContent class={cn(local.class)} {...others} />;
}

export type PromptInputSelectItemProps = Parameters<typeof SelectItem>[0];

export function PromptInputSelectItem(props: PromptInputSelectItemProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <SelectItem class={cn(local.class)} {...others} />;
}

export type PromptInputSelectValueProps = Parameters<typeof SelectValue>[0];

export function PromptInputSelectValue(props: PromptInputSelectValueProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <SelectValue class={cn(local.class)} {...others} />;
}

export type PromptInputHoverCardProps = Parameters<typeof HoverCard>[0];

export function PromptInputHoverCard(props: PromptInputHoverCardProps) {
  const [local, others] = splitProps(props, ["openDelay", "closeDelay"]);
  return (
    <HoverCard
      closeDelay={local.closeDelay ?? 0}
      openDelay={local.openDelay ?? 0}
      {...others}
    />
  );
}

export type PromptInputHoverCardTriggerProps = Parameters<
  typeof HoverCardTrigger
>[0];

export function PromptInputHoverCardTrigger(
  props: PromptInputHoverCardTriggerProps
) {
  return <HoverCardTrigger {...props} />;
}

export type PromptInputHoverCardContentProps = Parameters<
  typeof HoverCardContent
>[0];

export function PromptInputHoverCardContent(
  props: PromptInputHoverCardContentProps
) {
  const [local, others] = splitProps(props, ["align"]);
  return <HoverCardContent align={local.align ?? "start"} {...others} />;
}

export type PromptInputTabsListProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputTabsList(props: PromptInputTabsListProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn(local.class)} {...others} />;
}

export type PromptInputTabProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputTab(props: PromptInputTabProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn(local.class)} {...others} />;
}

export type PromptInputTabLabelProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export function PromptInputTabLabel(props: PromptInputTabLabelProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <h3
      class={cn(
        "mb-2 px-3 font-medium text-muted-foreground text-xs",
        local.class
      )}
      {...others}
    />
  );
}

export type PromptInputTabBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputTabBody(props: PromptInputTabBodyProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("space-y-1", local.class)} {...others} />;
}

export type PromptInputTabItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export function PromptInputTabItem(props: PromptInputTabItemProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent",
        local.class
      )}
      {...others}
    />
  );
}

export type PromptInputCommandProps = Parameters<typeof Command>[0];

export function PromptInputCommand(props: PromptInputCommandProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <Command class={cn(local.class)} {...others} />;
}

export type PromptInputCommandInputProps = Parameters<typeof CommandInput>[0];

export function PromptInputCommandInput(props: PromptInputCommandInputProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandInput class={cn(local.class)} {...others} />;
}

export type PromptInputCommandListProps = Parameters<typeof CommandList>[0];

export function PromptInputCommandList(props: PromptInputCommandListProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandList class={cn(local.class)} {...others} />;
}

export type PromptInputCommandEmptyProps = Parameters<typeof CommandEmpty>[0];

export function PromptInputCommandEmpty(props: PromptInputCommandEmptyProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandEmpty class={cn(local.class)} {...others} />;
}

export type PromptInputCommandGroupProps = Parameters<typeof CommandGroup>[0];

export function PromptInputCommandGroup(props: PromptInputCommandGroupProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandGroup class={cn(local.class)} {...others} />;
}

export type PromptInputCommandItemProps = Parameters<typeof CommandItem>[0];

export function PromptInputCommandItem(props: PromptInputCommandItemProps) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandItem class={cn(local.class)} {...others} />;
}

export type PromptInputCommandSeparatorProps = Parameters<
  typeof CommandSeparator
>[0];

export function PromptInputCommandSeparator(
  props: PromptInputCommandSeparatorProps
) {
  const [local, others] = splitProps(props, ["class"]);
  return <CommandSeparator class={cn(local.class)} {...others} />;
}
