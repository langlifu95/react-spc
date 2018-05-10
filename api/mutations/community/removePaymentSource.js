// @flow
const debug = require('debug')('api:mutations:community:remove-payment-source');
import { replaceStripeCustomer } from '../../models/stripeCustomers';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    communityId: string,
    sourceId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { sourceId, communityId } = args.input;
  const { user, loaders } = ctx;

  const { customer, community } = await StripeUtil.jobPreflight(communityId);

  if (!community) {
    debug('Error getting community in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  if (!customer) {
    debug('Error creating customer in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  if (!await canAdministerCommunity(user.id, communityId, loaders)) {
    return new UserError(
      'You must own this community to manage payment sources'
    );
  }

  const detachSource = async () =>
    await StripeUtil.detachSource({
      customerId: customer.id,
      sourceId: sourceId,
    });

  return detachSource()
    .then(async () => await StripeUtil.getCustomer(customer.id))
    .then(
      async newCustomer =>
        await replaceStripeCustomer(newCustomer.id, newCustomer)
    )
    .then(() => community)
    .catch(err => {
      return new UserError(`Error removing payment method: ${err.message}`);
    });
});
