import { A, useLocation } from "@solidjs/router";
import {
  createMemo,
  createSignal,
  For,
  onMount,
  type ParentProps,
  Show,
} from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type NavItem, navigation } from "@/lib/source";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
];

function NavbarLink(props: { href: string; label: string }) {
  const location = useLocation();
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));

  const isActive = createMemo(() => {
    if (!mounted()) {
      return false;
    }
    const pathname = location.pathname;
    if (props.href === "/") {
      return pathname === "/";
    }
    return pathname === props.href || pathname.startsWith(`${props.href}/`);
  });

  return (
    <A
      class="text-foreground/60 transition-colors hover:text-foreground/80"
      classList={{ "!text-foreground": isActive() }}
      href={props.href}
    >
      {props.label}
    </A>
  );
}

export function Navbar() {
  return (
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center">
        <A class="mr-6 flex items-center space-x-2" href="/">
          <span class="font-bold">AI Elements</span>
          <span class="text-muted-foreground">for Solid</span>
        </A>
        <nav class="flex items-center space-x-6 font-medium text-sm">
          <For each={navItems}>
            {(item) => <NavbarLink href={item.href} label={item.label} />}
          </For>
        </nav>
        <div class="ml-auto flex items-center space-x-4">
          <a
            class="text-muted-foreground hover:text-foreground"
            href="https://github.com/haydenbleasel/ai-elements"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink(props: { item: NavItem; depth?: number }) {
  const location = useLocation();
  const [mounted, setMounted] = createSignal(false);
  onMount(() => setMounted(true));

  const isActive = createMemo(() => {
    if (!mounted()) {
      return false;
    }
    return location.pathname === props.item.href;
  });
  const depth = () => props.depth ?? 0;

  return (
    <div>
      <A
        class="block rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted"
        classList={{
          "!bg-muted !font-medium !text-foreground": isActive(),
          "pl-6": depth() > 0,
        }}
        href={props.item.href}
      >
        {props.item.title}
      </A>
      <Show when={props.item.items && props.item.items.length > 0}>
        <div class="ml-2">
          <For each={props.item.items}>
            {(subItem) => <NavLink depth={depth() + 1} item={subItem} />}
          </For>
        </div>
      </Show>
    </div>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <aside class="hidden w-64 shrink-0 border-r md:block">
          <nav class="sticky top-14 h-[calc(100vh-3.5rem)] space-y-1 overflow-y-auto p-4">
            <For each={navigation}>{(item) => <NavLink item={item} />}</For>
          </nav>
        </aside>
      </SidebarContent>
    </Sidebar>
  );
}

export function DocsLayout(props: ParentProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger />
        <Navbar />
        <main  class="p-6 prose">{props.children}</main>
      </div>
    </SidebarProvider>
  );
}

export function PageLayout(props: ParentProps) {
  return (
    <div class="min-h-screen">
      <Navbar />
      <main class="p-6">{props.children}</main>
    </div>
  );
}
