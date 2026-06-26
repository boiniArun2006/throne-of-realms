// ============================================================
// THRONE OF REALMS — Dungeon Configurations
// Each dungeon is a realm from Indian or Japanese mythology
// ============================================================

import { DungeonConfig, DungeonRealm } from '../types';
import { COLORS, TILE_SIZE } from '../constants';

export const DUNGEON_CONFIGS: Record<DungeonRealm, DungeonConfig> = {
  agni_furnace: {
    realm: 'agni_furnace',
    name: "Agni's Furnace",
    subtitle: 'Realm of the Fire God',
    bgColors: { top: 0x1a0000, bottom: 0x4a0000 },
    tileColors: {
      ground: COLORS.agniGround,
      platform: COLORS.agniWall,
      accent: COLORS.agniLava,
      decoration: COLORS.agniAccent,
    },
    enemySpawns: [
      { type: 'slime', count: 4, spawnPoints: [{ x: 300, y: 400 }, { x: 500, y: 400 }, { x: 700, y: 400 }, { x: 900, y: 400 }] },
      { type: 'demon', count: 2, spawnPoints: [{ x: 600, y: 300 }, { x: 1000, y: 300 }] },
    ],
    bossType: 'boss',
    bossName: 'Agni Asura',
    reward: {
      id: 'agni_chakra',
      name: 'Chakra of Agni',
      realm: 'agni_furnace',
      description: 'A blazing disc that burns through enemy defenses. Sacred fire weapon of the Hindu fire god.',
      damage: 25,
      range: 80,
      speed: 1.2,
      specialAbility: 'Fire Spin — AoE burn around player',
      color: COLORS.agniLava,
    },
    width: 1600,
    height: 540,
    requiredDungeon: null, // First dungeon
  },

  susanoo_storm: {
    realm: 'susanoo_storm',
    name: "Susanoo's Storm",
    subtitle: 'Tempest of the Sea God',
    bgColors: { top: 0x0a1a2a, bottom: 0x1a3a3a },
    tileColors: {
      ground: COLORS.susanooGround,
      platform: COLORS.susanooWall,
      accent: COLORS.susanooWater,
      decoration: COLORS.susanooAccent,
    },
    enemySpawns: [
      { type: 'yokai', count: 3, spawnPoints: [{ x: 400, y: 400 }, { x: 700, y: 350 }, { x: 1000, y: 400 }] },
      { type: 'skeleton', count: 3, spawnPoints: [{ x: 500, y: 400 }, { x: 800, y: 300 }, { x: 1100, y: 400 }] },
    ],
    bossType: 'boss',
    bossName: 'Orochi Spawn',
    reward: {
      id: 'susanoo_totsuka',
      name: "Totsuka-no-Tsurugi",
      realm: 'susanoo_storm',
      description: 'The divine sword pulled from Orochi\'s tail. Cuts through storms and enemies alike.',
      damage: 30,
      range: 90,
      speed: 1.0,
      specialAbility: 'Storm Slash — Projectile slash wave',
      color: COLORS.susanooAccent,
    },
    width: 1800,
    height: 540,
    requiredDungeon: 'agni_furnace',
  },

  yama_underworld: {
    realm: 'yama_underworld',
    name: "Yama's Underworld",
    subtitle: 'Court of the Death God',
    bgColors: { top: 0x0a0a1e, bottom: 0x1a1a2e },
    tileColors: {
      ground: COLORS.yamaGround,
      platform: COLORS.yamaWall,
      accent: COLORS.yamaSoul,
      decoration: COLORS.yamaAccent,
    },
    enemySpawns: [
      { type: 'skeleton', count: 5, spawnPoints: [{ x: 300, y: 400 }, { x: 500, y: 400 }, { x: 700, y: 300 }, { x: 900, y: 400 }, { x: 1100, y: 350 }] },
      { type: 'demon', count: 2, spawnPoints: [{ x: 800, y: 300 }, { x: 1200, y: 300 }] },
    ],
    bossType: 'boss',
    bossName: 'Yama Dharmaraja',
    reward: {
      id: 'yama_danda',
      name: "Danda of Yama",
      realm: 'yama_underworld',
      description: 'The cosmic staff that judges the dead. Drains enemy life force on hit.',
      damage: 28,
      range: 70,
      speed: 0.8,
      specialAbility: 'Soul Drain — Heal on hit',
      color: COLORS.yamaSoul,
    },
    width: 2000,
    height: 540,
    requiredDungeon: 'susanoo_storm',
  },

  amaterasu_light: {
    realm: 'amaterasu_light',
    name: "Amaterasu's Light",
    subtitle: 'Shrine of the Sun Goddess',
    bgColors: { top: 0xfff8e7, bottom: 0xffefd5 },
    tileColors: {
      ground: COLORS.amaterasuGround,
      platform: COLORS.amaterasuWall,
      accent: COLORS.amaterasuLight,
      decoration: COLORS.amaterasuAccent,
    },
    enemySpawns: [
      { type: 'yokai', count: 4, spawnPoints: [{ x: 350, y: 400 }, { x: 600, y: 350 }, { x: 850, y: 400 }, { x: 1100, y: 350 }] },
      { type: 'demon', count: 3, spawnPoints: [{ x: 500, y: 300 }, { x: 900, y: 300 }, { x: 1300, y: 350 }] },
    ],
    bossType: 'boss',
    bossName: 'Yata-no-Kami',
    reward: {
      id: 'amaterasu_mirror',
      name: "Yata-no-Kagami",
      realm: 'amaterasu_light',
      description: 'The sacred mirror that reveals truth. Reflects projectiles and blinds enemies.',
      damage: 20,
      range: 120,
      speed: 1.5,
      specialAbility: 'Divine Reflect — Block and return projectiles',
      color: COLORS.amaterasuLight,
    },
    width: 1800,
    height: 540,
    requiredDungeon: 'yama_underworld',
  },

  shiva_tandava: {
    realm: 'shiva_tandava',
    name: "Shiva's Tandava",
    subtitle: 'Dance of Destruction',
    bgColors: { top: 0x0e0e0e, bottom: 0x1e1e1e },
    tileColors: {
      ground: COLORS.shivaGround,
      platform: COLORS.shivaWall,
      accent: COLORS.shivaFire,
      decoration: COLORS.shivaAccent,
    },
    enemySpawns: [
      { type: 'demon', count: 5, spawnPoints: [{ x: 300, y: 400 }, { x: 500, y: 350 }, { x: 700, y: 400 }, { x: 1000, y: 350 }, { x: 1300, y: 400 }] },
      { type: 'yokai', count: 2, spawnPoints: [{ x: 800, y: 300 }, { x: 1200, y: 300 }] },
    ],
    bossType: 'boss',
    bossName: 'Nataraja Shadow',
    reward: {
      id: 'shiva_trishula',
      name: "Trishula of Shiva",
      realm: 'shiva_tandava',
      description: 'The three-pronged spear that destroys, creates, and preserves. The ultimate weapon.',
      damage: 40,
      range: 100,
      speed: 0.9,
      specialAbility: 'Tandava Burst — Screen-clearing destruction wave',
      color: COLORS.shivaAccent,
    },
    width: 2200,
    height: 540,
    requiredDungeon: 'amaterasu_light',
  },

  tsukuyomi_eclipse: {
    realm: 'tsukuyomi_eclipse',
    name: "Tsukuyomi's Eclipse",
    subtitle: 'The Final Dark',
    bgColors: { top: 0x0a0a2e, bottom: 0x191970 },
    tileColors: {
      ground: COLORS.tsukuyomiGround,
      platform: COLORS.tsukuyomiWall,
      accent: COLORS.tsukuyomiMoon,
      decoration: COLORS.tsukuyomiAccent,
    },
    enemySpawns: [
      { type: 'demon', count: 4, spawnPoints: [{ x: 400, y: 400 }, { x: 700, y: 350 }, { x: 1000, y: 400 }, { x: 1300, y: 350 }] },
      { type: 'yokai', count: 3, spawnPoints: [{ x: 500, y: 300 }, { x: 900, y: 300 }, { x: 1400, y: 350 }] },
      { type: 'skeleton', count: 3, spawnPoints: [{ x: 600, y: 400 }, { x: 1100, y: 400 }, { x: 1500, y: 400 }] },
    ],
    bossType: 'boss',
    bossName: 'Eclipse Kami',
    reward: {
      id: 'tsukuyomi_magatama',
      name: "Magatama of Tsukuyomi",
      realm: 'tsukuyomi_eclipse',
      description: 'The crescent jewel that commands the tides of darkness. Warps space around the wielder.',
      damage: 35,
      range: 110,
      speed: 1.3,
      specialAbility: 'Eclipse Warp — Short-range teleport + strike',
      color: COLORS.tsukuyomiAccent,
    },
    width: 2400,
    height: 540,
    requiredDungeon: 'shiva_tandava',
  },
};

/** Get the next dungeon the player should tackle */
export function getNextDungeon(completed: DungeonRealm[]): DungeonRealm | null {
  const order: DungeonRealm[] = [
    'agni_furnace',
    'susanoo_storm',
    'yama_underworld',
    'amaterasu_light',
    'shiva_tandava',
    'tsukuyomi_eclipse',
  ];
  for (const realm of order) {
    if (!completed.includes(realm)) return realm;
  }
  return null; // All dungeons completed
}
