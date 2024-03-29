export interface ApiJokeResponse {
  error: boolean;
  category: string;
  type: string;
  joke?: string | undefined;
  setup?: string | undefined;
  delivery?: string | undefined;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  safe: true;
  lang: string;
}
