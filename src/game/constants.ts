// ============================================================
// THRONE OF REALMS — Game Constants
// ============================================================

// --- Game Dimensions ---
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const TILE_SIZE = 32;
export const PIXEL_SCALE = 2;

// --- Physics ---
export const GRAVITY = 800;
export const PLAYER_SPEED = 180;
export const PLAYER_JUMP_FORCE = -420;
export const PLAYER_ATTACK_RANGE = 50;
export const PLAYER_ATTACK_DURATION = 300; // ms
export const PLAYER_HURT_DURATION = 500; // ms
export const PLAYER_INVINCIBLE_DURATION = 1000; // ms

// --- Combat ---
export const PLAYER_BASE_ATTACK = 15;
export const PLAYER_BASE_DEFENSE = 5;
export const PLAYER_BASE_HP = 100;
export const ENEMY_KNOCKBACK = 200;
export const PLAYER_KNOCKBACK = 150;

// --- Colors (hex numbers for Phaser) ---
export const COLORS = {
  // Player colors
  veerBody: 0xe8a87c,       // warm skin tone
  veerHair: 0x2c1810,       // dark brown hair
  veerPants: 0x4a6fa5,      // blue pants
  veerShirt: 0xf5f0e1,      // white/off-white shirt
  veerTransformed: 0xffd700, // golden glow when transformed
  veerEyes: 0x1a1a2e,       // dark eyes

  // UI colors
  healthBar: 0xe74c3c,
  healthBarBg: 0x2c3e50,
  healthBarStroke: 0xecf0f1,
  manaBar: 0x3498db,
  xpBar: 0x2ecc71,
  uiGold: 0xf1c40f,

  // Hub world (Indian-Japanese mix)
  hubGround: 0xd4a76a,       // sandy/earthy ground
  hubGrass: 0x6b8e23,        // olive green
  hubWater: 0x4682b4,        // steel blue water
  hubWood: 0x8b6914,         // wooden structures
  hubStone: 0x808080,        // stone temples
  hubRoofRed: 0xc0392b,      // Japanese red roof
  hubRoofGold: 0xf39c12,     // Indian gold dome
  hubTreeLeaves: 0x228b22,   // tree canopy
  hubTreeTrunk: 0x654321,    // tree trunk
  hubSky: 0x87ceeb,          // sky blue
  hubBathroom: 0xb0c4de,     // bathroom building
  hubBathroomDoor: 0x8b4513, // bathroom door

  // Dungeon colors
  agniGround: 0x8b0000,     // dark red
  agniWall: 0x4a0000,       // darker red
  agniLava: 0xff4500,       // orange-red lava
  agniAccent: 0xffd700,     // gold trim

  susanooGround: 0x2f4f4f,  // dark slate
  susanooWall: 0x1a3a3a,    // darker slate
  susanooWater: 0x00ced1,   // dark turquoise
  susanooAccent: 0x87ceeb,  // light blue

  yamaGround: 0x1a1a2e,     // near black
  yamaWall: 0x0f0f1a,       // darker
  yamaSoul: 0x9370db,       // purple soul fire
  yamaAccent: 0x4a0080,     // deep purple

  amaterasuGround: 0xfff8dc, // cornsilk
  amaterasuWall: 0xffefd5,  // papaya whip
  amaterasuLight: 0xffd700, // golden light
  amaterasuAccent: 0xff8c00, // dark orange

  shivaGround: 0x363636,    // dark gray
  shivaWall: 0x1e1e1e,      // darker
  shivaFire: 0xff6347,      // destruction fire
  shivaAccent: 0x00bfff,    // blue (Nataraja)

  tsukuyomiGround: 0x191970, // midnight blue
  tsukuyomiWall: 0x0c0c3c,  // darker
  tsukuyomiMoon: 0xc0c0c0,  // silver
  tsukuyomiAccent: 0x9400d3, // violet

  // Enemy colors
  slimeBody: 0x50c878,
  skeletonBody: 0xf5f5dc,
  demonBody: 0xdc143c,
  yokaiBody: 0x9932cc,
  bossAura: 0xff0000,

  // NPC colors
  hanaDress: 0xffb7c5,       // cherry blossom pink
  hanaHair: 0x1a1a1a,        // black hair
  nirvaniRobe: 0x9370db,     // purple robe
  nirvaniHair: 0xc0c0c0,     // silver hair

  // Portal
  portalBlue: 0x00bfff,
  portalPurple: 0x8a2be2,
  portalGlow: 0xe0b0ff,
} as const;

// --- Animation timing ---
export const ANIM = {
  playerIdleFrameRate: 6,
  playerWalkFrameRate: 10,
  playerAttackFrameRate: 14,
  playerHurtFrameRate: 8,
  enemyIdleFrameRate: 4,
  enemyWalkFrameRate: 8,
  enemyAttackFrameRate: 10,
  portalPulseRate: 3,
} as const;

// --- Scene keys ---
export const SCENES = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  HUB: 'HubWorldScene',
  BATHROOM: 'BathroomScene',
  DUNGEON: 'DungeonScene',
  HUD: 'HUDScene',
  DIALOGUE: 'DialogueScene',
} as const;

// --- Character names ---
export const CHARACTERS = {
  HERO: 'Veer',
  LOVE_INTEREST: 'Hana',
  SPIRIT_MOTHER: 'Nirvani',
  WORLD: 'Avani',
} as const;

// --- Game title ---
export const GAME_TITLE = 'Throne of Realms';
export const GAME_SUBTITLE = 'The Unlikely Hero';
