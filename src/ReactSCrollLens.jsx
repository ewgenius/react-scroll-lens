import React, {Component, PropTypes} from 'react';

const scrollerStyles = {
  overflowX: 'hidden',
  overflowY: 'auto'
};

class ReactScrollLens extends Component {
  static defaultProps = {
    itemHeight: 56
  }

  constructor() {
    super();
  }

  onScroll() {

  }

  render() {
    const {style, itemHeight} = this.props
    return <div
      ref='scroller'
      onScroll={() => this.onScroll() }
      style={{ ...scrollerStyles, ...style }}>
      <div ref='container'>
        <div ref='vissible'>
          k
        </div>
      </div>
    </div>
  }
}

ReactScrollLens.propTypes = {
  children: PropTypes.array.isRequired,
  itemHeight: PropTypes.number,
  style: PropTypes.object
};

export default ReactScrollLens;
