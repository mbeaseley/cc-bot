import { PollQuestion, selectionEmojis } from 'Types/poll';
import { environment } from 'Utils/environment';
import { ClientUser, CommandInteraction, EmbedField, MessageEmbed } from 'discord.js';
import { Discord, Permission, Slash, SlashChoice, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission({
  id: environment.eventIds.role,
  type: 'ROLE',
  permission: true
})
export abstract class Event {
  private alphabet: string[] = [...'abcdefghijklmnopqrstuvwxyz'];

  /**
   * Create message for created channel
   * @param title
   * @param author
   * @param poll
   * @param bot
   * @returns MessageEmbed
   */
  private createChannelBaseMessage(
    title: string,
    author: string,
    poll: boolean,
    bot: ClientUser | null
  ): MessageEmbed {
    const defaultPoll = `To create a poll, please use '/poll' and follow the instructions when adding a poll question and options!`;
    const pollCopy = poll
      ? 'A poll has been created to check who is interested in this event! '
      : '';

    return new MessageEmbed()
      .setColor(8720506)
      .setAuthor('New Event Announcement', bot?.displayAvatarURL())
      .setDescription(
        `Welcome to ${title} event channel, lets organise this event!\n\nTo help your friends, <@!${author}> is the creator of this event. Any questions should be placed towards this person!\n\n${pollCopy}${defaultPoll}\n\n Enjoy! Hope everything goes to plan!`
      );
  }

  /**
   * Create embed messaged
   * @param poll
   * @param user
   * @returns MessageEmbed
   */
  private createPollMessage(poll: PollQuestion, user: ClientUser | null): MessageEmbed {
    const answers = poll.answers
      .filter((el) => el)
      .map((a, i) => {
        return `${selectionEmojis[i][this.alphabet[i]]} ${a}\n`;
      });

    const field = {
      name: `${poll.question}\n  `,
      value: answers.toString().split(',').join(''),
      inline: false
    } as EmbedField;

    return new MessageEmbed()
      .setAuthor('Poll Command', user?.displayAvatarURL())
      .setColor(8720506)
      .addField(field.name, field.value, field.inline);
  }

  /**
   * Create success message
   * @param title
   * @param author
   * @param poll
   * @param bot
   * @returns MessageEmbed
   */
  private createActionCompleteMessage(
    title: string,
    author: string,
    poll: boolean,
    bot: ClientUser | null
  ): MessageEmbed {
    const pollCopy = poll
      ? 'A poll has been created to find out interest levels, please respond!'
      : '';

    return new MessageEmbed()
      .setColor(8720506)
      .setAuthor('New Event Announcement', bot?.displayAvatarURL())
      .setDescription(
        `🎟️ New event! @everyone, <@!${author}> has created a event called ${title}.\n\n${pollCopy}`
      );
  }

  /**
   * Event Command
   * @param title
   * @param description
   * @param poll
   * @param interaction
   */
  @Slash('create-event', {
    description: 'Create an event include creating channel and poll'
  })
  async init(
    @SlashOption('title', {
      description: 'Title of event'
    })
    title: string,
    @SlashOption('description', {
      description: 'description of event'
    })
    description: string,
    @SlashChoice('Yes', 'true')
    @SlashChoice('No', 'false')
    @SlashOption('poll', {
      description: 'description of event'
    })
    poll: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { guild, user, client, channel } = interaction;

    const category = guild?.channels.cache.find((c) => c.id === environment.eventIds.category);
    const isGeneralChannel = !!guild?.channels.cache.find(
      (c) => c.id === environment.eventIds.channel && environment.eventIds.channel === channel?.id
    );

    if (!category) {
      await interaction.reply('**Unable to find category channel**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (!isGeneralChannel) {
      await interaction.reply('**Please create event on general channel**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (category?.partial) {
      await category.fetch();
    }

    const newChannel = await guild?.channels.create(title, {
      type: 'GUILD_TEXT',
      topic: description
    });

    if (!newChannel) {
      await interaction.reply('**Unable to create text channel**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const pollWanted = poll === 'true';
    await newChannel?.setParent(category.id);
    const msg = this.createChannelBaseMessage(title, user.id, pollWanted, client.user);
    await newChannel.send({ embeds: [msg] });

    if (pollWanted) {
      const pollQuestion = new PollQuestion('Are you interested?', ['Yes', 'No'] ?? []);
      const pollMsg = this.createPollMessage(pollQuestion, client.user);
      const pollInteraction = await newChannel.send({ embeds: [pollMsg] });
      pollQuestion.answers.forEach(async (_, i) => {
        await pollInteraction.react(selectionEmojis[i][this.alphabet[i]]);
      });
    }

    const successMsg = this.createActionCompleteMessage(title, user.id, pollWanted, client.user);
    return interaction.reply({ embeds: [successMsg] });
  }
}
