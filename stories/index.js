import React from 'react';
import {
  storiesOf,
  action,
  linkTo
} from '@kadira/storybook';
import ScrollLens from '../dist';

storiesOf('ScrollLens', module)
  .add('empty', () => (<ScrollLens />))
  .add('simple', () => (<ScrollLens items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />));