import { splitProps, type JSX } from "solid-js";
import { cn } from "@/lib/utils";

export type ImageProps = {
  base64?: string;
  uint8Array?: Uint8Array;
  mediaType?: string;
  src?: string;
  class?: string;
  alt?: string;
} & Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "src">;

export function Image(props: ImageProps) {
  const [local, others] = splitProps(props, ["base64", "uint8Array", "mediaType", "src", "class", "alt"]);

  const imageSrc = () => {
    if (local.src) {
      return local.src;
    }
    if (local.base64) {
      return `data:${local.mediaType || "image/png"};base64,${local.base64}`;
    }
    return "";
  };

  return (
    <img
      alt={local.alt}
      class={cn("h-auto max-w-full overflow-hidden rounded-md", local.class)}
      src={imageSrc()}
      {...others}
    />
  );
}
