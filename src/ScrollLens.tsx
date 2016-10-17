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
  loadingTop?: boolean
  loadingBottom?: boolean
  loader?: JSX.Element
}

export interface ScrollLensState {

}

export class ScrollLens extends Component<ScrollLensProps, ScrollLensState> {
  static defaultProps = {
    itemHeight: 10,
    renderItem: (i: number) => <div>{i}</div>,
    loader: <div>loading</div>
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
    if (next.items.length !== this.props.items.length) {
      this.updateView()
    }
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
    const {style, className, id, loadingTop, loadingBottom, loader} = this.props

    return <div
      id={id}
      className={className}
      style={Object.assign(scrollerStyle, style)}
      onScroll={() => this.onScroll()}
      ref='scroller'>
      <div ref='container'>
        <div ref='visible'>
          {loadingTop && loader}
          {this.renderItems()}
          {loadingBottom && loader}
        </div>
      </div>
    </div>
  }
}