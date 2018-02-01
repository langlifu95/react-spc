// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import {
  EditDropdownContainer,
  Dropdown,
  DropdownSectionDivider,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from '../style';
import Icon from '../../../components/icons';
import { Spinner } from '../../../components/globals';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import OutsideClickHandler from './outsideClickHandler';
import addCommunityModerator from 'shared/graphql/mutations/community/addCommunityModerator';
import removeCommunityModerator from 'shared/graphql/mutations/community/removeCommunityModerator';
import blockCommunityMember from 'shared/graphql/mutations/community/blockCommunityMember';
import unblockCommunityMember from 'shared/graphql/mutations/community/unblockCommunityMember';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import MutationWrapper from './mutationWrapper';

type Props = {
  blockCommunityMember: Function,
  unblockCommunityMember: Function,
  addCommunityModerator: Function,
  removeCommunityModerator: Function,
  dispatch: Function,
  community: GetCommunityType,
  history: Object,
  user: {
    ...$Exact<GetUserType>,
    contextPermissions: {
      isMember: boolean,
      isOwner: boolean,
      isModerator: boolean,
      isBlocked: boolean,
    },
  },
};

type State = { isOpen: boolean };

class EditDropdown extends React.Component<Props, State> {
  initialState = { isOpen: false };

  state = this.initialState;

  input = {
    communityId: this.props.community.id,
    userId: this.props.user.id,
  };

  permissionConfigurations = {
    owner: {
      title: 'Owner',
      subtitle: 'Can manage all members, moderators, channels, and content',
      selected: false,
    },
    moderator: {
      title: 'Moderator',
      subtitle:
        "Can edit and delete conversations and messages. They will not see private channels where they aren't approved",
      selected: false,
    },
    blocked: {
      title: 'Blocked',
      subtitle:
        'Can not be see any content, and will not receive any notifications about activity',
      selected: false,
    },
    member: {
      title: 'Member',
      subtitle:
        "Can start new conversations and reply to anyone else's conversations",
      selected: false,
    },
  };

  initMessage = () => {
    this.props.dispatch(initNewThreadWithUser(this.props.user));
    return this.props.history.push('/messages/new');
  };

  getRolesConfiguration = () => {
    const { user: { contextPermissions } } = this.props;

    if (contextPermissions.isOwner) {
      return [this.permissionConfigurations.owner];
    }

    if (contextPermissions.isModerator) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.removeCommunityModerator,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (contextPermissions.isMember) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: this.props.addCommunityModerator,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: null,
          selected: true,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: this.props.blockCommunityMember,
        },
      ];
    }

    if (contextPermissions.isBlocked) {
      return [
        {
          ...this.permissionConfigurations.moderator,
          mutation: this.props.addCommunityModerator,
        },
        {
          ...this.permissionConfigurations.member,
          mutation: this.props.unblockCommunityMember,
        },
        {
          ...this.permissionConfigurations.blocked,
          mutation: null,
          selected: true,
        },
      ];
    }
  };

  toggleOpen = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;
    const configuration = this.getRolesConfiguration();

    return (
      <EditDropdownContainer>
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            <Dropdown>
              <DropdownSection onClick={this.initMessage}>
                <DropdownAction>
                  <Icon glyph={'message'} size={'32'} />
                </DropdownAction>
                <DropdownSectionText>
                  <DropdownSectionTitle>
                    Send Direct Message
                  </DropdownSectionTitle>
                </DropdownSectionText>
              </DropdownSection>

              <DropdownSectionDivider />

              {configuration &&
                configuration.map((role, i) => {
                  return (
                    <MutationWrapper
                      key={i}
                      mutation={role.mutation && role.mutation}
                      variables={{ input: this.input }}
                      render={({ isLoading }) => (
                        <DropdownSection>
                          <DropdownAction>
                            {isLoading ? (
                              <Spinner size={20} />
                            ) : (
                              <Icon
                                glyph={role.selected ? 'checkmark' : 'checkbox'}
                                size={'32'}
                              />
                            )}
                          </DropdownAction>

                          <DropdownSectionText>
                            <DropdownSectionTitle>
                              {role.title}
                            </DropdownSectionTitle>
                            <DropdownSectionSubtitle>
                              {role.subtitle}
                            </DropdownSectionSubtitle>
                          </DropdownSectionText>
                        </DropdownSection>
                      )}
                    />
                  );
                })}
            </Dropdown>
          </OutsideClickHandler>
        )}
      </EditDropdownContainer>
    );
  }
}

export default compose(
  connect(),
  withRouter,
  addCommunityModerator,
  removeCommunityModerator,
  blockCommunityMember,
  unblockCommunityMember
)(EditDropdown);
