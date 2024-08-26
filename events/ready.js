const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Hadi gidelim kaptan! Login: ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: '🖤 discord.gg/styx', type: ActivityType.Playing }],
      status: 'online'
    });
  },
};
