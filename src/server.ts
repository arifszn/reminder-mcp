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
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register reminder tools
server.tool('get-reminders', 'Get all reminders', getRemindersHandler);

server.tool(
  'get-current-time',
  'Get the current local time',
  getCurrentTimeHandler
);

server.tool(
  'create-reminder',
  'Create a reminder',
  {
    title: z.string().describe('The title of the reminder'),
    datetime: z.coerce
      .date()
      .describe('YYYY-MM-DDTHH:mm:ss formatted date and time for the reminder'),
  },
  createReminderHandler
);

server.tool(
  'delete-reminder',
  'Delete reminders by title, processed, or all',
  {
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
  deleteReminderHandler
);
