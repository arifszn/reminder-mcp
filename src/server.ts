import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DeletionType } from './types/index.js';
import {
  getRemindersHandler,
  getCurrentTimeHandler,
  createReminderHandler,
  deleteReminderHandler,
} from './tools/index.js';

// Create server instance
export const server = new McpServer({
  name: 'reminder',
  version: '1.0.0',
});

// Register reminder tools
server.registerTool('get-reminders', {
  description: 'Get all reminders',
}, getRemindersHandler);

server.registerTool('get-current-time', {
  description: 'Get the current local time',
}, getCurrentTimeHandler);

server.registerTool('create-reminder', {
  description: `Create a reminder
You MUST call this function before 'get-current-time' to obtain the current time.
  `,
  inputSchema: {
    title: z.string().describe('The title of the reminder'),
    datetime: z.coerce
      .date()
      .describe('YYYY-MM-DDTHH:mm:ss formatted date and time for the reminder'),
  },
}, createReminderHandler);

server.registerTool('delete-reminder', {
  description: 'Delete reminders by title, processed, or all',
  inputSchema: {
    deletionType: z
      .nativeEnum(DeletionType)
      .describe('Type of deletion: title, processed, or all'),
    title: z
      .string()
      .optional()
      .describe(
        'The title of the reminder (required if deletionType is title)'
      ),
  },
}, deleteReminderHandler);
