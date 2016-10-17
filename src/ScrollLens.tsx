import * as React from 'react'
import { Component, Props, HTMLAttributes, CSSProperties } from 'react'

const scrollerStyle: CSSProperties = {
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}

export interface ScrollLensProps extends HTMLAttributes<HTMLDivElement>, Props<ScrollLens> {
  itemHeight?: number
  items: any[]
  renderItem?: (i: number) => JSX.Element
  onRequestLoadingFromTop?: Function
  onRequestLoadingFromBottom?: Function
}

export interface ScrollLensState {

}

export class ScrollLens extends Component<ScrollLensProps, ScrollLensState> {
  static defaultProps = {
    itemHeight: 10,
    renderItem: (i: number) => <div>{i}</div>
  }

  // elements

  private get scroller(): HTMLDivElement {
    return this.refs['scroller'] as HTMLDivElement
  }

  private get container(): HTMLDivElement {
    return this.refs['container'] as HTMLDivElement
  }

  private get visible(): HTMLDivElement {
    return this.refs['visible'] as HTMLDivElement
  }

  // parameters

  private get size(): number {
    return this.props.items ? this.props.items.length : 0
  }

  private get height(): number {
    return this.size * this.props.itemHeight
  }

  private get scrollHeight(): number {
    if (!this.scroller)
      return 0
    else return this.scroller.scrollHeight
  }

  private get scrollerHeight(): number {
    if (!this.scroller)
      return 0
    else return this.scroller.offsetHeight
  }

  // offsets

  private get scrollTop(): number {
    if (!this.scroller)
      return 0
    else return this.scroller.scrollTop
  }

  private get offsetTop(): number {
    return this.scrollTop
  }

  private get offsetBottom(): number {
    return this.scrollHeight - this.scrollTop - this.scrollerHeight
  }

  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.updateView()
  }

  componentWillReceiveProps(next: ScrollLensProps) {

  }

  onScroll() {
    console.log(this.offsetTop, this.offsetBottom, this.scrollerHeight, this.height)
    if (this.props.onRequestLoadingFromTop && this.offsetTop === 0) {
      this.props.onRequestLoadingFromTop()
    }
    if (this.props.onRequestLoadingFromBottom && this.offsetBottom === 0) {
      this.props.onRequestLoadingFromBottom()
    }
  }

  updateView() {
    if (this.props.items) {
      this.container.style.height = this.height + 'px'
    }
  }

  renderItems(): JSX.Element[] {
    return this.props.items.map((item: any, i: number) => {
      return <div key={i}>
        {this.props.renderItem(i)}
      </div>
    })
  }

  render() {
    const {style, className, id} = this.props

    return <div
      id={id}
      className={className}
      style={Object.assign(scrollerStyle, style)}
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