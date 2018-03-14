// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Clipboard from 'react-clipboard.js';
import { addToastWithTimeout } from '../../../actions/toasts';
import { openModal } from '../../../actions/modals';
import Link from 'src/components/link';
import Icon from '../../../components/icons';
import compose from 'recompose/compose';
import { Button, TextButton, IconButton } from '../../../components/buttons';
import Flyout from '../../../components/flyout';
import { track } from '../../../helpers/events';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import toggleThreadNotificationsMutation from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import {
  FollowButton,
  ShareButtons,
  ShareButton,
  ActionBarContainer,
  FlyoutRow,
  DropWrap,
  EditDone,
  Label,
} from '../style';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  isEditing: boolean,
  dispatch: Function,
  toggleThreadNotifications: Function,
  toggleEdit: Function,
  saveEdit: Function,
  togglePinThread: Function,
  pinThread: Function,
  triggerDelete: Function,
  threadLock: Function,
  isSavingEdit: boolean,
  title: string,
};
type State = {
  notificationStateLoading: boolean,
  flyoutOpen: boolean,
};
class ActionBar extends React.Component<Props, State> {
  state = {
    notificationStateLoading: false,
    flyoutOpen: false,
  };

  toggleFlyout = val => {
    if (val) {
      return this.setState({ flyoutOpen: val });
    }

    if (this.state.flyoutOpen === false) {
      return this.setState({ flyoutOpen: true });
    } else {
      return this.setState({ flyoutOpen: false });
    }
  };

  triggerChangeChannel = () => {
    const { thread, dispatch } = this.props;
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
          track('thread', 'notifications turned on', null);
          return dispatch(
            addToastWithTimeout('success', 'Notifications activated!')
          );
        } else {
          track('thread', 'notifications turned off', null);
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

  render() {
    const { thread, currentUser, isEditing, isSavingEdit, title } = this.props;
    const { notificationStateLoading, flyoutOpen } = this.state;
    const isChannelMember = thread.channel.channelPermissions.isMember;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    console.log('thread', thread);
    console.log('isChannelOwner', isChannelOwner);
    const isCommunityOwner = thread.community.communityPermissions.isOwner;
    console.log('isCommunityOwner', isCommunityOwner);
    const isCommunityModerator =
      thread.community.communityPermissions.isModerator;
    console.log('isCommunityModerator', isCommunityModerator);
    const isChannelModerator = thread.channel.channelPermissions.isModerator;
    console.log('isChannelModerator', isChannelModerator);
    const isPinned = thread.community.pinnedThreadId === thread.id;

    if (isEditing) {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex' }} />
          <div style={{ display: 'flex' }}>
            <EditDone>
              <TextButton onClick={this.props.toggleEdit}>Cancel</TextButton>
            </EditDone>
            <EditDone>
              <Button
                loading={isSavingEdit}
                disabled={title.trim().length === 0}
                onClick={this.props.saveEdit}
              >
                Save
              </Button>
            </EditDone>
          </div>
        </ActionBarContainer>
      );
    } else {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex' }}>
            {currentUser ? (
              <FollowButton
                currentUser={currentUser}
                icon={
                  thread.receiveNotifications
                    ? 'notification-fill'
                    : 'notification'
                }
                tipText={
                  thread.receiveNotifications
                    ? 'Turn off notifications'
                    : 'Get notified about replies'
                }
                tipLocation={'top-right'}
                loading={notificationStateLoading}
                onClick={this.toggleNotification}
              >
                {thread.receiveNotifications ? 'Subscribed' : 'Notify me'}
              </FollowButton>
            ) : (
              <Link to={`/login?r=${window.location}`}>
                <FollowButton
                  currentUser={currentUser}
                  icon={'notification'}
                  tipText={'Get notified about replies'}
                  tipLocation={'top-right'}
                >
                  Notify me
                </FollowButton>
              </Link>
            )}

            <ShareButtons>
              <ShareButton facebook tipText={'Share'} tipLocation={'top-left'}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat/thread/${
                    thread.id
                  }&t=${thread.content.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'facebook'} size={24} />
                </a>
              </ShareButton>

              <ShareButton twitter tipText={'Tweet'} tipLocation={'top-left'}>
                <a
                  href={`https://twitter.com/share?text=${
                    thread.content.title
                  } on @withspectrum&url=https://spectrum.chat/thread/${
                    thread.id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon glyph={'twitter'} size={24} />
                </a>
              </ShareButton>

              <Clipboard
                style={{ background: 'none' }}
                data-clipboard-text={`https://spectrum.chat/thread/${
                  thread.id
                }`}
                onSuccess={() =>
                  this.props.dispatch(
                    addToastWithTimeout('success', 'Copied to clipboard')
                  )
                }
              >
                <ShareButton tipText={'Copy link'} tipLocation={'top-left'}>
                  <a>
                    <Icon glyph={'link'} size={24} />
                  </a>
                </ShareButton>
              </Clipboard>
            </ShareButtons>
          </div>

          <div style={{ display: 'flex' }}>
            {currentUser &&
              isChannelMember &&
              (isChannelOwner ||
                isChannelModerator ||
                isCommunityOwner ||
                isCommunityModerator ||
                thread.isAuthor) && (
                <DropWrap className={flyoutOpen ? 'open' : ''}>
                  <IconButton
                    glyph="settings"
                    tipText={'Thread settings'}
                    tipLocation={'top-left'}
                    onClick={this.toggleFlyout}
                  />
                  <Flyout>
                    <FlyoutRow hideAbove={768}>
                      <TextButton
                        icon={
                          thread.receiveNotifications
                            ? 'notification-fill'
                            : 'notification'
                        }
                        hoverColor={'brand.alt'}
                        onClick={this.toggleNotification}
                      >
                        {thread.receiveNotifications
                          ? 'Subscribed'
                          : 'Notify me'}
                      </TextButton>
                    </FlyoutRow>

                    {thread.isAuthor && (
                      <FlyoutRow>
                        <TextButton
                          icon="edit"
                          onClick={this.props.toggleEdit}
                          hoverColor={'space.default'}
                        >
                          <Label>Edit post</Label>
                        </TextButton>
                      </FlyoutRow>
                    )}

                    {(isCommunityOwner ||
                      isCommunityModerator ||
                      isChannelModerator) &&
                      !thread.channel.isPrivate && (
                        <FlyoutRow>
                          <TextButton
                            icon={isPinned ? 'pin-fill' : 'pin'}
                            hoverColor={
                              isPinned ? 'warn.default' : 'special.default'
                            }
                            onClick={this.props.togglePinThread}
                          >
                            <Label>
                              {isPinned ? 'Unpin thread' : 'Pin thread'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                    <FlyoutRow hideBelow={1024}>
                      <TextButton
                        icon={'channel'}
                        hoverColor={'special.default'}
                        onClick={this.triggerChangeChannel}
                      >
                        Move thread
                      </TextButton>
                    </FlyoutRow>

                    {isChannelOwner ||
                      isCommunityOwner ||
                      isChannelModerator ||
                      isCommunityModerator ||
                      (thread.isAuthor && (
                        <FlyoutRow>
                          <TextButton
                            icon={
                              thread.isLocked ? 'private' : 'private-unlocked'
                            }
                            hoverColor={
                              thread.isLocked ? 'success.default' : 'warn.alt'
                            }
                            onClick={this.props.threadLock}
                          >
                            <Label>
                              {thread.isLocked ? 'Unlock chat' : 'Lock chat'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      ))}

                    {(thread.isAuthor ||
                      isChannelOwner ||
                      isCommunityOwner ||
                      isChannelModerator ||
                      isCommunityModerator) && (
                      <FlyoutRow>
                        <TextButton
                          icon="delete"
                          hoverColor="warn.default"
                          onClick={this.props.triggerDelete}
                        >
                          <Label>Delete</Label>
                        </TextButton>
                      </FlyoutRow>
                    )}
                  </Flyout>
                </DropWrap>
              )}
          </div>
          {flyoutOpen && (
            <div
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: 'transparent',
                zIndex: 3002,
              }}
              onClick={() =>
                setTimeout(() => {
                  this.toggleFlyout(false);
                })
              }
            />
          )}
        </ActionBarContainer>
      );
    }
  }
}

export default compose(connect(), toggleThreadNotificationsMutation)(ActionBar);
