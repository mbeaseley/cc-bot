import {
  GuildMember,
  Message,
  MessageAttachment,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';
import * as Canvas from 'canvas';
import path = require('path');

export class MemberAdd {
  color: string = '#ffffff';
  strokeColor: string = '#74037b';
  font: string = 'sans-serif';

  /**
   * Apply styled text
   * @param canvas
   * @param text
   * @returns font string
   */
  applyText(canvas: Canvas.Canvas, text: string): string {
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
  async createCanvas(
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
      'Welcome to the server,',
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
      `member #${memberCount}`,
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
  async init(
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
    let channel = guild.channels.cache.get('838575359724224596');

    if (!channel) {
      return Promise.resolve();
    }

    if (
      !((channel): channel is TextChannel => channel.type === 'text')(channel)
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

    return channel.send(`Welcome to the server, ${member}!`, attachment);
  }
}
