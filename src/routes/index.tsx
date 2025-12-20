import { Title } from "@solidjs/meta";
import { Loader } from "@/registry/default/ui/loader";
import { Shimmer } from "@/registry/default/ui/shimmer";

export default function Home() {
  return (
    <main class="container mx-auto max-w-4xl px-4 py-8">
      <Title>AI Elements - SolidJS</Title>

      <header class="mb-8">
        <h1 class="text-3xl font-bold">AI Elements for Solid.js</h1>
        <p class="text-muted-foreground mt-2">
          A custom registry for distributing code using shadcn - ported to SolidJS.
        </p>
      </header>

      <div class="flex flex-col gap-8">
        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold">Shimmer</h2>
              <p class="text-sm text-muted-foreground">
                A shimmer component
              </p>
            </div>
          </div>
          <div class="min-h-[200px] flex items-center justify-center rounded-md border bg-muted/50">
            <Shimmer>This is a shimmer component</Shimmer>
          </div>
        </section>
        <section class="rounded-lg border p-6">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold">Loader</h2>
              <p class="text-sm text-muted-foreground">
                A loader component
              </p>
            </div>
          </div>
          <div class="min-h-[200px] flex items-center justify-center rounded-md border bg-muted/50">
            <Loader />
          </div>
        </section>
      </div>
    </main>
  );
}
