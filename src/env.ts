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
  const errors = parsedEnv.error.flatten().fieldErrors;
  const errorMessages: string[] = [];

  // Build user-friendly error messages
  if (errors.CRON_JOB_API_KEY) {
    errorMessages.push('- CRON_JOB_API_KEY is required');
  }
  if (errors.NOTIFICATION_PLATFORM) {
    errorMessages.push('- NOTIFICATION_PLATFORM must be either "slack" or "telegram"');
  }
  if (errors.SLACK_WEBHOOK_URL) {
    errorMessages.push('- SLACK_WEBHOOK_URL is required when using Slack notification platform');
  }
  if (errors.TELEGRAM_BOT_TOKEN) {
    errorMessages.push('- TELEGRAM_BOT_TOKEN is required when using Telegram notification platform');
  }
  if (errors.TELEGRAM_CHAT_ID) {
    errorMessages.push('- TELEGRAM_CHAT_ID is required when using Telegram notification platform');
  }

  const errorMessage = `
❌ Missing or invalid environment variables:
${errorMessages.join('\n')}

Required environment variables:
- CRON_JOB_API_KEY: Your API key from cron-job.org
- NOTIFICATION_PLATFORM: Either "slack" or "telegram"

For Slack:
- SLACK_WEBHOOK_URL: Your Slack webhook URL

For Telegram:
- TELEGRAM_BOT_TOKEN: Your bot token from @BotFather
- TELEGRAM_CHAT_ID: Your chat ID

Please set these environment variables and try again.
  `.trim();

  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const env = parsedEnv.data;
