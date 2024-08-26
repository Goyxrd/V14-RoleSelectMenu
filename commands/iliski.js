const { ActionRowBuilder, StringSelectMenuBuilder, InteractionType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'iliskipanel',
  description: 'İlişki rol paneli oluşturur.',
  ownerOnly: true,

  async execute(message, args) {
    if (message.author.id !== config.ownerID) {
      return message.reply('Bu komuta erişim izniniz yok');
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

    await message.channel.send({
      content: '> 🎀 Menü Üzerinden **İlişki** Rolünüzü Alabilirsiniz',
      components: [row]
    });

    const filter = interaction => interaction.customId === 'iliski';

    const collector = message.channel.createMessageComponentCollector({ 
      filter,
      time: 0
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'iliski') return;

      const member = interaction.member;
      const selectedRoleID = roller[interaction.values[0]];

      if (interaction.values[0] === 'roldelete') {
        for (const roleID of Object.values(roller)) {
          if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }
        await interaction.reply({ content: 'Tüm ilişki rolleriniz alındı.', ephemeral: true });
      } else {
        for (const roleID of Object.values(roller)) {
          if (roleID !== selectedRoleID && member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }

        const role = message.guild.roles.cache.get(selectedRoleID);
        if (role) {
          await member.roles.add(role);
          await interaction.reply({ content: `Artık ${role.name} rolüne sahipsiniz!`, ephemeral: true });
        }
      }
    });

    collector.on('end', collected => {
    });
  }
};
