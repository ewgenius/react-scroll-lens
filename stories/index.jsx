import React from 'react';
import {
  storiesOf,
  action,
  linkTo
} from '@kadira/storybook';
import ScrollLens from '../dist';

storiesOf('ScrollLens', module)
  .add('simple', () => (<div style={{ height: 300, border: '1px solid #000' }}>
    <ScrollLens
      style={{ height: '100%' }}
      items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
  </div>))
  .add('loading', () => (<div style={{ height: 300, border: '1px solid #000' }}>
    <ScrollLens
      style={{ height: '100%' }}
      onRequestLoadingFromTop={() => console.log('from top')}
      onRequestLoadingFromBottom={() => console.log('from bottom')}
      items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />
  </div>));