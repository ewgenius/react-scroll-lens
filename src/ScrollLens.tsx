import * as React from 'react'
import { Component, Props, HTMLAttributes } from 'react'

export interface ScrollLensProps extends HTMLAttributes<HTMLDivElement>, Props<ScrollLens> {

}

export class ScrollLens extends Component<ScrollLensProps, {}> {
  render() {
    const {style, className, id} = this.props
    return <div
      id={id}
      className={className}
      style={style}>
      {this.props.children}
    </div>
  }
}