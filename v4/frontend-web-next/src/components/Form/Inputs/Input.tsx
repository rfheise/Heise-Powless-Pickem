"use client";

import React from "react";

export interface Props {
  value: any;
  update(updateValue: any): void;
  title: string;
  placeholder?: string;
  [wildcard: string]: any;
}

//class used just for polymorphic inheritance
//of other input classes
export default class Input extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    let placeholder = props.placeholder;
    if (!placeholder) {
      placeholder = "";
    }
    this.state = {};
  }
  shouldComponentUpdate(nextProps: Props, nextState: any) {
    return nextProps.value != this.props.value;
  }
  update(event: any) {
    this.props.update(event.target.value);
  }
}
