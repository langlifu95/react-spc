// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import {
  getThreadByMatch,
  getThreadByMatchQuery,
} from 'shared/graphql/queries/thread/getThread';
import { markSingleNotificationSeenMutation } from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { withCurrentUser } from 'src/components/withCurrentUser';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';
import JoinCommunity from 'src/components/joinCommunityWrapper';
import Icon from 'src/components/icons';
import { PrimaryButton } from 'src/views/community/components/button';
import ConditionalWrap from 'src/components/conditionalWrap';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import {
  CommunityProfileCard,
  ChannelProfileCard,
} from 'src/components/entities';
import { SidebarSection } from 'src/views/community/style';
import ChatInput from 'src/components/chatInput';
import { MobileTitlebar } from 'src/components/titlebar';
import { RouteModalContext } from 'src/routes';
import MessagesSubscriber from '../components/messagesSubscriber';
import StickyHeader from '../components/stickyHeader';
import ThreadDetail from '../components/threadDetail';
import ThreadHead from '../components/threadHead';
import LockedMessages from '../components/lockedMessages';
import DesktopAppUpsell from '../components/desktopAppUpsell';
import { Stretch, ChatInputWrapper, LockedText } from '../style';

const ThreadContainer = (props: Props) => {
  const { data, isLoading, client, currentUser } = props;

  if (isLoading) return <LoadingView />;

  const { thread } = data;
  if (!thread) return <ErrorView titlebarTitle={'Conversation'} />;

  const { id } = thread;

  /*
    update the last seen timestamp of the current thread whenever it first
    loads, as well as when it unmounts as the user closes the thread. This
    should provide the effect of locally marking the thread as "seen" while
    athena handles storing the actual lastSeen timestamp update in the background
    asynchronously.
  */
  const updateThreadLastSeen = () => {
    if (!currentUser || !thread) return;
    try {
      const threadData = client.readQuery({
        query: getThreadByMatchQuery,
        variables: {
          id,
        },
      });

      client.writeQuery({
        query: getThreadByMatchQuery,
        variables: {
          id,
        },
        data: {
          ...threadData,
          thread: {
            ...threadData.thread,
            currentUserLastSeen: new Date(),
            __typename: 'Thread',
          },
        },
      });
    } catch (err) {
      // Errors that happen with this shouldn't crash the app
      console.error(err);
    }
  };

  const markCurrentThreadNotificationsAsSeen = () => {
    if (!currentUser || !thread) return;
    try {
      props.notifications.forEach(notification => {
        if (notification.isSeen) return;

        const notificationContextIds =
          notification.type === 'THREAD_CREATED'
            ? notification.entities.map(entity => entity.id)
            : [notification.context.id];

        if (notificationContextIds.indexOf(id) === -1) return;

        props.client.mutate({
          mutation: markSingleNotificationSeenMutation,
          variables: {
            id: notification.id,
          },
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    markCurrentThreadNotificationsAsSeen();
  }, [id, props.notifications.length]);

  useEffect(() => {
    updateThreadLastSeen();
    return () => updateThreadLastSeen();
  }, [id]);

  const { community, channel, isLocked } = thread;
  const { communityPermissions } = community;
  const { isMember } = communityPermissions;
  const canChat = !isLocked && isMember;

  return (
    <React.Fragment>
      <ThreadHead thread={thread} />
      <MobileTitlebar title={'Conversation'} menuAction={'view-back'} />

      <RouteModalContext.Consumer>
        {({ hasModal }) => (
          <ConditionalWrap
            condition={!hasModal}
            wrap={children => <ViewGrid>{children}</ViewGrid>}
          >
            <SecondaryPrimaryColumnGrid>
              <SecondaryColumn>
                <DesktopAppUpsell />

                <SidebarSection>
                  <CommunityProfileCard community={community} />
                </SidebarSection>

                <SidebarSection>
                  <ChannelProfileCard hideCommunityMeta channel={channel} />
                </SidebarSection>
              </SecondaryColumn>

              <PrimaryColumn>
                {/*
                  This <Stretch> container makes sure that the thread detail and messages
                  component are always at least the height of the screen, minus the
                  height of the chat input. This is necessary because we always want
                  the chat input at the bottom of the view, so it must always be tricked
                  into thinking that its preceeding sibling is full-height.
                */}
                <Stretch>
                  <StickyHeader thread={thread} />
                  <ThreadDetail thread={thread} />

                  <MessagesSubscriber
                    id={thread.id}
                    thread={thread}
                    isWatercooler={thread.watercooler} // used in the graphql query to always fetch the latest messages
                  />
                </Stretch>

                {canChat && (
                  <ChatInputWrapper>
                    <ChatInput threadType="story" threadId={thread.id} />
                  </ChatInputWrapper>
                )}

                {!canChat && !isLocked && (
                  <ChatInputWrapper>
                    <JoinCommunity
                      communityId={community.id}
                      render={({ isLoading }) => (
                        <LockedMessages>
                          <PrimaryButton
                            isLoading={isLoading}
                            icon={'door-enter'}
                          >
                            {isLoading
                              ? 'Joining...'
                              : 'Join community to chat'}
                          </PrimaryButton>
                        </LockedMessages>
                      )}
                    />
                  </ChatInputWrapper>
                )}

                {isLocked && (
                  <ChatInputWrapper>
                    <LockedMessages>
                      <Icon glyph={'private'} size={24} />
                      <LockedText>This conversation has been locked</LockedText>
                    </LockedMessages>
                  </ChatInputWrapper>
                )}
              </PrimaryColumn>
            </SecondaryPrimaryColumnGrid>
          </ConditionalWrap>
        )}
      </RouteModalContext.Consumer>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications.notificationsData,
});

export default compose(
  getThreadByMatch,
  viewNetworkHandler,
  withRouter,
  withApollo,
  withCurrentUser,
  connect(mapStateToProps)
)(ThreadContainer);
