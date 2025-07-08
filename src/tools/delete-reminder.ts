import { ReminderService } from '../services/index.js';
import { DeletionType } from '../types/index.js';

const reminderService = new ReminderService();

export const deleteReminderHandler = async ({
  deletionType,
  title,
}: {
  deletionType: DeletionType;
  title?: string;
}) => {
  try {
    const deletedCount = await reminderService.deleteReminders(
      deletionType,
      title
    );

    if (deletedCount === 0) {
      return {
        content: [
          { type: 'text' as const, text: 'No reminders found to delete.' },
        ],
      };
    }

    return {
      content: [
        { type: 'text' as const, text: `Deleted ${deletedCount} reminder(s).` },
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
              : 'Failed to delete reminders',
        },
      ],
    };
  }
};
