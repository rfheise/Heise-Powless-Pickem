interface Props {
  image: string;
  style?: any;
  width?: string;
  height?: string;
  className?: string;
  alt?: string;
}

//The preview inside the profile picture form input.
//
//This one stays a plain <img>: its src is a data: url produced by FileReader
//from the file the user just chose, which next/image cannot take.
export default function Propic(props: Props) {
  let style = { height: props.height, width: props.width };
  return (
    <div
      className={`image-input-border${props.className ? ` ${props.className}` : ""}`}
      style={{ ...props.style, ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        style={style}
        src={props.image}
        alt={props.alt ? props.alt : ""}
        className="input-image"
      />
    </div>
  );
}
