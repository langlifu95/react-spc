// @flow
import React from 'react';
import { logout } from '../../../actions/authentication';
import Dropdown from '../../../components/dropdown';
import { TextButton } from '../../../components/buttons';
import ProfileMenu from '../../user/components/profileMenu';
import {
  DropdownFooter,
  UserProfileDropdownList,
  UserProfileDropdownListItem,
} from '../style';

export const ProfileDropdown = props => {
  return (
    <Dropdown width={'160px'}>
      <UserProfileDropdownList>
        <ProfileMenu {...props} />
        {/* <UserProfileDropdownListItem
          onClick={() => props.history.push(`/users/${props.user.username}`)}
        >
          Settings
        </UserProfileDropdownListItem>
        <UserProfileDropdownListItem onClick={() => logout()}>
          Log Out
        </UserProfileDropdownListItem> */}
      </UserProfileDropdownList>
    </Dropdown>
  );
};
