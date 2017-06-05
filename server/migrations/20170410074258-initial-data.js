'use strict';

exports.up = function(r, conn) {
  return (
    Promise.all([
      r.tableCreate('threads').run(conn),
      r.tableCreate('channels').run(conn),
      r.tableCreate('communities').run(conn),
      r.tableCreate('messages').run(conn),
      r.tableCreate('sessions').run(conn),
      r.tableCreate('reactions').run(conn),
      r.tableCreate('directMessageThreads').run(conn),
      r.tableCreate('users').run(conn),
      r.tableCreate('notifications').run(conn),
      r.tableCreate('recurringPayments').run(conn),
      r.tableCreate('invoices').run(conn),
      r.tableCreate('usersCommunities').run(conn),
      r.tableCreate('usersChannels').run(conn),
      r.tableCreate('usersDirectMessageThreads').run(conn),
      r.tableCreate('usersNotifications').run(conn),
      r.tableCreate('usersThreads').run(conn),
    ])
      // Create secondary indexes
      .then(() =>
        Promise.all([
          // index user by username
          r.table('users').indexCreate('username', r.row('username')).run(conn),
          // index recurringPayments by userId
          r
            .table('recurringPayments')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          // index invoices by communityId
          r
            .table('invoices')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn),
          // indexes on usersCommunities join table
          r
            .table('usersCommunities')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          r
            .table('usersCommunities')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn),
          // indexes on usersThreads join table
          r
            .table('usersThreads')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          r
            .table('usersThreads')
            .indexCreate('threadId', r.row('threadId'))
            .run(conn),
          // indexes on usersChannels join table
          r
            .table('usersChannels')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          r
            .table('usersChannels')
            .indexCreate('channelId', r.row('channelId'))
            .run(conn),
          // indexes on usersDirectMessageThreads join table
          r
            .table('usersDirectMessageThreads')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          r
            .table('usersDirectMessageThreads')
            .indexCreate('threadId', r.row('threadId'))
            .run(conn),
          // index direct message threads by the users
          r
            .table('directMessageThreads')
            .indexCreate('participants', { multi: true })
            .run(conn),
          r
            .table('notifications')
            .indexCreate('modifiedAt', r.row('modifiedAt'))
            .run(conn),
          r
            .table('notifications')
            .indexCreate('contextId', r.row('context')('id'))
            .run(conn),
          // index usersNotifications by userId
          r
            .table('usersNotifications')
            .indexCreate('userId', r.row('userId'))
            .run(conn),
          // index usersNotifications by userId
          r
            .table('usersNotifications')
            .indexCreate('notificationId', r.row('notificationId'))
            .run(conn),
          // index threads by creator
          r
            .table('threads')
            .indexCreate('creatorId', r.row('creatorId'))
            .run(conn),
          // index threads by channelId
          r
            .table('threads')
            .indexCreate('channelId', r.row('channelId'))
            .run(conn),
          // index threads by communityId
          r
            .table('threads')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn),
          // index reactions by message
          r
            .table('reactions')
            .indexCreate('messageId', r.row('messageId'))
            .run(conn),
          // index channels by communityId
          r
            .table('channels')
            .indexCreate('communityId', r.row('communityId'))
            .run(conn),
          // index messages by thread
          r
            .table('messages')
            .indexCreate('threadId', r.row('threadId'))
            .run(conn),
        ])
      )
      .catch(err => {
        console.log(err);
      })
  );
};

exports.down = function(r, conn) {
  return Promise.all([
    r.tableDrop('threads').run(conn),
    r.tableDrop('channels').run(conn),
    r.tableDrop('communities').run(conn),
    r.tableDrop('messages').run(conn),
    r.tableDrop('sessions').run(conn),
    r.tableDrop('users').run(conn),
    r.tableDrop('directMessageThreads').run(conn),
    r.tableDrop('reactions').run(conn),
    r.tableDrop('notifications').run(conn),
    r.tableDrop('recurringPayments').run(conn),
    r.tableDrop('invoices').run(conn),
    r.tableDrop('usersCommunities').run(conn),
    r.tableDrop('usersChannels').run(conn),
    r.tableDrop('usersDirectMessageThreads').run(conn),
    r.tableDrop('usersNotifications').run(conn),
    r.tableDrop('usersThreads').run(conn),
  ]).catch(err => {
    console.log(err);
  });
};
