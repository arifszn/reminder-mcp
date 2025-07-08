# Reminder MCP Server

A **MCP server** for scheduling and triggering reminders via Slack or Telegram.

> **Reminders are delivered even if your server is not running.**
>
> This is possible because reminders are scheduled and triggered by an external service (cron-job.org), which will send the notification to Slack or Telegram at the scheduled time, regardless of your server's status.

## Configuration

```json
{
  "mcpServers": {
    "reminder": {
      "command": "node",
      "args": [
        "/Users/arifulalam/Dev/projects/personal/reminder-mcp/build/index.js"
      ],
      "env": {
        "CRON_JOB_API_KEY": "your_api_key",
        "NOTIFICATION_PLATFORM": "slack",
        "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/xxxxxxx",
        "TELEGRAM_BOT_TOKEN": "",
        "TELEGRAM_CHAT_ID": ""
      }
    }
  }
}
```

## Environment Variables

| Name                    | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `CRON_JOB_API_KEY`      | API key from [cron-job.org](https://cron-job.org/en/) |
| `NOTIFICATION_PLATFORM` | `slack` or `telegram`                                 |
| `SLACK_WEBHOOK_URL`     | (Slack only) Webhook URL for your channel             |
| `TELEGRAM_BOT_TOKEN`    | (Telegram only) Bot token from @BotFather             |
| `TELEGRAM_CHAT_ID`      | (Telegram only) Chat ID for your group/user           |

## Usage Examples

You can use natural language instructions with LLM. Here are some examples:

- `Remind me to call Alice at 3:00 PM tomorrow.`
- `List all my reminders.`
- `Delete the reminder titled "Call Alice".`

---

## How to Get Your Credentials

### Cron Job API Key

- Register at [cron-job.org](https://cron-job.org/en/members/api/) and generate an API key.

### Slack Webhook URL

1. Go to [Slack Apps](https://api.slack.com/apps)
2. Create or select an app
3. Add the 'Incoming Webhooks' feature
4. Activate and create a webhook URL for your channel
5. Set `SLACK_WEBHOOK_URL` in the configuration env

### Telegram Bot Token & Chat ID

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Add your bot to your group or message it directly
3. Get your chat ID via the Telegram API: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the configuration env
