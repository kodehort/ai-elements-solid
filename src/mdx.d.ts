declare module "*.mdx" {
  import type { Component } from "solid-js";

  interface MDXProps {
    components?: Record<string, Component<unknown>>;
  }

  const MDXComponent: Component<MDXProps>;
  export default MDXComponent;

  export interface Frontmatter {
    title: string;
    description?: string;
    path?: string;
    category?: string;
    order?: number;
  }
  export const frontmatter: Frontmatter;
}
