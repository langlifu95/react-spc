// @flow
import gql from 'graphql-tag';

export type ChannelMetaDataType = {
  metaData: {
    threads: number,
    members: number,
    onlineMembers: number,
  },
};

export default gql`
  fragment channelMetaData on Channel {
    metaData {
      threads
      members
      onlineMembers
    }
  }
`;
