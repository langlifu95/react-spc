// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateChannelSettings,
  disableChannelTokenJoin,
} from '../../models/channelSettings';
import { userCanManageChannel } from './utils';

type DisableChannelTokenJoinInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: DisableChannelTokenJoinInput,
  { user, loaders }: GraphQLContext
) => {
  if (await !userCanManageChannel(user.id, channelId)) {
    return new UserError('You don’t have permission to manage this channel');
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await disableChannelTokenJoin(channelId)
  );
};
