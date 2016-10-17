import React from 'react';
import {
  storiesOf,
  action,
  linkTo
} from '@kadira/storybook';
import ScrollLens from '../dist';
import { range } from 'ramda'

class TestLoading extends React.Component {
  constructor() {
    super()
    this.state = {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
        loader={<div style={{ padding: 16, textAlign: 'center' }}>loading process</div>}
        style={{ height: '100%' }}
        loadingTop={loadingTop}
        loadingBottom={loadingBottom}
        onRequestLoadingFromTop={() => this.addTop()}
        onRequestLoadingFromBottom={() => this.addBottom()}
        renderItem={(i) => <div>item: #{items[i]}</div>}
        items={items} />
    </div>
  }
}

storiesOf('ScrollLens', module)
  .add('simple', () => (<div style={{ height: 300, border: '1px solid #000' }}>
    <ScrollLens
      style={{ height: '100%' }}
      items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
  </div>))
  .add('loading', () => {
    return <TestLoading />
  });