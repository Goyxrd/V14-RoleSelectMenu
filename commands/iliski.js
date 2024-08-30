const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'iliskipanel',
  description: 'İlişki rol paneli oluşturur.',
  ownerOnly: true,

  async execute(message, args) {
    if (message.author.id !== config.ownerID) {
      return message.reply('Bu komuta erişim izniniz yok.');
    }

    const roller = {
      sevgilim: 'ID',
      sevgilimyok: 'ID',
      ilgilenmiyorum: 'ID'
    };

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('iliski')
        .setPlaceholder('İlişki Rolleri Menüsü')
        .addOptions([
          { label: 'Sevgilim Var', value: 'sevgilim', emoji: '❤️' },
          { label: 'Sevgilim Yok', value: 'sevgilimyok', emoji: '💔' },
          { label: 'İlgilenmiyorum', value: 'ilgilenmiyorum', emoji: '😐' },
          { label: 'Rol İstemiyorum', value: 'roldelete', emoji: '🗑️' }
        ])
    );

    const panelMessage = await message.channel.send({
      content: '> 🎀 Menü Üzerinden **İlişki** Rolünüzü Alabilirsiniz',
      components: [row]
    });

    const filter = interaction => interaction.customId === 'iliski';

    const collector = panelMessage.createMessageComponentCollector({
      filter,
      time: 0
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'iliski') return;

      await interaction.deferReply({ ephemeral: true });

      const member = interaction.member;
      const selectedRoleID = roller[interaction.values[0]];

      if (interaction.values[0] === 'roldelete') {
        for (const roleID of Object.values(roller)) {
          if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }
        await interaction.editReply({ content: '🎀 Tüm ilişki rolleriniz alındı' });
      } else {
        for (const roleID of Object.values(roller)) {
          if (roleID !== selectedRoleID && member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }

        const role = message.guild.roles.cache.get(selectedRoleID);
        if (role) {
          await member.roles.add(role);
          await interaction.editReply({ content: `🎀 Artık ${role.name} rolüne sahipsiniz` });
        }
      }
    });

    collector.on('end', collected => {
    });
  }
};
