import {
  GuildMember,
  Message,
  MessageAttachment,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';
import { ArgsOf, Client, Discord, On } from 'discordx';
import Translate from '../utils/translate';
import * as Canvas from 'canvas';
import path from 'path';
import { environment } from '../utils/environment';

@Discord()
export abstract class WelcomeAdd {
  private color = '#ffffff';
  private strokeColor = '#74037b';
  private font = 'sans-serif';

  /**
   * Apply styled text
   * @param canvas
   * @param text
   * @returns font string
   */
  private applyText(canvas: Canvas.Canvas, text: string): string {
    const context = canvas.getContext('2d');
    let fontSize = 70;

    do {
      context.font = `${(fontSize -= 10)}px ${this.font}`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
  }

  /**
   * Create canvas MessageAttachment
   * @param member
   * @returns Canvas
   */
  private async createCanvas(
    member: GuildMember | PartialGuildMember,
    memberCount: number
  ): Promise<Canvas.Canvas | void> {
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(
      path.join(__dirname, '../assets/images/welcome-background.png')
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = this.strokeColor;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Welcome
    context.font = `28px ${this.font}`;
    context.fillStyle = this.color;
    context.fillText(
      Translate.find('memberWelcome'),
      canvas.width / 2.5,
      canvas.height / 3.5
    );

    // Member Name
    context.font = this.applyText(canvas, `${member.displayName}!`);
    context.fillStyle = this.color;
    context.fillText(
      `${member.displayName}!`,
      canvas.width / 2.5,
      canvas.height / 1.8
    );

    // Member Count
    context.font = `20px ${this.font}`;
    context.fillStyle = this.color;
    context.fillText(
      Translate.find('memberCount', memberCount.toString()),
      canvas.width / 2.5,
      canvas.height / 1.4
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    if (!member?.user) {
      return Promise.reject();
    }

    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: 'png',
      })
    );
    context.drawImage(avatar, 25, 25, 200, 200);

    return canvas;
  }

  /**
   * Member joined server
   * @param member
   * @returns
   */
  private async handleMessage(
    member: GuildMember | PartialGuildMember
  ): Promise<Message | void> {
    if (member.partial) {
      try {
        await member.fetch();
      } catch (e: unknown) {
        return Promise.reject(e);
      }
    }
    const { guild } = member;

    const channel = guild.channels?.cache.get(`${environment.memberAdd}`);
    if (!channel) {
      return Promise.resolve();
    }

    if (
      !((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(
        channel
      )
    ) {
      return Promise.resolve();
    }

    const memberCount = guild.members.cache.filter((m) => !m.user?.bot);
    const canvas = (await this.createCanvas(
      member,
      memberCount.size
    )) as Canvas.Canvas;

    if (!canvas) {
      return Promise.resolve();
    }

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      'welcome-image.png'
    );

    return channel.send({
      content: Translate.find('memberSend', `<@!${member.id}>`),
      files: [attachment],
    });
  }

  /**
   * guildMemberAdd event
   * @param guildMember
   */
  @On('guildMemberAdd')
  async init([guildMember]: ArgsOf<'guildMemberAdd'>): Promise<Message | void> {
    return this.handleMessage(guildMember);
  }
}
