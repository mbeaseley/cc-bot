import { Reaction } from 'Root/types/reaction';
import { reactionService } from 'Services/reaction.service';
import { rulesService } from 'Services/rules.service';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import {
  BaseGuildEmojiManager,
  CommandInteraction,
  Guild,
  GuildEmoji,
  Message,
  MessageEmbed
} from 'discord.js';
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from 'discordx';

@Discord()
@SlashGroup({ name: 'custom-question', description: 'Manage custom server messaging' })
@SlashGroup('custom-question')
export abstract class CustomQuestion extends Command {
  constructor() {
    super();
  }

  /**
   * Get emoji
   * @param emojis
   * @param target
   * @returns GuildEmoji | undefined
   */
  getEmoji(emojis: BaseGuildEmojiManager, target: string): GuildEmoji | undefined {
    return emojis.cache.find((emoji) => emoji.name === target);
  }

  /**
   * Create message
   * @param message
   * @param bot
   * @returns MessageEmbed
   */
  private createMessage(
    title: string,
    message: string,
    iconURL?: string,
    guild?: Guild
  ): MessageEmbed {
    const msg = new MessageEmbed()
      .setColor('RANDOM')
      .setAuthor({ name: title, iconURL })
      .setDescription(message);

    const img = guild?.iconURL();
    if (img) {
      msg.setThumbnail(img);
    }

    return msg;
  }

  /**
   * Server rules init
   * @param interaction
   */
  @Slash('rules', {
    description: 'moderator command to post custom server rules with accept emoji'
  })
  async rulesInit(
    @SlashChoice('Yes', 'No')
    @SlashOption('react', {
      description: 'Do you want your community to react to this message? (Mark to agree)'
    })
    react: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { guild, client, channel } = interaction;

    try {
      const { emojiAcceptRules } = environment;

      if (!emojiAcceptRules?.name) {
        throw new Error();
      }

      const e = this.getEmoji(client.emojis, emojiAcceptRules.name);

      const rules = await rulesService.getServerRules(guild as Guild, e);
      const rulesMessage = rules.map((r) => r.content).join(`\n\n`);

      const g = await guild?.fetch();
      const ruleMsg = this.createMessage(
        this.c('customHeading', guild?.name ?? 'Discord'),
        rulesMessage,
        guild?.iconURL() ?? undefined,
        g as Guild
      );

      if (react === 'No') {
        await channel?.send({
          embeds: [ruleMsg as MessageEmbed]
        });
      } else {
        const msg = (await channel?.send({
          embeds: [ruleMsg as MessageEmbed]
        })) as Message;
        await msg.react(e as GuildEmoji);
      }

      await interaction.reply(this.c('questionSetup'));
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }

  /**
   * Get formatted emojis and role reactions
   * @param emojis
   * @param reactionRoles
   * @param guild
   * @returns { guildEmojis: GuildEmoji[]; roleArray: string[] }
   */
  private getFormattedRoles(
    emojis: BaseGuildEmojiManager,
    reactionRoles: Reaction[],
    guild: Guild
  ): { guildEmojis: GuildEmoji[]; roleArray: string[] } {
    const guildEmojis = reactionRoles
      .map((r) => {
        const keys = Object.keys(r);
        return this.getEmoji(emojis, keys[0]) ?? { name: keys[0] };
      })
      .filter((g) => g?.name) as GuildEmoji[];

    const arr = guildEmojis.map((ge) => {
      const { name, id } = ge;
      const role = reactionRoles.find((r) => r[name as string] !== undefined);
      if (!role?.[name as string] && !guild?.roles) {
        return '';
      }
      const r = Utility.findRole(guild.roles, role?.[name as string]);

      if (!r) {
        throw new Error();
      }

      const roleCopy = r?.mentionable ? '<@&' + r?.id + '>' : (r?.name as string);
      return id
        ? this.c('roleAction', name as string, id, roleCopy)
        : this.c('roleActionDefault', name as string, roleCopy);
    });

    return {
      guildEmojis,
      roleArray: arr
    };
  }

  /**
   * Server game roles init
   * @param interaction
   */
  @Slash('game-roles', { description: 'Post custom server game roles' })
  async gameInit(interaction: CommandInteraction): Promise<void> {
    const { client, guild, channel } = interaction;
    try {
      if (!guild) {
        await interaction.reply(this.c('unexpectedError'));
        throw new Error();
      }

      const reactionRoles = await reactionService.getReactionRoles(guild, {
        type: 'game'
      });

      const { guildEmojis, roleArray } = this.getFormattedRoles(
        client.emojis,
        reactionRoles,
        guild
      );

      const message = this.createMessage(
        this.c('questionAuthor'),
        this.c('questionDescription', roleArray.toString()),
        client.user?.displayAvatarURL()
      );

      const msg = (await channel?.send({
        embeds: [message as MessageEmbed]
      })) as Message;
      guildEmojis.forEach(async (e) => await msg.react(e.id ? e : `${e.name}`));

      await interaction.reply(this.c('questionSetup'));
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }

  /**
   * Server devices init
   * @param interaction
   */
  @Slash('device-roles', { description: 'Post custom server device roles' })
  async deviceInit(interaction: CommandInteraction): Promise<void> {
    const { client, guild, channel } = interaction;
    try {
      if (!guild) {
        await interaction.reply(this.c('unexpectedError'));
        throw new Error();
      }

      const reactionRoles = await reactionService.getReactionRoles(guild, { type: 'device' });

      const { guildEmojis, roleArray } = this.getFormattedRoles(
        client.emojis,
        reactionRoles,
        guild
      );

      const message = this.createMessage(
        this.c('questionDevices'),
        this.c('questionNoDescrption', roleArray.toString()),
        client.user?.displayAvatarURL()
      );

      const msg = (await channel?.send({
        embeds: [message as MessageEmbed]
      })) as Message;
      guildEmojis.forEach(async (e) => await msg.react(e.id ? e : `${e.name}`));

      await interaction.reply(this.c('questionSetup'));
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }

  /**
   * Server pronoun init
   * @param interaction
   */
  @Slash('pronoun-roles', { description: 'Post custom server pronoun roles' })
  async pronounInit(interaction: CommandInteraction): Promise<void> {
    const { client, guild, channel } = interaction;
    try {
      if (!guild) {
        await interaction.reply(this.c('unexpectedError'));
        throw new Error();
      }

      const reactionRoles = await reactionService.getReactionRoles(guild, { type: 'pronoun' });

      const { guildEmojis, roleArray } = this.getFormattedRoles(
        client.emojis,
        reactionRoles,
        guild
      );

      const message = this.createMessage(
        this.c('questionPronoun'),
        this.c('questionNoDescrption', roleArray.toString()),
        client.user?.displayAvatarURL()
      );

      const msg = (await channel?.send({
        embeds: [message as MessageEmbed]
      })) as Message;
      guildEmojis.forEach(async (e) => await msg.react(e.id ? e : `${e.name}`));

      await interaction.reply(this.c('questionSetup'));
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }

  /**
   * Server pronoun init
   * @param interaction
   */
  @Slash('community-roles', { description: 'Post custom server community roles' })
  async communityInit(interaction: CommandInteraction): Promise<void> {
    const { client, guild, channel } = interaction;
    try {
      if (!guild) {
        await interaction.reply(this.c('unexpectedError'));
        throw new Error();
      }

      const reactionRoles = await reactionService.getReactionRoles(guild, { type: 'community' });

      const { guildEmojis, roleArray } = this.getFormattedRoles(
        client.emojis,
        reactionRoles,
        guild
      );

      const message = this.createMessage(
        this.c('questionCommunity'),
        this.c('questionNoDescrption', roleArray.toString()),
        client.user?.displayAvatarURL()
      );

      const msg = (await channel?.send({
        embeds: [message as MessageEmbed]
      })) as Message;
      guildEmojis.forEach(async (e) => await msg.react(e.id ? e : `${e.name}`));

      await interaction.reply(this.c('questionSetup'));
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}
