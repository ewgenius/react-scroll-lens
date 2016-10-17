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
  visibleIndexTop?: number
  visibleIndexBottom?: number
  visibleHeight?: number
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

  private get framesCount(): number {
    return Math.ceil(this.scrollHeight / this.scrollerHeight)
  }

  private get itemsPerFrame(): number {
    return this.scrollerHeight / this.props.itemHeight
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
      visibleIndexBottom: 10,
      visibleHeight: 0
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
    if (this.props.onRequestLoadingFromTop && this.offsetTop === 0) {
      this.props.onRequestLoadingFromTop()
    }
    if (this.props.onRequestLoadingFromBottom && this.offsetBottom === 0) {
      this.props.onRequestLoadingFromBottom()
    }
    //this.updateVisible()

    const bufferIndex = Math.round(this.scrollRatio * this.props.items.length / this.itemsPerFrame)
    const bufferY = bufferIndex * this.props.itemHeight * this.itemsPerFrame
    const currentBuffer = bufferIndex % 2 + 1

    if (currentBuffer !== this.currentBuffer) {
      console.log(currentBuffer, bufferY)
      if (currentBuffer === 1)
        this.buffer1.style.transform = `translate(0px, ${bufferY}px)`
      if (currentBuffer === 2)
        this.buffer2.style.transform = `translate(0px, ${bufferY}px)`
    }

    this.currentBuffer = currentBuffer === 1 ? 1 : 2
    //console.log(this.buffer2Y + this.buffer1Height)

    //this.buffer1.style.transform = `translate(0px, ${this.buffer1Y}px)`
    //this.buffer2.style.transform = `translate(0px, ${this.buffer2Y}px)`
  }

  updateVisible() {
    if (
      this.visibleIndexTop !== this.state.visibleIndexTop ||
      this.visibleIndexBottom !== this.state.visibleIndexBottom
    ) {
      this.setState({
        visibleIndexTop: this.visibleIndexTop,
        visibleIndexBottom: this.visibleIndexBottom,
      })
    }
  }

  updateView() {
    if (this.props.items) {
      this.container.style.height = this.height + 'px'
      this.buffer1.style.height = this.scrollerHeight + 'px'
      this.buffer2.style.height = this.scrollerHeight + 'px'
      this.buffer2.style.transform = `translate(0px, ${this.scrollerHeight}px)`
      this.updateVisible()
    }
  }

  renderItems(frame: 1 | 2 = 1): JSX.Element[] {
    const offset = (frame - 1) * this.itemsPerFrame
    return this.props.items
      .slice(offset, this.itemsPerFrame + offset)
      .map((item: any, i: number) => {
        return <div key={i}>
          {this.props.renderItem(this.state.visibleIndexTop + i)}
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
          {this.renderItems(1)}
        </div>
        <div ref='buffer2' style={{ position: 'absolute', width: '100%', backgroundColor: '#0f0' }}>
          {this.renderItems(2)}
        </div>
        {/*
        <div ref='visible' style={{ position: 'fixed' }}>
            <div ref='wrapper'>
            {loadingTop && loader}
            {this.renderItems()}
            {loadingBottom && loader}
          </div>
        </div>
        */}
      </div>
    </div>
  }
}