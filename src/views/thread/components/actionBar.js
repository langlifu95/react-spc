// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import { CLIENT_URL } from 'src/api/constants';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import Tooltip from 'src/components/tooltip';
import Icon from 'src/components/icon';
import compose from 'recompose/compose';
import { PrimaryOutlineButton, TextButton } from 'src/components/button';
import { LikeButton } from 'src/components/threadLikes';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import toggleThreadNotificationsMutation from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import { track, events, transformations } from 'src/helpers/analytics';
import getThreadLink from 'src/helpers/get-thread-link';
import type { Dispatch } from 'redux';
import { InputHints, DesktopLink } from 'src/components/composer/style';
import {
  MediaLabel,
  MediaInput,
} from 'src/components/chatInput/components/style';
import {
  ShareButtons,
  ShareButton,
  ActionBarContainer,
  FixedBottomActionBarContainer,
  EditDone,
} from '../style';
import ActionsDropdown from './actionsDropdown';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  isEditing: boolean,
  dispatch: Dispatch<Object>,
  toggleThreadNotifications: Function,
  toggleEdit: Function,
  saveEdit: Function,
  togglePinThread: Function,
  pinThread: Function,
  triggerDelete: Function,
  threadLock: Function,
  isSavingEdit: boolean,
  title: string,
  isLockingThread: boolean,
  isPinningThread: boolean,
  uploadFiles: Function,
};
type State = {
  notificationStateLoading: boolean,
};
class ActionBar extends React.Component<Props, State> {
  state = {
    notificationStateLoading: false,
  };

  triggerChangeChannel = () => {
    const { thread, dispatch } = this.props;

    track(events.THREAD_MOVED_INITED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });

    dispatch(openModal('CHANGE_CHANNEL', { thread }));
  };

  toggleNotification = () => {
    const { thread, dispatch, toggleThreadNotifications } = this.props;
    const threadId = thread.id;

    this.setState({
      notificationStateLoading: true,
    });

    toggleThreadNotifications({
      threadId,
    })
      .then(({ data: { toggleThreadNotifications } }) => {
        this.setState({
          notificationStateLoading: false,
        });

        if (toggleThreadNotifications.receiveNotifications) {
          return dispatch(
            addToastWithTimeout('success', 'Notifications activated!')
          );
        } else {
          return dispatch(
            addToastWithTimeout('neutral', 'Notifications turned off')
          );
        }
      })
      .catch(err => {
        this.setState({
          notificationStateLoading: true,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  uploadFiles = evt => {
    this.props.uploadFiles(evt.target.files);
  };

  render() {
    const { thread, isEditing, isSavingEdit, title, currentUser } = this.props;

    if (isEditing) {
      return (
        <FixedBottomActionBarContainer>
          <div style={{ display: 'flex' }}>
            <InputHints>
              <MediaLabel>
                <MediaInput
                  type="file"
                  accept={'.png, .jpg, .jpeg, .gif, .mp4'}
                  multiple={false}
                  onChange={this.uploadFiles}
                />
                <Icon glyph="photo" />
              </MediaLabel>
              <DesktopLink
                target="_blank"
                href="https://guides.github.com/features/mastering-markdown/"
              >
                <Icon glyph="markdown" />
              </DesktopLink>
            </InputHints>
          </div>
          <div style={{ display: 'flex' }}>
            <EditDone data-cy="cancel-thread-edit-button">
              <TextButton onClick={this.props.toggleEdit}>Cancel</TextButton>
            </EditDone>
            <EditDone>
              <PrimaryOutlineButton
                loading={isSavingEdit}
                disabled={title.trim().length === 0 || isSavingEdit}
                onClick={this.props.saveEdit}
                data-cy="save-thread-edit-button"
              >
                Save
              </PrimaryOutlineButton>
            </EditDone>
          </div>
        </FixedBottomActionBarContainer>
      );
    } else {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex' }}>
            <LikeButton thread={thread} />

            <ShareButtons>
              {!thread.channel.isPrivate && (
                <React.Fragment>
                  <Tooltip content={'Share on Facebook'}>
                    <ShareButton facebook data-cy="thread-facebook-button">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?t=${encodeURIComponent(
                          thread.content.title
                        )}&u=https://spectrum.chat${getThreadLink(thread)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon
                          glyph={'facebook'}
                          size={24}
                          onClick={() =>
                            track(events.THREAD_SHARED, { method: 'facebook' })
                          }
                        />
                      </a>
                    </ShareButton>
                  </Tooltip>

                  <Tooltip content={'Tweet'}>
                    <ShareButton twitter data-cy="thread-tweet-button">
                      <a
                        href={`https://twitter.com/share?url=https://spectrum.chat${getThreadLink(
                          thread
                        )}&text=${encodeURIComponent(
                          thread.content.title
                        )} on @withspectrum`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon
                          glyph={'twitter'}
                          size={24}
                          onClick={() =>
                            track(events.THREAD_SHARED, { method: 'twitter' })
                          }
                        />
                      </a>
                    </ShareButton>
                  </Tooltip>
                </React.Fragment>
              )}

              <Clipboard
                style={{ background: 'none' }}
                data-clipboard-text={`${CLIENT_URL}${getThreadLink(thread)}`}
                onSuccess={() =>
                  this.props.dispatch(
                    addToastWithTimeout('success', 'Copied to clipboard')
                  )
                }
              >
                <Tooltip content={'Copy link'}>
                  <ShareButton data-cy="thread-copy-link-button">
                    <a>
                      <Icon
                        glyph={'link'}
                        size={24}
                        onClick={() =>
                          track(events.THREAD_SHARED, { method: 'link' })
                        }
                      />
                    </a>
                  </ShareButton>
                </Tooltip>
              </Clipboard>
            </ShareButtons>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ActionsDropdown
              thread={thread}
              toggleNotification={this.toggleNotification}
              toggleEdit={this.props.toggleEdit}
              triggerChangeChannel={this.triggerChangeChannel}
              lockThread={this.props.threadLock}
              isLockingThread={this.props.isLockingThread}
              isPinningThread={this.props.isPinningThread}
              togglePinThread={this.props.togglePinThread}
              triggerDelete={this.props.triggerDelete}
            />
          </div>
        </ActionBarContainer>
      );
    }
  }
}

export default compose(
  connect(),
  toggleThreadNotificationsMutation
)(ActionBar);
