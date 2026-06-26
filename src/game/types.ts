// ============================================================
// THRONE OF REALMS — Core Type Definitions
// ============================================================

/** Cardinal direction for facing */
export type Direction = 'left' | 'right' | 'up' | 'down';

/** Player animation states */
export type PlayerState = 'idle' | 'walk' | 'attack' | 'hurt' | 'die' | 'transform';

/** Enemy types */
export type EnemyType = 'slime' | 'skeleton' | 'demon' | 'yokai' | 'boss';

/** Dungeon realm themes mixing Indian + Japanese mythology */
export type DungeonRealm =
  | 'agni_furnace'      // Hindu fire god
  | 'susanoo_storm'     // Japanese storm god
  | 'yama_underworld'   // Hindu death god
  | 'amaterasu_light'   // Japanese sun goddess
  | 'shiva_tandava'     // Hindu destroyer
  | 'tsukuyomi_eclipse'; // Japanese moon god

/** Weapon tiers earned from each dungeon */
export interface DivineWeapon {
  id: string;
  name: string;
  realm: DungeonRealm;
  description: string;
  damage: number;
  range: number;
  speed: number;
  specialAbility: string;
  color: number; // hex color for visual
}

/** Character definition */
export interface Character {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  spriteKey: string;
}

/** Enemy spawn config for dungeons */
export interface EnemySpawn {
  type: EnemyType;
  count: number;
  spawnPoints: { x: number; y: number }[];
}

/** Dungeon configuration */
export interface DungeonConfig {
  realm: DungeonRealm;
  name: string;
  subtitle: string;
  bgColors: { top: number; bottom: number };
  tileColors: { ground: number; platform: number; accent: number; decoration: number };
  enemySpawns: EnemySpawn[];
  bossType: EnemyType;
  bossName: string;
  reward: DivineWeapon;
  width: number;
  height: number;
  requiredDungeon: DungeonRealm | null; // null = first dungeon
}

/** Dialogue entry */
export interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'angry' | 'sad' | 'mysterious' | 'comedy';
  portraitFrame?: number;
}

/** Dialogue sequence */
export interface DialogueSequence {
  id: string;
  trigger: string; // event that triggers this dialogue
  lines: DialogueLine[];
  onComplete?: string; // event to fire when dialogue ends
}

/** Game save state */
export interface GameSaveState {
  currentScene: string;
  playerHp: number;
  playerMaxHp: number;
  playerX: number;
  playerY: number;
  completedDungeons: DungeonRealm[];
  currentWeapon: string;
  unlockedWeapons: string[];
  dialogueFlags: Record<string, boolean>;
  dungeonAttempt: number; // how many times entered dungeon (for story progression)
}

/** Particle effect config */
export interface ParticleConfig {
  key: string;
  color: number;
  count: number;
  speed: { min: number; max: number };
  lifespan: number;
  scale: { start: number; end: number };
  alpha: { start: number; end: number };
}

/** Scene transition data passed between scenes */
export interface SceneTransitionData {
  from: string;
  to: string;
  dungeonRealm?: DungeonRealm;
  portalType?: 'bathroom' | 'divine';
  returning?: boolean;
}
