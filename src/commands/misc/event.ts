import { PollQuestion, selectionEmojis } from 'Types/poll';
import { Command } from 'Utils/command';
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
export abstract class Event extends Command {
  private alphabet: string[] = [...'abcdefghijklmnopqrstuvwxyz'];

  constructor() {
    super();
  }

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
    const defaultPoll = this.c('eventPollDefaultMessage');
    const pollCopy = poll ? this.c('eventPollWanted') : '';

    return new MessageEmbed()
      .setColor(8720506)
      .setAuthor({ name: this.c('eventHeading'), iconURL: bot?.displayAvatarURL() })
      .setDescription(this.c('eventDescription', title, author, pollCopy, defaultPoll));
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
      .setAuthor({ name: this.c('eventPollAuthor'), iconURL: user?.displayAvatarURL() })
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
    const pollCopy = poll ? this.c('eventAnnouncmentPoll') : '';

    return new MessageEmbed()
      .setColor(8720506)
      .setAuthor({ name: this.c('eventAnnouncmentPollHeading'), iconURL: bot?.displayAvatarURL() })
      .setDescription(this.c('eventActionComplete', author, title, pollCopy));
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
      await interaction.reply(this.c('eventNoCategory'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (!isGeneralChannel) {
      await interaction.reply(this.c('eventNoChannel'));
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
      await interaction.reply(this.c('eventNoNewChannel'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const pollWanted = poll === 'true';
    await newChannel?.setParent(category.id);
    const msg = this.createChannelBaseMessage(title, user.id, pollWanted, client.user);
    await newChannel.send({ embeds: [msg] });

    if (pollWanted) {
      const pollQuestion = new PollQuestion(
        this.c('eventPollQuestion'),
        [this.c('eventPollYes'), this.c('eventPollNo')] ?? []
      );
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
