// ============================================================
// THRONE OF REALMS — Boot Scene (Real Assets — FIXED PATHS)
// Loads all downloaded sprite sheets, tilesets, audio, and UI
// Uses: Martial Hero (CC0), Kenney (CC0), 0x72 (CC0)
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { ASSET_KEYS, SPRITE_FRAMES, ANIMATIONS } from '../AssetManifest';

export class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add.text(centerX, centerY - 80, 'THRONE OF REALMS', {
      fontSize: '36px', fontFamily: 'monospace', color: '#ffd700',
      stroke: '#8b4513', strokeThickness: 4,
    }).setOrigin(0.5);

    this.loadingBar = this.add.graphics();
    this.loadingText = this.add.text(centerX, centerY, 'Loading assets...', {
      fontSize: '14px', fontFamily: 'monospace', color: '#b0b0b0',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      this.loadingBar.clear();
      this.loadingBar.fillStyle(0x2c3e50, 1);
      this.loadingBar.fillRect(centerX - 152, centerY + 30, 304, 16);
      this.loadingBar.fillStyle(0xffd700, 1);
      this.loadingBar.fillRect(centerX - 150, centerY + 32, value * 300, 12);
      this.loadingText.setText(`Loading assets... ${Math.floor(value * 100)}%`);
    });

    this.load.on('loaderror', (file: any) => {
      console.warn(`[Asset Load Error] key=${file.key} url=${file.url}`);
    });

    // ==========================================
    // PLAYER — Martial Hero 1 by LuizMelo (CC0)
    // Frame size: 200x200 per frame
    // ==========================================
    this.load.spritesheet(ASSET_KEYS.PLAYER_IDLE, 'assets/sprites/characters/martial-hero-1/Idle.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_RUN, 'assets/sprites/characters/martial-hero-1/Run.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_JUMP, 'assets/sprites/characters/martial-hero-1/Jump.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_FALL, 'assets/sprites/characters/martial-hero-1/Fall.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_ATTACK1, 'assets/sprites/characters/martial-hero-1/Attack1.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_ATTACK2, 'assets/sprites/characters/martial-hero-1/Attack2.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_HURT, 'assets/sprites/characters/martial-hero-1/Take Hit.png', {
      frameWidth: 200, frameHeight: 200,
    });
    this.load.spritesheet(ASSET_KEYS.PLAYER_DEATH, 'assets/sprites/characters/martial-hero-1/Death.png', {
      frameWidth: 200, frameHeight: 200,
    });

    // ==========================================
    // ENEMIES — Kenney Platformer + Dungeon Crawl
    // ==========================================
    this.load.spritesheet(ASSET_KEYS.ENEMY_SPRITESHEET, 'assets/sprites/characters/enemies/enemies_spritesheet.png', {
      frameWidth: 64, frameHeight: 64,
    });
    this.load.image('slime_walk1', 'assets/sprites/characters/enemies/slimeWalk1.png');
    this.load.image('slime_walk2', 'assets/sprites/characters/enemies/slimeWalk2.png');
    this.load.image('slime_dead', 'assets/sprites/characters/enemies/slimeDead.png');
    this.load.image('fly_fly1', 'assets/sprites/characters/enemies/flyFly1.png');
    this.load.image('fly_fly2', 'assets/sprites/characters/enemies/flyFly2.png');

    // Dungeon Crawl enemies — use actual file paths
    this.load.image('demon_enemy', 'assets/sprites/enemies/demons/abomination_large.png');
    this.load.image('skeleton_enemy', 'assets/sprites/enemies/undead/bone_dragon_new.png');
    this.load.image('yokai_enemy', 'assets/sprites/enemies/azure_jelly_old.png');
    this.load.image('boss_enemy', 'assets/sprites/enemies/tengu.png'); // Tengu = Japanese myth creature!

    // DawnLike enemy sprites (16x16 each)
    this.load.image('dawnlike_demon', 'assets/sprites/enemies/dawnlike/Demon0.png');
    this.load.image('dawnlike_slime', 'assets/sprites/enemies/dawnlike/Slime0.png');

    // ==========================================
    // TILESETS
    // ==========================================
    // Hub (Kenney Platformer Deluxe)
    this.load.image(ASSET_KEYS.TILESET_HUB, 'assets/tilesets/hub/platformer-deluxe/tiles_spritesheet.png');
    this.load.image(ASSET_KEYS.BG_HUB_SKY, 'assets/tilesets/hub/platformer-deluxe/bg.png');
    this.load.image(ASSET_KEYS.BG_HUB_CASTLE, 'assets/tilesets/hub/platformer-deluxe/bg_castle.png');

    // Simplified tiles
    this.load.image(ASSET_KEYS.TILESET_SIMPLIFIED, 'assets/tilesets/hub/simplified/platformPack_tilesheet.png');

    // Ground tiles (Kenney platformer deluxe)
    this.load.image('tile_grass', 'assets/tilesets/hub/platformer-deluxe/grass.png');
    this.load.image('tile_dirt', 'assets/tilesets/hub/platformer-deluxe/dirt.png');
    this.load.image('tile_sand', 'assets/tilesets/hub/platformer-deluxe/sand.png');
    this.load.image('tile_stone', 'assets/tilesets/hub/platformer-deluxe/stone.png');
    this.load.image('tile_water', 'assets/tilesets/hub/platformer-deluxe/liquidWater.png');
    this.load.image('tile_water_top', 'assets/tilesets/hub/platformer-deluxe/liquidWaterTop.png');
    this.load.image('tile_lava', 'assets/tilesets/hub/platformer-deluxe/liquidLava.png');
    this.load.image('tile_lava_top', 'assets/tilesets/hub/platformer-deluxe/liquidLavaTop.png');

    // Dungeon (0x72 DungeonTileset II)
    this.load.image(ASSET_KEYS.TILESET_DUNGEON, 'assets/tilesets/dungeon/0x72_dungeontileset_ii_sheet1.png');
    this.load.image(ASSET_KEYS.TILESET_DUNGEON_ALT, 'assets/tilesets/dungeon/DungeonCrawl_ProjectUtumnoTileset.png');

    // Buildings and objects — use ACTUAL Kenney filenames
    this.load.image('obj_castle', 'assets/tilesets/hub/platformer-deluxe/castleCenter.png');
    this.load.image('obj_castle_half', 'assets/tilesets/hub/platformer-deluxe/castleHalf.png');
    this.load.image('obj_brick', 'assets/tilesets/hub/platformer-deluxe/brickWall.png');
    this.load.image('obj_bridge', 'assets/tilesets/hub/platformer-deluxe/bridge.png');
    this.load.image('obj_fence', 'assets/tilesets/hub/platformer-deluxe/fence.png');
    this.load.image('obj_sign', 'assets/tilesets/hub/platformer-deluxe/sign.png');
    this.load.image('obj_torch', 'assets/tilesets/hub/platformer-deluxe/torch.png');
    this.load.image('obj_torch_lit', 'assets/tilesets/hub/platformer-deluxe/tochLit.png'); // Kenney's actual filename

    // Items — use actual filenames from platformer-deluxe-items
    this.load.image('item_coin', 'assets/tilesets/hub/platformer-deluxe-items/coinGold.png');
    this.load.image('item_star', 'assets/tilesets/hub/platformer-deluxe-items/star.png');
    this.load.image('item_key', 'assets/tilesets/hub/platformer-deluxe-items/keyYellow.png');
    this.load.image('item_gem_blue', 'assets/tilesets/hub/platformer-deluxe-items/gemBlue.png');
    this.load.image('item_gem_green', 'assets/tilesets/hub/platformer-deluxe-items/gemGreen.png');
    this.load.image('item_mushroom', 'assets/tilesets/hub/platformer-deluxe-items/mushroomRed.png');
    this.load.image('item_bush', 'assets/tilesets/hub/platformer-deluxe-items/bush.png');
    this.load.image('item_cloud1', 'assets/tilesets/hub/platformer-deluxe-items/cloud1.png');
    this.load.image('item_cloud2', 'assets/tilesets/hub/platformer-deluxe-items/cloud2.png');

    // Flags — they're in platformer-deluxe-items folder
    this.load.image('obj_flag_red', 'assets/tilesets/hub/platformer-deluxe-items/flagRed.png');
    this.load.image('obj_flag_green', 'assets/tilesets/hub/platformer-deluxe-items/flagGreen.png');
    this.load.image('obj_flag_blue', 'assets/tilesets/hub/platformer-deluxe-items/flagBlue.png');

    // Player frames (Kenney platformer — backup)
    this.load.image('p1_stand', 'assets/sprites/characters/platformer-deluxe/p1_stand.png');
    this.load.image('p1_jump', 'assets/sprites/characters/platformer-deluxe/p1_jump.png');
    this.load.image('p1_hurt', 'assets/sprites/characters/platformer-deluxe/p1_hurt.png');

    // ==========================================
    // AUDIO — Use actual file paths
    // ==========================================
    // Kenney RPG sounds (OGG format, simple paths)
    this.load.audio(ASSET_KEYS.SFX_ATTACK, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/knifeSlice2.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_HIT, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/metalPot1.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_HURT, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/metalPot2.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_JUMP, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/clothBelt2.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_STEP, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/footstep00.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_COIN, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/handleCoins.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_CLICK, [
      'assets/audio/sfx/click-a.ogg',
    ]);
    this.load.audio(ASSET_KEYS.SFX_PORTAL, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/bookPlace1.ogg',
    ]);

    // Slime SFX (RPG Sound Pack)
    this.load.audio(ASSET_KEYS.SFX_SLIME, [
      'assets/audio/sfx/rpg-sound-pack/RPG Sound Pack/NPC/slime/slime1.wav',
    ]);

    // Death SFX
    this.load.audio(ASSET_KEYS.SFX_DEATH, [
      'assets/audio/sfx/kenney-rpg-sounds/OGG/dropLeather.ogg',
    ]);

    // ==========================================
    // MUSIC — Epic royalty-free tracks
    // ==========================================
    this.load.audio('music_menu', ['assets/audio/music/menu_theme.mp3']);
    this.load.audio('music_hub', ['assets/audio/music/hub_village_theme.mp3']);
    this.load.audio('music_dungeon', ['assets/audio/music/dungeon_theme.mp3']);
    this.load.audio('music_boss', ['assets/audio/music/boss_battle_theme.mp3']);
    this.load.audio('music_victory', ['assets/audio/music/victory_theme.mp3']);

    // ==========================================
    // GAME UI ASSETS
    // ==========================================
    // Golden UI (warm medieval frames — perfect for our game)
    this.load.image('ui_gold_frame', 'assets/ui/game-ui/golden-ui/arne16_gold.png');
    this.load.image('ui_gold_pieces', 'assets/ui/game-ui/golden-ui/ui_pieces.png');

    // Paper dialogue box (RPG-style)
    this.load.image('ui_dialogue_paper', 'assets/ui/game-ui/oga-buttons-dialogue/paper/paper-dialog.png');

    // Hearts (pixel art health)
    this.load.image('ui_heart_full', 'assets/ui/game-ui/oga-hearts/heart pixel art/heart pixel art 32x32.png');
    this.load.image('ui_heart_empty', 'assets/ui/game-ui/oga-hearts/Heart health bar/HUD/0.png');

    // Mobile controls (D-pad + action buttons)
    this.load.image('mobile_dpad', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad.png');
    this.load.image('mobile_dpad_up', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_north.png');
    this.load.image('mobile_dpad_down', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_south.png');
    this.load.image('mobile_dpad_left', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_west.png');
    this.load.image('mobile_dpad_right', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_east.png');
    this.load.image('mobile_btn_attack', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/button_square.png');
    this.load.image('mobile_btn_interact', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/button_diamond.png');
  }

  create(): void {
    // Create player animations
    this.createPlayerAnimations();

    // Create enemy animations
    this.createEnemyAnimations();

    // Transition to menu
    this.time.delayedCall(600, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private createPlayerAnimations(): void {
    // Idle — 8 frames
    this.anims.create({
      key: ANIMATIONS.player_idle.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_IDLE, { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    // Run — 8 frames
    this.anims.create({
      key: ANIMATIONS.player_run.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_RUN, { start: 0, end: 7 }),
      frameRate: 12,
      repeat: -1,
    });

    // Jump — check actual frame count from loaded texture
    const jumpTexture = this.textures.get(ASSET_KEYS.PLAYER_JUMP);
    const jumpFrames = Math.floor(jumpTexture.source[0].width / 200) - 1;
    this.anims.create({
      key: ANIMATIONS.player_jump.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_JUMP, { start: 0, end: jumpFrames }),
      frameRate: 8,
      repeat: 0,
    });

    // Fall
    const fallTexture = this.textures.get(ASSET_KEYS.PLAYER_FALL);
    const fallFrames = Math.floor(fallTexture.source[0].width / 200) - 1;
    this.anims.create({
      key: ANIMATIONS.player_fall.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_FALL, { start: 0, end: fallFrames }),
      frameRate: 8,
      repeat: 0,
    });

    // Attack 1 — 6 frames
    this.anims.create({
      key: ANIMATIONS.player_attack1.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_ATTACK1, { start: 0, end: 5 }),
      frameRate: 14,
      repeat: 0,
    });

    // Attack 2 — 6 frames
    this.anims.create({
      key: ANIMATIONS.player_attack2.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_ATTACK2, { start: 0, end: 5 }),
      frameRate: 14,
      repeat: 0,
    });

    // Hurt — check actual frames
    const hurtTexture = this.textures.get(ASSET_KEYS.PLAYER_HURT);
    const hurtFrames = Math.floor(hurtTexture.source[0].width / 200) - 1;
    this.anims.create({
      key: ANIMATIONS.player_hurt.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_HURT, { start: 0, end: hurtFrames }),
      frameRate: 10,
      repeat: 0,
    });

    // Death — 6 frames
    this.anims.create({
      key: ANIMATIONS.player_death.key,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_DEATH, { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0,
    });
  }

  private createEnemyAnimations(): void {
    // Slime walk animation
    this.anims.create({
      key: 'slime_walk',
      frames: [
        { key: 'slime_walk1' },
        { key: 'slime_walk2' },
      ],
      frameRate: 6,
      repeat: -1,
    });

    // Fly animation
    this.anims.create({
      key: 'fly_fly',
      frames: [
        { key: 'fly_fly1' },
        { key: 'fly_fly2' },
      ],
      frameRate: 8,
      repeat: -1,
    });
  }
}
