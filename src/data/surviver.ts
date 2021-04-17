import { SurvivorAddon, SurvivorLoot, SurvivorOffering } from '../types/dbd';

export const surviverPerks: string[] = [
  'Ace in the Hole',
  'Adrenaline',
  'Aftercare',
  'Alert',
  'Any Means Necessary',
  'Appraisal',
  'Autodidact',
  'Babysitter',
  'Balanced Landing',
  'Better Together',
  'Blood Pact',
  'Boil Over',
  'Bond',
  'Borrowed Time',
  'Botany Knowledge',
  'Breakdown',
  'Breakout',
  'Buckle Up',
  'Built to Last',
  'Calm Spirit',
  'Camaraderie',
  'Dance With Me',
  'Dark Sense',
  'Dead Hard',
  'Deception',
  'Decisive Strike',
  'Deja Vu',
  'Deliverance',
  'Desperate Measures',
  `Detective's Hunch`,
  'Distortion',
  'Diversion',
  'Empathy',
  'Fast Track',
  'Fixated',
  'Flip-Flop',
  'For The People',
  'Head On',
  'Hope',
  'Inner Strength',
  'Iron Will',
  'Kindred',
  'Leader',
  'Left Behind',
  'Lightweight',
  'Lithe',
  'Lucky Break',
  'Mettle Of Man',
  'No Mither',
  'No One Left Behind',
  'Object Of Obsession',
  'Off The Record',
  'Open-Handed',
  'Pharmacy',
  `Plunderer's Instinct`,
  'Poised',
  'Power Struggle',
  'Premonition',
  'Prove Thyself',
  'Quick & Quiet',
  'Red Herring',
  'Repressed Alliance',
  'Resilience',
  'Saboteur',
  'Second Wind',
  'Self-Care',
  'Self-Preservation',
  'Slippery Meat',
  'Small Game',
  'Smash Hit',
  'Sole Survivor',
  'Solidarity',
  'Soul Guard',
  'Spine Chill',
  'Sprint Burst',
  'Stake Out',
  'Streetwise',
  'Technician',
  'Tenacity',
  'This Is Not Happening',
  'Unbreakable',
  'Up the Ante',
  'Urban Evasion',
  'Vigil',
  'Visionary',
  'Wake Up!',
  `We'll Make It`,
  `We're Gonna Live Forever`,
  'Windows Of Opportunity',
];

/**
 * Associated on wiki but not used within the game
 */
// const FireCracker: SurvivorAddon[] = [
//   {
//     name: 'Buckshot',
//     rarity: 'Common',
//   },
//   {
//     name: 'Medium Fuse',
//     rarity: 'Common',
//   },
//   {
//     name: 'Flash Powder',
//     rarity: 'Common',
//   },
//   {
//     name: 'Gun Powder',
//     rarity: 'Uncommon',
//   },
//   {
//     name: 'Long Fuse',
//     rarity: 'Uncommon',
//   },
//   {
//     name: 'Magnesium Powder',
//     rarity: 'Uncommon',
//   },
//   {
//     name: 'Black Powder',
//     rarity: 'Rare',
//   },
//   {
//     name: 'Large Pack',
//     rarity: 'Ultra Rare',
//   },
// ];

const Flashlight: SurvivorAddon[] = [
  {
    name: 'Wide Lens',
    rarity: 'Common',
  },
  {
    name: 'Power Bulb',
    rarity: 'Common',
  },
  {
    name: 'Leather Grip',
    rarity: 'Common',
  },
  {
    name: 'Battery',
    rarity: 'Common',
  },
  {
    name: 'TIR Optic',
    rarity: 'Uncommon',
  },
  {
    name: 'Rubber Grip',
    rarity: 'Uncommon',
  },
  {
    name: 'Low Amp Filament',
    rarity: 'Uncommon',
  },
  {
    name: 'Heavy Duty Battery',
    rarity: 'Uncommon',
  },
  {
    name: 'Focus Lens',
    rarity: 'Uncommon',
  },
  {
    name: 'Long Life Battery',
    rarity: 'Rare',
  },
  {
    name: 'Intense Halogen',
    rarity: 'Rare',
  },
  {
    name: 'High-End Sapphire',
    rarity: 'Very Rare',
  },
  {
    name: 'Odd Bulb',
    rarity: 'Ultra Bulb',
  },
  {
    name: 'Broken bulb',
    rarity: 'Event',
  },
];

const key: SurvivorAddon[] = [
  {
    name: 'Prayor Rope',
    rarity: 'Common',
  },
  {
    name: 'Scratched Pearl',
    rarity: 'Uncommon',
  },
  {
    name: 'Prayor Beads',
    rarity: 'Uncommon',
  },
  {
    name: 'Eroded Token',
    rarity: 'Uncommon',
  },
  {
    name: 'Goid Token',
    rarity: 'Rare',
  },
  {
    name: 'Weaved Ring',
    rarity: 'Very Rare',
  },
  {
    name: 'Milky Glass',
    rarity: 'Very Rare',
  },
  {
    name: 'Blood Amber',
    rarity: 'Very Rare',
  },
  {
    name: 'Unique Wedding Ring',
    rarity: 'Very Rare',
  },
];

const map: SurvivorAddon[] = [
  {
    name: 'Map Addendum',
    rarity: 'Common',
  },
  {
    name: 'Yellow Wire',
    rarity: 'Uncommon',
  },
  {
    name: 'Unusual Stamp',
    rarity: 'Uncommon',
  },
  {
    name: 'Retardant Jelly',
    rarity: 'Uncommon',
  },
  {
    name: 'Red Twine',
    rarity: 'Uncommon',
  },
  {
    name: 'Glass Bead',
    rarity: 'Uncommon',
  },
  {
    name: 'Odd Stamp',
    rarity: 'Rare',
  },
  {
    name: 'Black Silk Cord',
    rarity: 'Rare',
  },
  {
    name: 'Crystal Bead',
    rarity: 'Very Rare',
  },
];

const medKit: SurvivorAddon[] = [
  {
    name: 'Rubber Gloves',
    rarity: 'Common',
  },
  {
    name: 'Butterfly Tape',
    rarity: 'Common',
  },
  {
    name: 'Bandages',
    rarity: 'Common',
  },
  {
    name: 'Sponge',
    rarity: 'Uncommon',
  },
  {
    name: 'Self Adherent Wrap',
    rarity: 'Uncommon',
  },
  {
    name: 'Needle & Thread',
    rarity: 'Uncommon',
  },
  {
    name: 'Medical Scissors',
    rarity: 'Uncommon',
  },
  {
    name: 'Gauze Roll',
    rarity: 'Uncommon',
  },
  {
    name: 'Surgical Suture',
    rarity: 'Rare',
  },
  {
    name: 'Gel Dressings',
    rarity: 'Rare',
  },
  {
    name: 'Abdominal Dressing',
    rarity: 'Rare',
  },
  {
    name: 'Styptic Agent',
    rarity: 'Very Rare',
  },
  {
    name: 'Anti-Hemorrhagic Syringe',
    rarity: 'Ultra Rare',
  },
  {
    name: 'Refined Serum',
    rarity: 'Event',
  },
];

const toolbox: SurvivorAddon[] = [
  {
    name: 'Scraps',
    rarity: 'Common',
  },
  {
    name: 'Instructions',
    rarity: 'Common',
  },
  {
    name: 'Clean Rag',
    rarity: 'Common',
  },
  {
    name: 'Wire Spool',
    rarity: 'Uncommon',
  },
  {
    name: 'Spring Clamp',
    rarity: 'Uncommon',
  },
  {
    name: 'Socket Swivels',
    rarity: 'Uncommon',
  },
  {
    name: 'Protective Gloves',
    rarity: 'Uncommon',
  },
  {
    name: 'Cutting Wire',
    rarity: 'Uncommon',
  },
  {
    name: 'Hacksaw',
    rarity: 'Rare',
  },
  {
    name: 'Grip Wrench',
    rarity: 'Rare',
  },
  {
    name: 'Brand New Part',
    rarity: 'Ultra Rare',
  },
];

export const surviverLoot: SurvivorLoot[] = [
  {
    name: 'Chinese FireCracker',
    rarity: 'Event',
    addons: [],
  },
  {
    name: 'Winter Party Starter',
    rarity: 'Event',
    addons: [],
  },
  {
    name: 'Third Yeard Party Starter',
    rarity: 'Event',
    addons: [],
  },
  {
    name: 'Flashlight',
    rarity: 'Uncommon',
    addons: [...Flashlight],
  },
  {
    name: 'Sport Flashlight',
    rarity: 'Rare',
    addons: [...Flashlight],
  },
  {
    name: 'Utility Flashlight',
    rarity: 'Very Rare',
    addons: [...Flashlight],
  },
  {
    name: 'Will o Wisp',
    rarity: 'Event',
    addons: [...Flashlight],
  },
  {
    name: 'Anniversary Flashlight',
    rarity: 'Event',
    addons: [...Flashlight],
  },
  {
    name: 'Broken Key',
    rarity: 'Rare',
    addons: [...key],
  },
  {
    name: 'Dull Key',
    rarity: 'Very Rare',
    addons: [...key],
  },
  {
    name: 'Skeleton Key',
    rarity: 'Ultra Rare',
    addons: [...key],
  },
  {
    name: 'Map',
    rarity: 'Rare',
    addons: [...map],
  },
  {
    name: 'Rainbow Map',
    rarity: 'Ultra Rare',
    addons: [...map],
  },
  {
    name: 'Camping Aid Kit',
    rarity: 'Common',
    addons: [...medKit],
  },
  {
    name: 'First Aid Kit',
    rarity: 'Uncommon',
    addons: [...medKit],
  },
  {
    name: 'Emergency Med-Kit',
    rarity: 'Rare',
    addons: [...medKit],
  },
  {
    name: 'Ranger Med-Kit',
    rarity: 'Very Rare',
    addons: [...medKit],
  },
  {
    name: 'All Hallows` Eve Lunchbox',
    rarity: 'Event',
    addons: [...medKit],
  },
  {
    name: 'Anniversary Med-Kit',
    rarity: 'Event',
    addons: [...medKit],
  },
  {
    name: 'Worn-Out Tools',
    rarity: 'Common',
    addons: [...toolbox],
  },
  {
    name: 'Toolbox',
    rarity: 'Uncommon',
    addons: [...toolbox],
  },
  {
    name: `Mechanic's Toolbox`,
    rarity: 'Rare',
    addons: [...toolbox],
  },
  {
    name: 'Commodious Toolbox',
    rarity: 'Rare',
    addons: [...toolbox],
  },
  {
    name: `Engineer's Toolbox`,
    rarity: 'Very Rare',
    addons: [...toolbox],
  },
  {
    name: `Alex's Toolbox`,
    rarity: 'Very Rare',
    addons: [...toolbox],
  },
  {
    name: 'Festive Toolbox',
    rarity: 'Event',
    addons: [...toolbox],
  },
];

export const surviverOffering: SurvivorOffering[] = [
  {
    name: 'Murky Reagent',
    rarity: 'Very Rare',
  },
  {
    name: 'Petrified Oak',
    rarity: 'Very Rare',
  },
  {
    name: 'Shiny Coin',
    rarity: 'Very Rare',
  },
  {
    name: 'Shroud of Binding',
    rarity: 'Very Rare',
  },
  {
    name: `Vigo's Jar Of Salty Lips`,
    rarity: 'Very Rare',
  },
  {
    name: `White Ward`,
    rarity: 'Very Rare',
  },
  {
    name: `Azarov's Key`,
    rarity: 'Rare',
  },
  {
    name: `Black Salt Statuette`,
    rarity: 'Rare',
  },
  {
    name: `Charred Wedding Photograph`,
    rarity: 'Rare',
  },
  {
    name: `Damaged Photo`,
    rarity: 'Rare',
  },
  {
    name: `Dusty Noose`,
    rarity: 'Rare',
  },
  {
    name: `Grandma's Cookbook`,
    rarity: 'Rare',
  },
  {
    name: `hawkins National Laboratory I.D.`,
    rarity: 'Rare',
  },
  {
    name: `Heart Locket`,
    rarity: 'Rare',
  },
  {
    name: `Ivony Chalk Pouch`,
    rarity: 'Rare',
  },
  {
    name: `Jigsaw Piece`,
    rarity: 'Rare',
  },
  {
    name: `Macmillan's Phalanx Bone`,
    rarity: 'Rare',
  },
  {
    name: `Mary's Letter`,
    rarity: 'Rare',
  },
  {
    name: `Sacrificial Ward`,
    rarity: 'Rare',
  },
  {
    name: `Shattered Glasses`,
    rarity: 'Rare',
  },
  {
    name: `Strode Realty`,
    rarity: 'Rare',
  },
  {
    name: `The Last Mask`,
    rarity: 'Rare',
  },
  {
    name: `The Pied Piper`,
    rarity: 'Rare',
  },
  {
    name: `Yamaoka Family Crest`,
    rarity: 'Rare',
  },
  {
    name: `Cream Chalk Pouch`,
    rarity: 'Uncommon',
  },
  {
    name: `Hazy Reagent`,
    rarity: 'Uncommon',
  },
  {
    name: `Salt Pouch`,
    rarity: 'Uncommon',
  },
  {
    name: `Shroud Of Union`,
    rarity: 'Uncommon',
  },
  {
    name: `Tarnished Coin`,
    rarity: 'Uncommon',
  },
  {
    name: `Vigo's Shroud`,
    rarity: 'Uncommon',
  },
  {
    name: 'Annotated Blueprint',
    rarity: 'Common',
  },
  {
    name: 'Bloodied Blueprint',
    rarity: 'Common',
  },
  {
    name: 'Chalk Pouch',
    rarity: 'Common',
  },
  {
    name: 'Clear Reagent',
    rarity: 'Common',
  },
  {
    name: 'Faint Feagent',
    rarity: 'Common',
  },
  {
    name: 'Torn Blueprint',
    rarity: 'Common',
  },
  {
    name: `Vigo's Blueprint`,
    rarity: 'Common',
  },
];
