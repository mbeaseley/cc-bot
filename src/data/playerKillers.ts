class PlayerKiller {
  userId: string | undefined;
  availableKiller: number[] = [];
}

export const defaultKillers: number[] = [1, 2, 3, 4, 6, 7, 8];

export const playerKillers: PlayerKiller[] = [
  {
    userId: '221073387177508864',
    availableKiller: [
      ...defaultKillers,
      5,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
  },
  {
    userId: '147110059799871490',
    availableKiller: [
      ...defaultKillers,
      5,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
  },
  // PacificViruz
  {
    userId: '246434279331069953',
    availableKiller: [...defaultKillers],
  },
  // neodragon17
  {
    userId: '805228731383677008',
    availableKiller: [...defaultKillers, 7, 23],
  },
  // nSev
  {
    userId: '476976771984523268',
    availableKiller: [
      ...defaultKillers,
      5,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ],
  },
  // Defeated Turkey
  {
    userId: '141311284955185152',
    availableKiller: [...defaultKillers, 7, 10, 12, 17, 18, 19],
  },
];
