// @flow
import { defaultJobOptions } from './utils';

import {
  weeklyDigestQueue,
  dailyDigestQueue,
  dailyCoreMetricsQueue,
  activeCommunityReportQueue,
  removeSeenUsersNotificationsQueue,
  databaseBackupQueue,
} from 'shared/bull/queues';

/*
  None of the cron-job initaliziers need data in the Job, so we pass undefined
  as the data argument to the queue
*/

export const weeklyDigest = () => {
  // monday morning
  return weeklyDigestQueue.add(undefined, defaultJobOptions('0 6 * * 1'));
};

export const dailyDigest = () => {
  // end of day, every day
  return dailyDigestQueue.add(undefined, defaultJobOptions('0 19 * * *'));
};

export const dailyCoreMetrics = () => {
  // midnight daily
  return dailyCoreMetricsQueue.add(undefined, defaultJobOptions('0 0 * * *'));
};

export const activeCommunityReport = () => {
  // 1am daily
  return activeCommunityReportQueue.add(
    undefined,
    defaultJobOptions('0 1 * * *')
  );
};

export const dailyBackups = () => {
  // at 9am every day (~12 hours away from the automatic daily backup)
  return databaseBackupQueue.add(undefined, defaultJobOptions('0 9 * * *'));
};

export const removeSeenUsersNotifications = () => {
  // 2am daily
  return removeSeenUsersNotificationsQueue.add(
    undefined,
    defaultJobOptions('0 2 * * *')
  );
};

export const startJobs = () => {
  weeklyDigest();
  dailyDigest();
  dailyCoreMetrics();
  activeCommunityReport();
  removeSeenUsersNotifications();
  dailyBackups();
};
