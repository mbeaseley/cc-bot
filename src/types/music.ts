import { VoiceState } from 'discord.js';

export type VoiceStateTypes = 'leave' | 'join' | 'move';

/**
 * Get Voice state both on channel
 */
export const getVoiceState = (
  oldState: VoiceState,
  newState: VoiceState
): VoiceStateTypes => {
  if (!oldState.channelID) {
    return 'join';
  } else if (!newState.channelID) {
    return 'leave';
  } else {
    return 'move';
  }
};
