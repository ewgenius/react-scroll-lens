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

  componentDidMount() {
    this.refs['scroller'].scrollToBottom()
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
    return <div style={{ height: 500 }}>
      <ScrollLens
        ref='scroller'
        itemHeight={100}
        loader={<div style={{ padding: 16, textAlign: 'center' }}>loading process</div>}
        style={{ height: '100%' }}
        loadingTop={loadingTop}
        loadingBottom={loadingBottom}
        onRequestLoadingFromTop={() => this.addTop()}
        //onRequestLoadingFromBottom={() => this.addBottom()}
        renderItem={(i) => <div style={{ borderBottom: '1px solid #000', height: 200 }}>item: #{items[i]}</div>}
        items={items} />
      <button onClick={() => this.refs['scroller'].scrollToBottom()}>scroll bottom</button>
      <button onClick={() => this.refs['scroller'].scrollToTop()}>scroll top</button>
      <button onClick={() => this.refs['scroller'].scrollTo(321)}>scroll to 321</button>
    </div>
  }
}

storiesOf('ScrollLens', module)
  .add('simple', () => (<div style={{ height: 500 }}>
    <ScrollLens
      itemHeight={100}
      style={{ height: '100%' }}
      renderItem={(i) => <div style={{ borderBottom: '1px solid #000', height: 200 }}>item: #{baseItems[i]}</div>}
      items={baseItems} />
  </div>))
  .add('uploading from top and bottom', () => {
    return <TestLoading />
  })
  .add('vertical centering', () => {
    return <div style={{
      height: 500,
      border: '1px solid #000'
    }}>
      <div style={{
        border: '1px solid #f00',
        padding: 16,
        height: 100
      }}>
        <div style={{
          marginTop: -40,
          border: '1px solid #0f0',
          padding: 16
        }}>
          <div style={{ border: '1px solid #e0e0e0', height: 20 }}>0</div>
          <div style={{ border: '1px solid #e0e0e0', height: 35 }}>1</div>
          <div style={{ border: '1px solid #e0e0e0', height: 40 }}>2</div>
          <div style={{ border: '1px solid #e0e0e0', height: 10 }}>3</div>
          <div style={{ border: '1px solid #e0e0e0', height: 15 }}>4</div>
          <div style={{ border: '1px solid #e0e0e0', height: 20 }}>5</div>
          <div style={{ border: '1px solid #e0e0e0', height: 25 }}>6</div>
          <div style={{ border: '1px solid #e0e0e0', height: 28 }}>7</div>
          <div style={{ border: '1px solid #e0e0e0', height: 13 }}>8</div>
          <div style={{ border: '1px solid #e0e0e0', height: 18 }}>9</div>
        </div>
      </div>
    </div>
  });