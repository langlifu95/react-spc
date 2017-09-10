// @flow
const debug = require('debug')('mercury:queue:process-thread-created');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import { THREAD_CREATED_SCORE } from '../constants';

export default async data => {
  // entityId represents the communityId
  const { userId, entityId } = data;
  const communityId = entityId;

  debug(`Processing thread created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return updateReputation(userId, communityId, THREAD_CREATED_SCORE);
};
