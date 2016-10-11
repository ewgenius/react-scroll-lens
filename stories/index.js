import React from 'react';
import {
  storiesOf,
  action,
  linkTo
} from '@kadira/storybook';
import ScrollLens from '../dist';

storiesOf('ScrollLens', module)
  .add('simple', () => ( <
    ScrollLens > < /ScrollLens>
  ));