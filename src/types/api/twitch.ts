export interface ApiTokenResponseObject {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface ApiUserResponseObject {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
  }[];
}

export interface ApiStreamResponseObject {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }[];
}

export interface ApiFollowersResponseObject {
  total: number | undefined;
  data: {
    from_id: string | undefined;
    from_login: string | undefined;
    from_name: string | undefined;
    to_id: string | undefined;
    to_login: string | undefined;
    to_name: string | undefined;
    followed_at: string | undefined;
  }[];
}
