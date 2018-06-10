// @flow
import React, { Component } from 'react';
import Avatar from '../Avatar';
import { ListItem } from './ListItem';
import Icon from '../Icon';
import {
  TextColumnContainer,
  Title,
  Subtitle,
  AvatarWrapper,
  ViewForwardContainer,
} from './style';

type UserListItemType = {
  user: Object,
  onPressHandler: Function,
  noDivider?: boolean,
};

export class UserListItem extends Component<UserListItemType> {
  render() {
    const { user, onPressHandler, noDivider = false } = this.props;
    return (
      <ListItem onPressHandler={onPressHandler} noDivider={noDivider}>
        <AvatarWrapper>
          <Avatar src={user.profilePhoto} size={40} />
        </AvatarWrapper>

        <TextColumnContainer>
          <Title numberOfLines={1}>{user.name}</Title>
          <Subtitle numberOfLines={1}>@{user.username}</Subtitle>
        </TextColumnContainer>

        <ViewForwardContainer>
          <Icon
            glyph={'view-forward'}
            size={24}
            color={theme => theme.text.placeholder}
          />
        </ViewForwardContainer>
      </ListItem>
    );
  }
}
