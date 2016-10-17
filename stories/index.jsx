import React from 'react';
import {
  storiesOf,
  action,
  linkTo
} from '@kadira/storybook';
import ScrollLens from '../dist';
import { range } from 'ramda'

const baseItems = range(1, 500)

class TestLoading extends React.Component {
  constructor() {
    super()
    this.state = {
      items: baseItems,
      loadingTop: false,
      loadingBottom: false
    }
  }

  addTop() {
    const item = this.state.items[0]
    const arr = range(item - 20, item - 1)
    this.setState({ loadingTop: true })
    setTimeout(() => {
      this.setState({
        items: Array.prototype.concat(arr, this.state.items),
        loadingTop: false
      })
    }, 1000)
  }

  addBottom() {
    const item = this.state.items[this.state.items.length - 1]
    const arr = range(item + 1, item + 20)
    this.setState({ loadingBottom: true })
    setTimeout(() => {
      this.setState({
        items: Array.prototype.concat(this.state.items, arr),
        loadingBottom: false
      })
    }, 1000)
  }

  render() {
    const {items, loadingTop, loadingBottom} = this.state
    return <div style={{ height: 300, border: '1px solid #000' }}>
      <ScrollLens
        ref='scroller'
        loader={<div style={{ padding: 16, textAlign: 'center' }}>loading process</div>}
        style={{ height: '100%' }}
        loadingTop={loadingTop}
        loadingBottom={loadingBottom}
        onRequestLoadingFromTop={() => this.addTop()}
        onRequestLoadingFromBottom={() => this.addBottom()}
        renderItem={(i) => <div>item: #{items[i]}</div>}
        items={items} />
      <button onClick={() => this.refs['scroller'].scrollToBottom()}>scroll bottom</button>
      <button onClick={() => this.refs['scroller'].scrollToTop()}>scroll top</button>
      <button onClick={() => this.refs['scroller'].scrollTo(321)}>scroll to 321</button>
    </div>
  }
}

storiesOf('ScrollLens', module)
  .add('simple', () => (<div style={{ height: 300, border: '1px solid #000' }}>
    <ScrollLens
      style={{ height: '100%' }}
      renderItem={(i) => <div>item: #{baseItems[i]}</div>}
      items={baseItems} />
  </div>))
  .add('uploading from top and bottom', () => {
    return <TestLoading />
  })
  .add('updating elements', () => {
    return <TestLoading />
  });