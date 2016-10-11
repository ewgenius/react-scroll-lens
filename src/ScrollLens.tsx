import * as React from 'react'
import { Component, Props, HTMLAttributes } from 'react'

export interface ScrollLensProps extends HTMLAttributes<HTMLDivElement>, Props<ScrollLens> {
  itemHeight?: number
  items: any[]
}

export interface ScrollLensState {

}

export class ScrollLens extends Component<ScrollLensProps, ScrollLensState> {
  static defaultProps = {
    itemHeight: 10
  }

  constructor() {
    super()
    this.state = {}
  }

  onScroll() {

  }

  renderItems(): JSX.Element {
    return <b>222</b>
  }

  render() {
    const {style, className, id} = this.props
    return <div
      id={id}
      className={className}
      style={style}
      onScroll={() => this.onScroll()}
      ref='scroller'>
      <div ref='container'>
        <div ref='visible'>
          {this.renderItems()}
        </div>
      </div>
    </div>
  }
}