class PlayerKiller {
  userId: string | undefined;
  availableKiller: number[] = [];
}

export const defaultKillers: number[] = [1, 2, 3, 4, 7, 8];

export const playerKillers: PlayerKiller[] = [
  // CC
  {
    userId: '221073387177508864',
    availableKiller: [
      ...defaultKillers,
      5,
      6,
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
  // KieKie
  {
    userId: '147110059799871490',
    availableKiller: [
      ...defaultKillers,
      5,
      6,
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
    availableKiller: [...defaultKillers, 6, 11, 12, 15, 16, 20, 22, 23],
  },
  // neodragon17
  {
    userId: '805228731383677008',
    availableKiller: [...defaultKillers, 23],
  },
  // nSev
  {
    userId: '476976771984523268',
    availableKiller: [
      ...defaultKillers,
      5,
      6,
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
  // Johnny_Cashira
  {
    userId: '175971639303995392',
    availableKiller: [...defaultKillers, 5, 6, 9, 10, 11, 16, 17, 20],
  },
];
