import 'dotenv/config';
import { z } from 'zod';
import { NotificationPlatform } from './types/notification-platform.js';

const envSchema = z.discriminatedUnion('NOTIFICATION_PLATFORM', [
  z.object({
    NOTIFICATION_PLATFORM: z.literal(NotificationPlatform.SLACK),
    SLACK_WEBHOOK_URL: z.string().url(),
  }),
  z.object({
    NOTIFICATION_PLATFORM: z.literal(NotificationPlatform.TELEGRAM),
    TELEGRAM_BOT_TOKEN: z.string(),
    TELEGRAM_CHAT_ID: z.string(),
  }),
]);

const baseSchema = z.object({
  CRON_JOB_API_KEY: z.string(),
});

const fullSchema = baseSchema.and(envSchema);

const parsedEnv = fullSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
