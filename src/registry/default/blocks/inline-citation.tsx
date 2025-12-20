import {
  createEffect,
  onCleanup,
  splitProps,
  Show,
  type JSX,
  type ParentProps,
} from "solid-js";
import { Badge } from "@repo/solid-ui/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@repo/solid-ui/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/solid-ui/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-solid";

export type InlineCitationProps = JSX.HTMLAttributes<HTMLSpanElement>;

export function InlineCitation(props: InlineCitationProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <span class={cn("group inline items-center gap-1", local.class)} {...others}>
      {local.children}
    </span>
  );
}

export type InlineCitationTextProps = JSX.HTMLAttributes<HTMLSpanElement>;

export function InlineCitationText(props: InlineCitationTextProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <span
      class={cn("transition-colors group-hover:bg-accent", local.class)}
      {...others}
    >
      {local.children}
    </span>
  );
}

export type InlineCitationCardProps = Parameters<typeof HoverCard>[0];

export function InlineCitationCard(props: InlineCitationCardProps) {
  return <HoverCard closeDelay={0} openDelay={0} {...props} />;
}

export type InlineCitationCardTriggerProps = Parameters<typeof Badge>[0] & {
  sources: string[];
};

export function InlineCitationCardTrigger(props: InlineCitationCardTriggerProps) {
  const [local, others] = splitProps(props, ["sources", "class", "children"]);

  const hostname = () => {
    try {
      return local.sources[0] ? new URL(local.sources[0]).hostname : "unknown";
    } catch {
      return "unknown";
    }
  };

  return (
    <HoverCardTrigger>
      <Badge
        class={cn("ml-1 rounded-full", local.class)}
        variant="secondary"
        {...others}
      >
        <Show when={local.sources[0]} fallback="unknown">
          {hostname()}{" "}
          <Show when={local.sources.length > 1}>
            +{local.sources.length - 1}
          </Show>
        </Show>
      </Badge>
    </HoverCardTrigger>
  );
}

export type InlineCitationCardBodyProps = JSX.HTMLAttributes<HTMLDivElement>;

export function InlineCitationCardBody(props: InlineCitationCardBodyProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <HoverCardContent class={cn("relative w-80 p-0", local.class)} {...others}>
      {local.children}
    </HoverCardContent>
  );
}

export type InlineCitationCarouselProps = Parameters<typeof Carousel>[0];

export function InlineCitationCarousel(props: InlineCitationCarouselProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <Carousel class={cn("w-full", local.class)} {...others}>
      {local.children}
    </Carousel>
  );
}

export type InlineCitationCarouselContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselContent(
  props: InlineCitationCarouselContentProps
) {
  return <CarouselContent {...props} />;
}

export type InlineCitationCarouselItemProps = JSX.HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselItem(props: InlineCitationCarouselItemProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <CarouselItem class={cn("w-full space-y-2 p-4 pl-8", local.class)} {...others}>
      {local.children}
    </CarouselItem>
  );
}

export type InlineCitationCarouselHeaderProps = JSX.HTMLAttributes<HTMLDivElement>;

export function InlineCitationCarouselHeader(props: InlineCitationCarouselHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={cn(
        "flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

export type InlineCitationCarouselIndexProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

export function InlineCitationCarouselIndex(props: InlineCitationCarouselIndexProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const { api } = useCarousel();

  const current = () => {
    const embla = api();
    return embla ? embla.selectedScrollSnap() + 1 : 0;
  };

  const count = () => {
    const embla = api();
    return embla ? embla.scrollSnapList().length : 0;
  };

  return (
    <div
      class={cn(
        "flex flex-1 items-center justify-end px-3 py-1 text-muted-foreground text-xs",
        local.class
      )}
      {...others}
    >
      {local.children ?? `${current()}/${count()}`}
    </div>
  );
}

export type InlineCitationCarouselPrevProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export function InlineCitationCarouselPrev(props: InlineCitationCarouselPrevProps) {
  const [local, others] = splitProps(props, ["class"]);
  const { scrollPrev } = useCarousel();

  return (
    <button
      aria-label="Previous"
      class={cn("shrink-0", local.class)}
      onClick={scrollPrev}
      type="button"
      {...others}
    >
      <ArrowLeft class="size-4 text-muted-foreground" />
    </button>
  );
}

export type InlineCitationCarouselNextProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export function InlineCitationCarouselNext(props: InlineCitationCarouselNextProps) {
  const [local, others] = splitProps(props, ["class"]);
  const { scrollNext } = useCarousel();

  return (
    <button
      aria-label="Next"
      class={cn("shrink-0", local.class)}
      onClick={scrollNext}
      type="button"
      {...others}
    >
      <ArrowRight class="size-4 text-muted-foreground" />
    </button>
  );
}

export type InlineCitationSourceProps = JSX.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  url?: string;
  description?: string;
};

export function InlineCitationSource(props: InlineCitationSourceProps) {
  const [local, others] = splitProps(props, [
    "title",
    "url",
    "description",
    "class",
    "children",
  ]);

  return (
    <div class={cn("space-y-1", local.class)} {...others}>
      <Show when={local.title}>
        <h4 class="truncate font-medium text-sm leading-tight">{local.title}</h4>
      </Show>
      <Show when={local.url}>
        <p class="truncate break-all text-muted-foreground text-xs">{local.url}</p>
      </Show>
      <Show when={local.description}>
        <p class="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
          {local.description}
        </p>
      </Show>
      {local.children}
    </div>
  );
}

export type InlineCitationQuoteProps = ParentProps<
  JSX.HTMLAttributes<HTMLQuoteElement>
>;

export function InlineCitationQuote(props: InlineCitationQuoteProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <blockquote
      class={cn(
        "border-muted border-l-2 pl-3 text-muted-foreground text-sm italic",
        local.class
      )}
      {...others}
    >
      {local.children}
    </blockquote>
  );
}
