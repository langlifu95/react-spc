// @flow
import React, { Component } from 'react';
// $FlowFixMe
import PropTypes from 'prop-types';
import { FillSpaceError, LargeEmoji, Heading, Subheading } from './style';
import { Button } from '../buttons';
import { removeItemFromStorage } from '../../helpers/localStorage';

/*
  A generic error component which will fill the space of any container its placed in.
  It requires a heading and subheading to be used to inform the error about why this error is being shown.

  It receives optional props that can help fix a user's problem or nudge them towards resolution:
  - clearStorage: if this prop is present, we will clear the local storage on the client which will then prompt them to re-login on the next page load.
  - refresh: if this prop is present, we will show a button that the user can click to refresh the view. This will most often be used in conjunction with clearStorage
  - children: the error component can receive any other miscellaneous children in order to customize the error view based on the context it's in
*/

class ViewError extends Component {
  render() {
    const {
      clearStorage,
      heading,
      subheading,
      refresh,
      emoji,
      children,
    } = this.props;

    if (clearStorage) {
      removeItemFromStorage('spectrum');
    }

    const moji = emoji || '😌';
    const head = heading || 'We could all use a refresh.';
    const subhead = subheading || 'Refresh this page to try again';

    return (
      <FillSpaceError>
        <LargeEmoji role="img" aria-label="Emoji">
          {moji}
        </LargeEmoji>
        <Heading>{head}</Heading>
        <Subheading>{subhead}</Subheading>

        {refresh && (
          <Button
            large
            icon="view-reload"
            onClick={() => window.location.reload(true)}
          >
            Refresh the page
          </Button>
        )}

        {children}
      </FillSpaceError>
    );
  }
}

ViewError.propTypes = {
  emoji: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  clearStorage: PropTypes.bool,
  refresh: PropTypes.bool,
};

export default ViewError;
