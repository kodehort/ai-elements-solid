import {
  type Accessor,
  createContext,
  createSignal,
  type JSX,
  onCleanup,
  onMount,
  type ParentProps,
  splitProps,
  useContext,
} from "solid-js";

export type ScrollBehavior = "smooth" | "instant" | "auto";

export interface StickToBottomContextValue {
  isAtBottom: Accessor<boolean>;
  scrollToBottom: () => Promise<boolean>;
}

const StickToBottomContext = createContext<StickToBottomContextValue>();

export function useStickToBottomContext() {
  const context = useContext(StickToBottomContext);
  if (!context) {
    throw new Error(
      "useStickToBottomContext must be used within StickToBottom"
    );
  }
  return context;
}

export interface UseStickToBottomOptions {
  initial?: ScrollBehavior;
  resize?: ScrollBehavior;
}

export function createStickToBottom(options: UseStickToBottomOptions = {}) {
  const { initial = "instant", resize = "smooth" } = options;

  let scrollRef: HTMLElement | undefined;
  let _contentRef: HTMLElement | undefined;

  const [isAtBottom, setIsAtBottom] = createSignal(true);
  const [isSticky, setIsSticky] = createSignal(true);

  const checkIfAtBottom = () => {
    if (!scrollRef) {
      return true;
    }
    const { scrollTop, scrollHeight, clientHeight } = scrollRef;
    const threshold = 10;
    return scrollHeight - scrollTop - clientHeight <= threshold;
  };

  const scrollToBottom = (
    behavior: ScrollBehavior = "smooth"
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!scrollRef) {
        resolve(false);
        return;
      }

      const targetScrollTop = scrollRef.scrollHeight - scrollRef.clientHeight;

      if (behavior === "instant") {
        scrollRef.scrollTop = targetScrollTop;
        setIsAtBottom(true);
        setIsSticky(true);
        resolve(true);
        return;
      }

      scrollRef.scrollTo({
        top: targetScrollTop,
        behavior: behavior === "smooth" ? "smooth" : "auto",
      });

      // Wait for scroll to complete
      requestAnimationFrame(() => {
        setIsAtBottom(true);
        setIsSticky(true);
        resolve(true);
      });
    });
  };

  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);

    // If user scrolled up manually, disable stickiness
    if (atBottom) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  const setupScrollRef = (el: HTMLElement) => {
    scrollRef = el;

    el.addEventListener("scroll", handleScroll, { passive: true });

    // Initial scroll
    if (initial === "smooth") {
      requestAnimationFrame(() => scrollToBottom("smooth"));
    } else {
      scrollToBottom("instant");
    }

    onCleanup(() => {
      el.removeEventListener("scroll", handleScroll);
    });
  };

  const setupContentRef = (el: HTMLElement) => {
    _contentRef = el;

    // Observe content size changes
    const resizeObserver = new ResizeObserver(() => {
      if (isSticky() && scrollRef) {
        scrollToBottom(resize);
      }
    });

    resizeObserver.observe(el);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  };

  return {
    scrollRef: setupScrollRef,
    contentRef: setupContentRef,
    isAtBottom,
    scrollToBottom: () => scrollToBottom("smooth"),
  };
}

export type StickToBottomProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement> & UseStickToBottomOptions
>;

export function StickToBottom(props: StickToBottomProps) {
  const [local, options, others] = splitProps(
    props,
    ["children", "class"],
    ["initial", "resize"]
  );

  const {
    scrollRef,
    contentRef: _contentRef,
    isAtBottom,
    scrollToBottom,
  } = createStickToBottom(options);

  return (
    <StickToBottomContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div class={local.class} ref={scrollRef} {...others}>
        {local.children}
      </div>
    </StickToBottomContext.Provider>
  );
}

export type StickToBottomContentProps = ParentProps<
  JSX.HTMLAttributes<HTMLDivElement>
>;

function StickToBottomContent(props: StickToBottomContentProps) {
  const [local, others] = splitProps(props, ["children", "class"]);
  const _context = useStickToBottomContext();

  let contentEl: HTMLDivElement | undefined;

  const setContentRef = (el: HTMLDivElement) => {
    contentEl = el;
  };

  onMount(() => {
    if (contentEl) {
      // Re-observe content when mounted
      const resizeObserver = new ResizeObserver(() => {
        // The parent context handles scrolling
      });
      resizeObserver.observe(contentEl);
      onCleanup(() => resizeObserver.disconnect());
    }
  });

  return (
    <div class={local.class} ref={setContentRef} {...others}>
      {local.children}
    </div>
  );
}

StickToBottom.Content = StickToBottomContent;
