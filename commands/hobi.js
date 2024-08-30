const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'hobipanel',
  description: 'Hobi rol paneli oluşturur',

  async execute(message, args) {
    const roller = {
      tiktoker: 'ID',
      sporcu: 'ID',
      sessanat: 'ID',
      ressam: 'ID',
      dansci: 'ID',
      gamer: 'ID',
      animeci: 'ID'
    };

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('hobiler')
        .setPlaceholder('Hobi Rolleri Menüsü')
        .addOptions([
          { label: 'Tiktoker', value: 'tiktoker', emoji: '🎥' },
          { label: 'Sporcu', value: 'sporcu', emoji: '⚽' },
          { label: 'Ses Sanatçısı', value: 'sessanat', emoji: '🎤' },
          { label: 'Ressam', value: 'ressam', emoji: '🎨' },
          { label: 'Dansçı', value: 'dansci', emoji: '💃' },
          { label: 'Gamer', value: 'gamer', emoji: '🎮' },
          { label: 'Animeci', value: 'animeci', emoji: '👾' },
          { label: 'Rol İstemiyorum', value: 'roldelete', emoji: '🗑️' }
        ])
    );

    const panelMessage = await message.channel.send({
      content: '> 🎀 Menü Üzerinden **Hobi** Rolünüzü Alabilirsiniz',
      components: [row]
    });

    const filter = interaction => interaction.customId === 'hobiler';

    const collector = panelMessage.createMessageComponentCollector({
      filter,
      time: 0 
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'hobiler') return;

      await interaction.deferReply({ ephemeral: true });

      const member = interaction.member;
      const selectedValue = interaction.values[0];
      const selectedRoleID = roller[selectedValue];

      if (selectedValue === 'roldelete') {
        for (const roleID of Object.values(roller)) {
          if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }
        await interaction.editReply({ content: '🎀 Tüm hobi rolleriniz alındı' });
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
