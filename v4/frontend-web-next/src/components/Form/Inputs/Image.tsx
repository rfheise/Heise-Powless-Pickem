"use client";

import Input from "./Input";
import DefaultImage from "@/images/upload.png";
import Propic from "../../General/Propic";

export default class Image extends Input {
  //FileReader does not exist while the page is being prerendered on the
  //server, so it is built the first time a file is actually chosen rather
  //than in the constructor
  reader: FileReader | null = null;

  constructor(props: any) {
    super(props);
    let initialImage = DefaultImage.src;
    if (props.image) {
      initialImage = props.image;
    }
    this.state = { ...this.state, image: initialImage };
  }

  getReader() {
    if (!this.reader) {
      this.reader = new FileReader();
      this.reader.onload = () => {
        this.setState({ image: this.reader!.result });
      };
    }
    return this.reader;
  }

  update(event: any) {
    this.getReader().readAsDataURL(event.target.files[0]);
    this.props.update(event.target.files[0]);
  }

  shouldComponentUpdate(prevProps: any, prevState: any) {
    return (
      this.props.value != prevProps.value || this.state.image != prevState.image
    );
  }

  render() {
    return (
      <div className="form-input">
        <Propic image={this.state.image} />
        <input
          type="file"
          id="image-input"
          className="image-input"
          onChange={this.update.bind(this)}
        />
        <label htmlFor="image-input" className="form-button">
          {this.props.title}
        </label>
      </div>
    );
  }
}
