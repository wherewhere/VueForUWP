/// <reference types="vite/client" />
/// <reference types="@types/winrt-uwp" />
/// <reference types="@types/winjs" />

declare module "*.md" {
  import type { defineComponent, ComponentObjectPropsOptions, HTMLAttributes } from "vue";
  export const excerpt: string | undefined;
  const frontmatter: { [key: string]: string | typeof frontmatter | undefined };
  const component: ReturnType<typeof defineComponent<HTMLAttributes, ComponentObjectPropsOptions, string, {}, {}, string, { excerpt?: string, frontmatter?: typeof frontmatter }>>;
  export default component;
}

declare module "@microsoft/clarity/src/utils" {
    export function injectScript(projectId: string): void;
}