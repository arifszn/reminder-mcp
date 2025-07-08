import { ReminderService } from '../services/index.js';

const reminderService = new ReminderService();

export const createReminderHandler = async ({
  title,
  datetime,
}: {
  title: string;
  datetime: Date;
}) => {
  try {
    await reminderService.createReminder(title, datetime);

    const localTime = datetime.toLocaleString();
    return {
      content: [
        {
          type: 'text' as const,
          text: `Reminder created at local time: ${localTime}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text:
            error instanceof Error
              ? error.message
              : 'Failed to create reminder',
        },
      ],
    };
  }
};
