import Image from "next/image";
import { generateLink } from "@/lib/config";

interface Props {
  //path returned by the api, e.g. "/media/propics/foo.png"
  src: string;
  alt: string;
  //the css box these sit in is fixed, this is the intrinsic size we ask for
  size: number;
  priority?: boolean;
}

//An animated image would come back from the optimiser as a single still
//frame, so those have to be left alone. Everything else is fair game.
function keepsOriginalBytes(path: string) {
  return path.toLowerCase().split("?")[0].endsWith(".gif");
}

//A profile picture.
//
//These are phone camera uploads - the originals run to 6000px and several
//megabytes each, for a circle that is never wider than 56px. Optimising them
//is the single biggest win available on the list pages, so everything except
//animated gifs goes through the optimiser.
export function Propic(props: Props) {
  return (
    <Image
      src={generateLink(props.src)}
      alt={props.alt}
      width={props.size}
      height={props.size}
      unoptimized={keepsOriginalBytes(props.src)}
      priority={props.priority}
    />
  );
}

//A team logo. These are static pngs the league controls, so they are safe to
//optimise and they repeat many times per page.
export function Logo(props: Props) {
  return (
    <Image
      src={generateLink(props.src)}
      alt={props.alt}
      width={props.size}
      height={props.size}
    />
  );
}
