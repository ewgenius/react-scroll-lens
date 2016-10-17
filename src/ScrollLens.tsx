import * as React from 'react'
import { Component, Props, HTMLAttributes, CSSProperties } from 'react'

const scrollerStyle: CSSProperties = {
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}

const containerStyle: CSSProperties = {
  overflow: 'hidden'
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
  visibleIndexTop?: number
  visibleIndexBottom?: number
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

  private set visibleTopOffset(value: number) {
    if (this.visible) {
      this.visible.style.transform = `translate(0px, ${value}px)`
    }
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

  // jump to

  public scrollToTop() {
    if (this.scroller) {
      this.scroller.scrollTop = 0
    }
  }

  public scrollToBottom() {
    if (this.scroller) {
      this.scroller.scrollTop += this.scrollHeight
    }
  }

  public scrollTo(index: number) {
    if (this.scroller) {
      this.scroller.scrollTop = this.props.itemHeight * index
    }
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

  private get scrollRatio(): number {
    return this.scrollTop / (this.scrollHeight - this.scrollerHeight)
  }

  private get visibleIndexTop(): number {
    return Math.max(0, Math.round(this.offsetTop / this.props.itemHeight))
  }

  private get visibleIndexBottom(): number {
    return Math.min(
      this.props.items.length,
      this.visibleIndexTop + Math.round(this.scrollerHeight / this.props.itemHeight) + 1
    )
  }

  constructor() {
    super()
    this.state = {
      visibleIndexTop: 0,
      visibleIndexBottom: 0
    }
  }

  componentDidMount() {
    this.updateView()
  }

  componentWillReceiveProps(next: ScrollLensProps) {
    if (
      next.items.length !== this.props.items.length ||
      next.itemHeight !== this.props.itemHeight
    ) {
      this.updateView()
    }
  }

  onScroll() {
    console.log(this.offsetTop, this.scrollRatio, this.offsetBottom)

    if (this.props.onRequestLoadingFromTop && this.offsetTop === 0) {
      this.props.onRequestLoadingFromTop()
    }
    if (this.props.onRequestLoadingFromBottom && this.offsetBottom === 0) {
      this.props.onRequestLoadingFromBottom()
    }

    this.updateVisible()
  }

  updateVisible() {
    if (
      this.visibleIndexTop !== this.state.visibleIndexTop ||
      this.visibleIndexBottom !== this.state.visibleIndexBottom
    ) {
      this.visibleTopOffset = this.offsetTop

      this.setState({
        visibleIndexTop: this.visibleIndexTop,
        visibleIndexBottom: this.visibleIndexBottom
      })
    }
  }

  updateView() {
    if (this.props.items) {
      this.container.style.height = this.height + 'px'
      this.updateVisible()
    }
  }

  renderItems(): JSX.Element[] {
    return this.props.items
      .slice(this.state.visibleIndexTop, this.state.visibleIndexBottom)
      .map((item: any, i: number) => {
        return <div key={i}>
          {this.props.renderItem(this.state.visibleIndexTop + i)}
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
      <div ref='container' style={containerStyle}>
        <div ref='visible'>
          {loadingTop && loader}
          {this.renderItems()}
          {loadingBottom && loader}
        </div>
      </div>
    </div>
  }
}