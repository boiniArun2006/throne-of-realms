// ============================================================
// THRONE OF REALMS — Asset Manifest
// Maps all real downloaded assets to game keys
// ============================================================

export const ASSET_KEYS = {
  // --- Player (Martial Hero 1 by LuizMelo - CC0) ---
  PLAYER_IDLE: 'player_idle',
  PLAYER_RUN: 'player_run',
  PLAYER_JUMP: 'player_jump',
  PLAYER_FALL: 'player_fall',
  PLAYER_ATTACK1: 'player_attack1',
  PLAYER_ATTACK2: 'player_attack2',
  PLAYER_HURT: 'player_hurt',
  PLAYER_DEATH: 'player_death',

  // --- Enemies (Kenney Platformer + Dungeon Crawl) ---
  ENEMY_SLIME: 'enemy_slime',
  ENEMY_FLY: 'enemy_fly',
  ENEMY_SKELETON: 'enemy_skeleton',
  ENEMY_DEMON: 'enemy_demon',
  ENEMY_BOSS: 'enemy_boss',
  ENEMY_SPRITESHEET: 'enemies_spritesheet',

  // --- Tilesets ---
  TILESET_HUB: 'tileset_hub',           // Kenney Platformer Deluxe
  TILESET_DUNGEON: 'tileset_dungeon',    // 0x72 DungeonTileset II
  TILESET_DUNGEON_ALT: 'tileset_dungeon_alt', // DungeonCrawl
  TILESET_SIMPLIFIED: 'tileset_simplified',    // Kenney Simplified

  // --- Backgrounds ---
  BG_HUB_SKY: 'bg_hub_sky',
  BG_HUB_CASTLE: 'bg_hub_castle',
  BG_DUNGEON_BASE: 'bg_dungeon_base',

  // --- UI ---
  UI_BUTTON: 'ui_button',
  UI_PANEL: 'ui_panel',
  UI_HEART: 'ui_heart',
  UI_HEART_EMPTY: 'ui_heart_empty',

  // --- Portals ---
  PORTAL_BATHROOM: 'portal_bathroom',
  PORTAL_EXIT: 'portal_exit',

  // --- Audio ---
  SFX_ATTACK: 'sfx_attack',
  SFX_HIT: 'sfx_hit',
  SFX_HURT: 'sfx_hurt',
  SFX_JUMP: 'sfx_jump',
  SFX_COIN: 'sfx_coin',
  SFX_CLICK: 'sfx_click',
  SFX_DEATH: 'sfx_death',
  SFX_PORTAL: 'sfx_portal',
  SFX_STEP: 'sfx_step',
  SFX_SLIME: 'sfx_slime',
  BGM_HUB: 'bgm_hub',
  BGM_DUNGEON: 'bgm_dungeon',
  BGM_MENU: 'bgm_menu',
} as const;

// --- Sprite Sheet Frame Data ---
// Martial Hero 1: each frame is 200px tall, varying widths
// Frames are laid out horizontally in sprite strips
export const SPRITE_FRAMES = {
  player_idle: { frameWidth: 200, frameHeight: 200, frames: 8 },
  player_run: { frameWidth: 200, frameHeight: 200, frames: 8 },
  player_jump: { frameWidth: 200, frameHeight: 200, frames: 4 },
  player_fall: { frameWidth: 200, frameHeight: 200, frames: 4 },
  player_attack1: { frameWidth: 200, frameHeight: 200, frames: 6 },
  player_attack2: { frameWidth: 200, frameHeight: 200, frames: 6 },
  player_hurt: { frameWidth: 200, frameHeight: 200, frames: 4 },
  player_death: { frameWidth: 200, frameHeight: 200, frames: 6 },
} as const;

// Kenney enemies spritesheet frame data
export const ENEMY_FRAMES = {
  slime: { frameWidth: 64, frameHeight: 64, frames: 3 },
  fly: { frameWidth: 64, frameHeight: 64, frames: 3 },
  fish: { frameWidth: 64, frameHeight: 64, frames: 3 },
} as const;

// --- Animation definitions ---
export const ANIMATIONS = {
  player_idle: {
    key: 'player_idle_anim',
    frames: { key: ASSET_KEYS.PLAYER_IDLE, start: 0, end: 7 },
    frameRate: 8,
    repeat: -1,
  },
  player_run: {
    key: 'player_run_anim',
    frames: { key: ASSET_KEYS.PLAYER_RUN, start: 0, end: 7 },
    frameRate: 12,
    repeat: -1,
  },
  player_jump: {
    key: 'player_jump_anim',
    frames: { key: ASSET_KEYS.PLAYER_JUMP, start: 0, end: 3 },
    frameRate: 8,
    repeat: 0,
  },
  player_fall: {
    key: 'player_fall_anim',
    frames: { key: ASSET_KEYS.PLAYER_FALL, start: 0, end: 3 },
    frameRate: 8,
    repeat: 0,
  },
  player_attack1: {
    key: 'player_attack1_anim',
    frames: { key: ASSET_KEYS.PLAYER_ATTACK1, start: 0, end: 5 },
    frameRate: 14,
    repeat: 0,
  },
  player_attack2: {
    key: 'player_attack2_anim',
    frames: { key: ASSET_KEYS.PLAYER_ATTACK2, start: 0, end: 5 },
    frameRate: 14,
    repeat: 0,
  },
  player_hurt: {
    key: 'player_hurt_anim',
    frames: { key: ASSET_KEYS.PLAYER_HURT, start: 0, end: 3 },
    frameRate: 10,
    repeat: 0,
  },
  player_death: {
    key: 'player_death_anim',
    frames: { key: ASSET_KEYS.PLAYER_DEATH, start: 0, end: 5 },
    frameRate: 8,
    repeat: 0,
  },
} as const;
