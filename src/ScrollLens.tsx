import * as React from 'react'
import { Component, Props, HTMLAttributes, CSSProperties } from 'react'

export interface ScrollLensProps extends HTMLAttributes<HTMLDivElement>, Props<ScrollLens> {
  itemHeight?: number
  items: any[]
  renderItem?: (i: number) => JSX.Element
}

export interface ScrollLensState {

}

export class ScrollLens extends Component<ScrollLensProps, ScrollLensState> {
  static defaultProps = {
    itemHeight: 10,
    renderItem: (i: number) => <div>{i}</div>
  }

  private get scroller(): HTMLDivElement {
    return this.refs['scroller'] as HTMLDivElement
  }

  private get container(): HTMLDivElement {
    return this.refs['container'] as HTMLDivElement
  }

  private get visible(): HTMLDivElement {
    return this.refs['visible'] as HTMLDivElement
  }

  private get size(): number {
    return this.props.items ? this.props.items.length : 0
  }

  private get height(): number {
    return this.size * this.props.itemHeight
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

    const scrollerStyle: CSSProperties = {
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'auto'
    }

    return <div
      id={id}
      className={className}
      style={scrollerStyle}
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