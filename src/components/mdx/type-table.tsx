import { For } from "solid-js";

interface TypeInfo {
  description: string;
  type: string;
  default?: string;
}

interface Props {
  type: Record<string, TypeInfo>;
}

export function TypeTable(props: Props) {
  return (
    <div class="my-4 overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b">
            <th class="px-3 py-2 text-left font-medium">Prop</th>
            <th class="px-3 py-2 text-left font-medium">Type</th>
            <th class="px-3 py-2 text-left font-medium">Default</th>
            <th class="px-3 py-2 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.entries(props.type)}>
            {([name, info]) => (
              <tr class="border-b">
                <td class="px-3 py-2 font-mono text-primary">{name}</td>
                <td class="px-3 py-2 font-mono text-muted-foreground">
                  {info.type}
                </td>
                <td class="px-3 py-2 font-mono text-muted-foreground">
                  {info.default || "-"}
                </td>
                <td class="px-3 py-2">{info.description}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
