/**=============================
  Instagram User Objects
===============================*/

export class InstaUser {
  username: string | undefined;
  biography: string | undefined;
  fullName: string | undefined;
  profileImage: string | undefined;
  posts: number | undefined;
  followers: number | undefined;
  following: number | undefined;
  private: boolean | undefined;
  verified: boolean | undefined;
}

export interface ApiInstaUserResponse {
  graphql: {
    user: {
      biography: string;
      blocked_by_viewer: boolean;
      restricted_by_viewer: boolean;
      country_block: boolean;
      external_url: string;
      external_url_linkshimmed: string;
      edge_followed_by: {
        count: number;
      };
      fbid: string;
      followered_by_viewer: boolean;
      edge_follow: {
        count: number;
      };
      follows_viewer: boolean;
      full_name: string;
      has_ar_effects: boolean;
      has_clips: boolean;
      has_guides: boolean;
      has_channel: boolean;
      has_blocked_viewer: boolean;
      highlight_reel_count: 2;
      has_requested_viewer: boolean;
      hide_like_and_view_counts: boolean;
      id: '7213073124';
      is_business_account: boolean;
      is_professional_account: boolean;
      is_joined_recently: boolean;
      is_private: boolean;
      is_verified: boolean;
      edge_mutual_followed_by: {
        count: number;
        edges: string[];
      };
      profile_pic_url: string;
      profile_pic_url_hd: string;
      requested_by_viewer: boolean;
      should_show_category: boolean;
      should_show_public_contacts: boolean;
      username: string;
      connected_fb_page: string;
      edge_owner_to_timeline_media: {
        count: number;
        page_info: {
          has_next_page: boolean;
          end_cursor: string;
        };
      };
    };
  };
}
