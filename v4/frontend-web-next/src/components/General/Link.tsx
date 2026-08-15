import NextLink from "next/link";

interface Props {
  route: string;
  title: string;
}

export default function Link(props: Props) {
  return (
    <NextLink href={props.route} className="link">
      {props.title}
    </NextLink>
  );
}
