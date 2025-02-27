import { Provider, Module } from '@nestjs/common';
import {
  CreateExecutionDetails,
  BulkCreateExecutionDetails,
  CalculateLimitNovuIntegration,
  DigestFilterSteps,
  DigestFilterStepsRegular,
  DigestFilterStepsBackoff,
  DigestFilterStepsTimed,
  GetDecryptedIntegrations,
  GetSubscriberPreference,
  GetSubscriberTemplatePreference,
  CompileEmailTemplate,
  CompileTemplate,
  GetLayoutUseCase,
  GetNovuLayout,
  QueueService,
  TriggerQueueService,
  AddJob,
  AddDelayJob,
  AddDigestJob,
  EventsDistributedLockService,
  SendTestEmail,
  SendTestEmailCommand,
  CreateSubscriber,
  UpdateSubscriber,
  TriggerEvent,
  CreateNotificationJobs,
  ProcessSubscriber,
  StoreSubscriberJobs,
  CalculateDelayService,
  WsQueueService,
  SelectIntegration,
  GetNovuProviderCredentials,
} from '@novu/application-generic';
import { JobRepository } from '@novu/dal';

import { SharedModule } from '../shared/shared.module';
import { WorkflowQueueService } from './services/workflow-queue.service';
import { TriggerProcessorQueueService } from './services/trigger-processor-queue.service';
import {
  MessageMatcher,
  SendMessage,
  SendMessageChat,
  SendMessageDelay,
  SendMessageEmail,
  SendMessageInApp,
  SendMessagePush,
  SendMessageSms,
  Digest,
  GetDigestEventsBackoff,
  GetDigestEventsRegular,
  HandleLastFailedJob,
  QueueNextJob,
  RunJob,
  SetJobAsCompleted,
  SetJobAsFailed,
  UpdateJobStatus,
  WebhookFilterBackoffStrategy,
} from './usecases';
import { MetricQueueService } from './services/metric-queue.service';

const USE_CASES = [
  AddJob,
  AddDelayJob,
  AddDigestJob,
  CalculateLimitNovuIntegration,
  CreateExecutionDetails,
  BulkCreateExecutionDetails,
  GetDecryptedIntegrations,
  SelectIntegration,
  GetSubscriberPreference,
  GetSubscriberTemplatePreference,
  HandleLastFailedJob,
  MessageMatcher,
  QueueNextJob,
  RunJob,
  SendMessage,
  SendMessageChat,
  SendMessageDelay,
  SendMessageEmail,
  SendMessageInApp,
  SendMessagePush,
  SendMessageSms,
  SendTestEmail,
  SendTestEmailCommand,
  CompileEmailTemplate,
  CompileTemplate,
  Digest,
  GetDigestEventsBackoff,
  GetDigestEventsRegular,
  DigestFilterStepsTimed,
  GetLayoutUseCase,
  GetNovuLayout,
  DigestFilterSteps,
  DigestFilterStepsRegular,
  DigestFilterStepsBackoff,
  SetJobAsCompleted,
  SetJobAsFailed,
  UpdateJobStatus,
  WebhookFilterBackoffStrategy,
  StoreSubscriberJobs,
  TriggerEvent,
  CreateNotificationJobs,
  ProcessSubscriber,
  CreateSubscriber,
  UpdateSubscriber,
  GetNovuProviderCredentials,
];

const REPOSITORIES = [JobRepository];

const SERVICES: Provider[] = [
  {
    provide: MetricQueueService,
    useClass: MetricQueueService,
  },
  {
    provide: QueueService,
    useClass: WorkflowQueueService,
  },
  {
    provide: TriggerQueueService,
    useClass: TriggerProcessorQueueService,
  },
  {
    provide: WsQueueService,
    useClass: WsQueueService,
  },
  {
    provide: 'BULLMQ_LIST',
    useFactory: (workflowQueue: QueueService, triggerQueue: TriggerQueueService, wsQueue: WsQueueService) => {
      return [workflowQueue, triggerQueue, wsQueue];
    },
    inject: [QueueService, TriggerQueueService, WsQueueService],
  },
  EventsDistributedLockService,
  CalculateDelayService,
  TriggerProcessorQueueService,
  WorkflowQueueService,
];

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [...USE_CASES, ...REPOSITORIES, ...SERVICES],
})
export class WorkflowModule {}
