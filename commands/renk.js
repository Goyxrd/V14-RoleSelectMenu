const { ActionRowBuilder, StringSelectMenuBuilder, InteractionType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'renkpanel',
  description: 'Renk rol paneli oluşturur.',
  ownerOnly: true,

  async execute(message, args) {
    if (message.author.id !== config.ownerID) {
      return message.reply('Bu komuta erişim izniniz yok');
    }

    const roller = {
      siyah: 'ID',
      beyaz: 'ID',
      pembe: 'ID',
      kirmizi: 'ID',
      turuncu: 'ID',
      sarı: 'ID',
      yeşil: 'ID',
      mavi: 'ID',
      mor: 'ID'
    };

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('renkler')
        .setPlaceholder('Renk Rolleri Menüsü')
        .addOptions([
          { label: 'Siyah', value: 'siyah', emoji: '🖤' },
          { label: 'Beyaz', value: 'beyaz', emoji: '🤍' },
          { label: 'Pembe', value: 'pembe', emoji: '💗' },
          { label: 'Kırmızı', value: 'kirmizi', emoji: '❤️' },
          { label: 'Turuncu', value: 'turuncu', emoji: '🧡' },
          { label: 'Sarı', value: 'sarı', emoji: '💛' },
          { label: 'Yeşil', value: 'yeşil', emoji: '💚' },
          { label: 'Mavi', value: 'mavi', emoji: '💙' },
          { label: 'Mor', value: 'mor', emoji: '💜' },
          { label: 'Rol İstemiyorum', value: 'roldelete', emoji: '🗑️' }
        ])
    );

    await message.channel.send({
      content: '> 🎀 Menü Üzerinden **Renk** Rolünüzü Alabilirsiniz',
      components: [row]
    });

    const filter = interaction => interaction.customId === 'renkler';

    const collector = message.channel.createMessageComponentCollector({ 
      filter,
      time: 0 
    });

    collector.on('collect', async interaction => {
      if (interaction.customId !== 'renkler') return;

      const member = interaction.member;
      const selectedRole = roller[interaction.values[0]];

      if (interaction.values[0] === 'roldelete') {
        for (const roleID of Object.values(roller)) {
          if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }
        await interaction.reply({ content: 'Tüm renk rolleriniz alındı', ephemeral: true });
      } else {
        for (const roleID of Object.values(roller)) {
          if (roleID !== selectedRole && member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID);
          }
        }

        const role = message.guild.roles.cache.get(selectedRole);
        if (role) {
          await member.roles.add(role);
          await interaction.reply({ content: `Artık ${role.name} rolüne sahipsiniz`, ephemeral: true });
        }
      }
    });

    collector.on('end', collected => {
    });
  }
};
