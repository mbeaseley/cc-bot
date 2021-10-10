import dayjs = require('dayjs');

export class Video {
  title: string;
  link: string;
  pubDate: dayjs.Dayjs;
  author: string;
  id: string;
  isoDate: dayjs.Dayjs;

  constructor(
    title: string,
    link: string,
    pubDate: any,
    author: string,
    id: string,
    isoDate: any
  ) {
    this.title = title;
    this.link = link;
    this.pubDate = dayjs(pubDate);
    this.author = author;
    const split = id.split(':');
    this.id = split[split.length - 1];
    this.isoDate = dayjs(isoDate);
  }
}

export class Channel {
  link: string;
  feedUrl: string;
  title: string;
  items: Video[];

  constructor(link: string, feedUrl: string, title: string, items: Video[]) {
    this.link = link;
    this.title = title;
    this.feedUrl = feedUrl;

    this.items = items.map(
      (i) => new Video(i.title, i.link, i.pubDate, i.author, i.id, i.isoDate)
    );
  }
}

export interface YoutubeChannel {
  channelId: string;
}

export interface ChannelRssResponse {
  link: string;
  feedUrl: string;
  title: string;
  items: {
    title: string;
    link: string;
    pubDate: any;
    author: string;
    id: string;
    isoDate: any;
  }[];
}
