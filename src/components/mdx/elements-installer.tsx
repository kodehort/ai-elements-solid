interface Props {
  path?: string;
}

export function ElementsInstaller(props: Props) {
  const installPath = () =>
    props.path
      ? `https://ai-elements.vercel.app/r/${props.path}`
      : "https://ai-elements.vercel.app/r";

  return (
    <div class="my-4">
      <pre class="overflow-x-auto rounded-lg bg-muted p-4">
        <code>npx shadcn@latest add {installPath()}</code>
      </pre>
    </div>
  );
}
