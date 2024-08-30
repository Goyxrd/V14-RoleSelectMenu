const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'pronounspanel',
  description: 'Pronouns rol paneli oluşturur.',
  ownerOnly: true,

  async execute(message, args) {
    if (message.author.id !== config.ownerID) {
      return message.reply('Bu komuta erişim izniniz yok.');
    }

    const roller = {
      he: 'ID',
      she: 'ID',
      they: 'ID'
    };

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('Pronouns')
        .setPlaceholder('Pronouns Rolleri Menüsü')
        .addOptions([
          { label: 'He/Him', value: 'he', emoji: '👨' },
          { label: 'She/Her', value: 'she', emoji: '👩' },
          { label: 'They/Them', value: 'they', emoji: '🌈' },
          { label: 'Rol İstemiyorum', value: 'roldelete', emoji: '🗑️' }
        ])
    );

    const panelMessage = await message.channel.send({
      content: '> 🎀 Menü Üzerinden **Pronouns** Rolünüzü Alabilirsiniz',
      components: [row]
    });

    const filter = interaction => interaction.customId === 'Pronouns';

    const collector = panelMessage.createMessageComponentCollector({
      filter,
      time: 0 
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'Pronouns') return;

      await interaction.deferReply({ ephemeral: true });

      const member = interaction.member;
      const selectedRole = roller[interaction.values[0]];

      if (interaction.values[0] === 'roldelete') {
        for (const roleID of Object.values(roller)) {
          if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }
        await interaction.editReply({ content: '🎀 Tüm pronouns rolleriniz alındı' });
      } else {
        for (const roleID of Object.values(roller)) {
          if (roleID !== selectedRole && member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }

        const role = message.guild.roles.cache.get(selectedRole);
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
