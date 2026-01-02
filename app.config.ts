import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import pkg from "@vinxi/plugin-mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const { default: mdx } = pkg;

export default defineConfig({
  extensions: ["mdx"],
  vite: {
    plugins: [
      tailwindcss(),
      mdx.withImports({
        // Inject these imports into every MDX file
        "@/components/mdx": ["Callout", "Preview", "ElementsInstaller", "ElementsDemo", "TypeTable"],
      })({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
