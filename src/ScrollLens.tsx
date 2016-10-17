import * as React from 'react'
import { Component, Props, HTMLAttributes, CSSProperties } from 'react'

const scrollerStyle: CSSProperties = {
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}

const containerStyle: CSSProperties = {
  overflow: 'hidden',
  position: 'relative'
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
  bufferIndex1?: number
  bufferIndex2?: number
}

export class ScrollLens extends Component<ScrollLensProps, ScrollLensState> {
  static defaultProps = {
    itemHeight: 10,
    renderItem: (i: number) => <div>{i}</div>,
    loader: <div>loading</div>
  }

  private buffer1Y: number = 0
  private buffer2Y: number = 0
  private currentBuffer: 1 | 2 = 1
  private prevScrollRatio: number = 0

  // elements

  private get scroller(): HTMLDivElement {
    return this.refs['scroller'] as HTMLDivElement
  }

  private get container(): HTMLDivElement {
    return this.refs['container'] as HTMLDivElement
  }

  private get buffer1(): HTMLDivElement {
    return this.refs['buffer1'] as HTMLDivElement
  }

  private get buffer2(): HTMLDivElement {
    return this.refs['buffer2'] as HTMLDivElement
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

  private get frameHeight(): number {
    return this.scrollerHeight * 2
  }

  private get framesCount(): number {
    return Math.ceil(this.scrollHeight / this.frameHeight)
  }

  private get itemsPerFrame(): number {
    return Math.ceil(this.frameHeight / this.props.itemHeight)
  }

  private get buffer1Height(): number {
    if (!this.buffer1)
      return 0
    else return this.buffer1.offsetHeight
  }

  private get buffer2Height(): number {
    if (!this.buffer2)
      return 0
    else return this.buffer2.offsetHeight
  }

  private get buffer1K(): number {
    return this.buffer1Height / this.frameHeight
  }

  private get buffer2K(): number {
    return this.buffer2Height / this.frameHeight
  }

  // jump to

  public scrollToTop() {
    if (this.scroller) {
      this.onScroll()
      this.scroller.scrollTop = 0
      this.onScroll()
    }
  }

  public scrollToBottom() {
    if (this.scroller) {
      this.onScroll()
      this.scroller.scrollTop += this.scrollHeight
      this.onScroll()
    }
  }

  public scrollTo(index: number) {
    if (this.scroller) {
      this.onScroll()
      this.scroller.scrollTop = this.props.itemHeight * index
      this.onScroll()
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

  private get scrollCenter(): number {
    return this.offsetTop + this.scrollerHeight / 2
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
      bufferIndex1: 0,
      bufferIndex2: 2
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
    const direction = this.prevScrollRatio < this.scrollRatio ? 1 : -1
    this.prevScrollRatio = this.scrollRatio

    // calculate frame centers
    const frameCenter = this.frameHeight / 2 - this.scrollCenter - this.scrollerHeight / 2
    const center1Offset = (this.buffer1Y + frameCenter) * (this.buffer1K - 1)
    const center2Offset = (this.buffer2Y + frameCenter) * (this.buffer2K - 1)

    const bufferIndex = Math.min(
      Math.max(
        Math.round((this.scrollTop + (direction === 1 ? 0.5 : -1.5) * this.scrollerHeight) / this.frameHeight),
        0), this.framesCount)

    const bufferY = bufferIndex * this.frameHeight
    const currentBuffer = bufferIndex % 2 + 1

    if (currentBuffer === 1) {
      this.buffer1Y = bufferY
      this.setState({
        bufferIndex1: bufferIndex
      })
    }
    if (currentBuffer === 2) {
      this.buffer2Y = bufferY
      this.setState({
        bufferIndex2: bufferIndex
      })
    }
    this.buffer1.style.transform = `translate(0px, ${this.buffer1Y + center1Offset}px)`
    this.buffer2.style.transform = `translate(0px, ${this.buffer2Y + center2Offset}px)`
    this.currentBuffer = currentBuffer === 1 ? 1 : 2

    if (this.props.onRequestLoadingFromTop && this.offsetTop === 0) {
      //this.props.onRequestLoadingFromTop()
    }
    if (this.props.onRequestLoadingFromBottom && this.offsetBottom === 0) {
      //this.props.onRequestLoadingFromBottom()
    }
  }

  updateView() {
    if (this.props.items) {
      this.container.style.height = this.height + 'px'
      this.buffer1.style.minHeight = this.frameHeight + 'px'
      this.buffer2.style.minHeight = this.frameHeight + 'px'
      this.buffer1Y = 0
      this.buffer2Y = this.frameHeight
      this.buffer2.style.transform = `translate(0px, ${this.frameHeight}px)`
    }
  }

  renderItems(bufferIndex: number = 0): JSX.Element[] {
    const offset = bufferIndex * this.itemsPerFrame
    return this.props.items
      .slice(offset, this.itemsPerFrame + offset)
      .map((item: any, i: number) => {
        return <div key={i}>
          {this.props.renderItem(offset + i)}
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
      <div ref='container' style={containerStyle}>
        <div ref='buffer1' style={{ position: 'absolute', width: '100%', backgroundColor: '#f00' }}>
          {
            this.renderItems(this.state.bufferIndex1)
          }
        </div>
        <div ref='buffer2' style={{ position: 'absolute', width: '100%', backgroundColor: '#0f0' }}>
          {
            this.renderItems(this.state.bufferIndex2)
          }
        </div>
      </div>
    </div>
  }
}