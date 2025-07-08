export const getCurrentTimeHandler = async () => {
  // Get the current local date and time
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const formatted =
    [now.getFullYear(), pad(now.getMonth() + 1), pad(now.getDate())].join('-') +
    'T' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(
      ':'
    );
  // Return as a text type, formatted as ISO string (local time)
  return {
    content: [
      {
        type: 'text' as const,
        text: formatted,
      },
    ],
  };
};
