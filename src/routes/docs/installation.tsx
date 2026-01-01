import { DocsLayout } from "@/components/layout";

export default function InstallationPage() {
  return (
    <DocsLayout>
      <div class="space-y-6">
        <div>
          <h1 class="font-bold text-3xl tracking-tight">Installation</h1>
          <p class="mt-2 text-muted-foreground">
            How to install AI Elements in your project.
          </p>
        </div>

        <div class="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Prerequisites</h2>
          <ul>
            <li>Solid.js 1.9+</li>
            <li>Tailwind CSS 4.0+</li>
            <li>Node.js 18+</li>
          </ul>

          <h2>Install Dependencies</h2>
          <pre class="overflow-x-auto rounded-lg bg-muted p-4">
            <code>bun add @repo/elements @repo/solid-ui ai ai-sdk-solid</code>
          </pre>

          <h2>Configure Tailwind</h2>
          <p>Add the component paths to your Tailwind config:</p>
          <pre class="overflow-x-auto rounded-lg bg-muted p-4">
            <code>{`// tailwind.config.ts
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@repo/elements/src/**/*.{ts,tsx}",
    "./node_modules/@repo/solid-ui/**/*.{ts,tsx}",
  ],
  // ...
}`}</code>
          </pre>

          <h2>Import Styles</h2>
          <p>Import the base styles in your app:</p>
          <pre class="overflow-x-auto rounded-lg bg-muted p-4">
            <code>{`// app.css
@import "tailwindcss";

:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... other CSS variables */
}`}</code>
          </pre>
        </div>
      </div>
    </DocsLayout>
  );
}
