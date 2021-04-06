export class KillerBuild {
  killer: string | undefined;
  image: string | undefined;
  addons: string[] | undefined = [];
  offering: string | undefined;
  perks: string[] | undefined = [];
}

export class SurviverBuild {
  perks: string[] | undefined = [];
  loot: string | undefined;
  offering: string | undefined;
}
