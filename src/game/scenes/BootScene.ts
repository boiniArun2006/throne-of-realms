// ============================================================
// THRONE OF REALMS — Boot Scene (Real Assets — FIXED)
// Loads all downloaded sprite sheets, tilesets, audio, and UI
// Uses: Martial Hero (CC0), Kenney (CC0), 0x72 (CC0)
// FIXED: Proper loading screen with gameplay image + logo
// FIXED: Error-resilient asset loading
// FIXED: Correct frame counts for Martial Hero sprites
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { ASSET_KEYS, SPRITE_FRAMES, ANIMATIONS } from '../AssetManifest';

export class BootScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private tipText!: Phaser.GameObjects.Text;
  private assetErrors: string[] = [];

  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // --- Loading screen background ---
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // --- Gameplay image as loading screen background ---
    // Load the logo first (it's small) so we can display it during the rest of loading
    this.load.image('game_logo', 'assets/ui/game-logo.png');

    // After logo loads, we'll show it — but for now, show text
    this.add.text(centerX, centerY - 120, 'THRONE OF REALMS', {
      fontSize: '32px', fontFamily: 'MedievalSharp, serif', color: '#ffd700',
      stroke: '#8b4513', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(centerX, centerY - 85, 'The Unlikely Hero', {
      fontSize: '12px', fontFamily: '"Press Start 2P", monospace', color: '#e0b0ff',
      stroke: '#4a0080', strokeThickness: 2,
    }).setOrigin(0.5);

    // --- Loading bar ---
    this.loadingBar = this.add.graphics();
    this.loadingText = this.add.text(centerX, centerY + 20, 'Loading assets...', {
      fontSize: '11px', fontFamily: '"Press Start 2P", monospace', color: '#b0b0b0',
    }).setOrigin(0.5);

    this.tipText = this.add.text(centerX, centerY + 80, '', {
      fontSize: '9px', fontFamily: '"Silkscreen", monospace', color: '#606060',
    }).setOrigin(0.5);

    // --- Progress tracking ---
    this.load.on('progress', (value: number) => {
      this.loadingBar.clear();
      this.loadingBar.fillStyle(0x2c3e50, 1);
      this.loadingBar.fillRect(centerX - 152, centerY + 40, 304, 16);
      this.loadingBar.fillStyle(0xffd700, 1);
      this.loadingBar.fillRect(centerX - 150, centerY + 42, value * 300, 12);
      this.loadingText.setText(`Loading assets... ${Math.floor(value * 100)}%`);
    });

    this.load.on('loaderror', (file: any) => {
      const errMsg = `Missing: ${file.key} (${file.url})`;
      console.warn(`[Asset Load Error] ${errMsg}`);
      this.assetErrors.push(errMsg);
    });

    // Show tips during loading
    const tips = [
      'Tip: Bathrooms are portals to divine realms!',
      'Tip: Press X near objects to interact',
      'Tip: Z + Z + Z for combo attacks!',
      'Tip: Pray at the temple to restore HP',
      'Tip: Each dungeon holds a divine weapon',
      'Tip: Veer transforms when entering bathrooms',
    ];
    let tipIdx = 0;
    this.load.on('progress', () => {
      if (Math.random() < 0.05) {
        this.tipText.setText(tips[tipIdx % tips.length]);
        tipIdx++;
      }
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

    // Dungeon Crawl enemies
    this.load.image('demon_enemy', 'assets/sprites/enemies/demons/abomination_large.png');
    this.load.image('skeleton_enemy', 'assets/sprites/enemies/undead/bone_dragon_new.png');
    this.load.image('yokai_enemy', 'assets/sprites/enemies/azure_jelly_old.png');
    this.load.image('boss_enemy', 'assets/sprites/enemies/tengu.png');

    // DawnLike enemy sprites
    this.load.image('dawnlike_demon', 'assets/sprites/enemies/dawnlike/Demon0.png');
    this.load.image('dawnlike_slime', 'assets/sprites/enemies/dawnlike/Slime0.png');

    // ==========================================
    // TILESETS
    // ==========================================
    this.load.image(ASSET_KEYS.TILESET_HUB, 'assets/tilesets/hub/platformer-deluxe/tiles_spritesheet.png');
    this.load.image(ASSET_KEYS.BG_HUB_SKY, 'assets/tilesets/hub/platformer-deluxe/bg.png');
    this.load.image(ASSET_KEYS.BG_HUB_CASTLE, 'assets/tilesets/hub/platformer-deluxe/bg_castle.png');
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

    // Buildings and objects
    this.load.image('obj_castle', 'assets/tilesets/hub/platformer-deluxe/castleCenter.png');
    this.load.image('obj_castle_half', 'assets/tilesets/hub/platformer-deluxe/castleHalf.png');
    this.load.image('obj_brick', 'assets/tilesets/hub/platformer-deluxe/brickWall.png');
    this.load.image('obj_bridge', 'assets/tilesets/hub/platformer-deluxe/bridge.png');
    this.load.image('obj_fence', 'assets/tilesets/hub/platformer-deluxe/fence.png');
    this.load.image('obj_sign', 'assets/tilesets/hub/platformer-deluxe/sign.png');
    this.load.image('obj_torch', 'assets/tilesets/hub/platformer-deluxe/torch.png');
    this.load.image('obj_torch_lit', 'assets/tilesets/hub/platformer-deluxe/tochLit.png');

    // Items
    this.load.image('item_coin', 'assets/tilesets/hub/platformer-deluxe-items/coinGold.png');
    this.load.image('item_star', 'assets/tilesets/hub/platformer-deluxe-items/star.png');
    this.load.image('item_key', 'assets/tilesets/hub/platformer-deluxe-items/keyYellow.png');
    this.load.image('item_gem_blue', 'assets/tilesets/hub/platformer-deluxe-items/gemBlue.png');
    this.load.image('item_gem_green', 'assets/tilesets/hub/platformer-deluxe-items/gemGreen.png');
    this.load.image('item_mushroom', 'assets/tilesets/hub/platformer-deluxe-items/mushroomRed.png');
    this.load.image('item_bush', 'assets/tilesets/hub/platformer-deluxe-items/bush.png');
    this.load.image('item_cloud1', 'assets/tilesets/hub/platformer-deluxe-items/cloud1.png');
    this.load.image('item_cloud2', 'assets/tilesets/hub/platformer-deluxe-items/cloud2.png');

    // Flags
    this.load.image('obj_flag_red', 'assets/tilesets/hub/platformer-deluxe-items/flagRed.png');
    this.load.image('obj_flag_green', 'assets/tilesets/hub/platformer-deluxe-items/flagGreen.png');
    this.load.image('obj_flag_blue', 'assets/tilesets/hub/platformer-deluxe-items/flagBlue.png');

    // Player frames (Kenney platformer — backup)
    this.load.image('p1_stand', 'assets/sprites/characters/platformer-deluxe/p1_stand.png');
    this.load.image('p1_jump', 'assets/sprites/characters/platformer-deluxe/p1_jump.png');
    this.load.image('p1_hurt', 'assets/sprites/characters/platformer-deluxe/p1_hurt.png');

    // ==========================================
    // AUDIO
    // ==========================================
    this.load.audio(ASSET_KEYS.SFX_ATTACK, ['assets/audio/sfx/kenney-rpg-sounds/OGG/knifeSlice2.ogg']);
    this.load.audio(ASSET_KEYS.SFX_HIT, ['assets/audio/sfx/kenney-rpg-sounds/OGG/metalPot1.ogg']);
    this.load.audio(ASSET_KEYS.SFX_HURT, ['assets/audio/sfx/kenney-rpg-sounds/OGG/metalPot2.ogg']);
    this.load.audio(ASSET_KEYS.SFX_JUMP, ['assets/audio/sfx/kenney-rpg-sounds/OGG/clothBelt2.ogg']);
    this.load.audio(ASSET_KEYS.SFX_STEP, ['assets/audio/sfx/kenney-rpg-sounds/OGG/footstep00.ogg']);
    this.load.audio(ASSET_KEYS.SFX_COIN, ['assets/audio/sfx/kenney-rpg-sounds/OGG/handleCoins.ogg']);
    this.load.audio(ASSET_KEYS.SFX_CLICK, ['assets/audio/sfx/click-a.ogg']);
    this.load.audio(ASSET_KEYS.SFX_PORTAL, ['assets/audio/sfx/kenney-rpg-sounds/OGG/bookPlace1.ogg']);
    this.load.audio(ASSET_KEYS.SFX_SLIME, ['assets/audio/sfx/rpg-sound-pack/RPG Sound Pack/NPC/slime/slime1.wav']);
    this.load.audio(ASSET_KEYS.SFX_DEATH, ['assets/audio/sfx/kenney-rpg-sounds/OGG/dropLeather.ogg']);

    // Music
    this.load.audio('music_menu', ['assets/audio/music/menu_theme.mp3']);
    this.load.audio('music_hub', ['assets/audio/music/hub_village_theme.mp3']);
    this.load.audio('music_dungeon', ['assets/audio/music/dungeon_theme.mp3']);
    this.load.audio('music_boss', ['assets/audio/music/boss_battle_theme.mp3']);
    this.load.audio('music_victory', ['assets/audio/music/victory_theme.mp3']);

    // ==========================================
    // GAME UI ASSETS
    // ==========================================
    this.load.image('ui_gold_frame', 'assets/ui/game-ui/golden-ui/arne16_gold.png');
    this.load.image('ui_gold_pieces', 'assets/ui/game-ui/golden-ui/ui_pieces.png');
    this.load.image('ui_dialogue_paper', 'assets/ui/game-ui/oga-buttons-dialogue/paper/paper-dialog.png');
    this.load.image('ui_heart_full', 'assets/ui/game-ui/oga-hearts/heart pixel art/heart pixel art 32x32.png');
    this.load.image('ui_heart_empty', 'assets/ui/game-ui/oga-hearts/Heart health bar/HUD/0.png');

    // Mobile controls
    this.load.image('mobile_dpad', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad.png');
    this.load.image('mobile_dpad_up', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_north.png');
    this.load.image('mobile_dpad_down', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_south.png');
    this.load.image('mobile_dpad_left', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_west.png');
    this.load.image('mobile_dpad_right', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/dpad_element_east.png');
    this.load.image('mobile_btn_attack', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/button_square.png');
    this.load.image('mobile_btn_interact', 'assets/ui/mobile-controls/kenney-mobile-controls/Sprites/Style F/Default/button_diamond.png');
  }

  create(): void {
    // --- Show logo on loading screen if available ---
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    if (this.textures.exists('game_logo')) {
      const logo = this.add.image(centerX, centerY - 40, 'game_logo');
      logo.setScale(0.28);
      logo.setDepth(50);
    }

    // --- Log asset errors ---
    if (this.assetErrors.length > 0) {
      console.warn(`[BootScene] ${this.assetErrors.length} asset(s) failed to load:`);
      this.assetErrors.forEach(e => console.warn(`  - ${e}`));
    }

    // --- Create player animations (error-resilient) ---
    this.createPlayerAnimations();

    // --- Create enemy animations ---
    this.createEnemyAnimations();

    // --- Transition to menu after brief pause ---
    this.time.delayedCall(800, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private createPlayerAnimations(): void {
    // Helper: safely create animation, checking if texture loaded
    const safeCreate = (key: string, textureKey: string, start: number, end: number, frameRate: number, repeat: number) => {
      if (!this.textures.exists(textureKey)) {
        console.warn(`[BootScene] Skipping animation "${key}" — texture "${textureKey}" not loaded`);
        return;
      }
      try {
        // Don't recreate if already exists (scene restart)
        if (this.anims.exists(key)) {
          this.anims.remove(key);
        }
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(textureKey, { start, end }),
          frameRate,
          repeat,
        });
      } catch (e) {
        console.warn(`[BootScene] Failed to create animation "${key}":`, e);
      }
    };

    // Idle — Martial Hero has 8 frames
    safeCreate(ANIMATIONS.player_idle.key, ASSET_KEYS.PLAYER_IDLE, 0, 7, 8, -1);

    // Run — 8 frames
    safeCreate(ANIMATIONS.player_run.key, ASSET_KEYS.PLAYER_RUN, 0, 7, 12, -1);

    // Jump — dynamically check frame count
    if (this.textures.exists(ASSET_KEYS.PLAYER_JUMP)) {
      try {
        const jumpTexture = this.textures.get(ASSET_KEYS.PLAYER_JUMP);
        const jumpFrames = Math.floor(jumpTexture.source[0].width / 200) - 1;
        safeCreate(ANIMATIONS.player_jump.key, ASSET_KEYS.PLAYER_JUMP, 0, Math.max(0, jumpFrames), 8, 0);
      } catch (e) {
        safeCreate(ANIMATIONS.player_jump.key, ASSET_KEYS.PLAYER_JUMP, 0, 3, 8, 0);
      }
    }

    // Fall — dynamically check frame count
    if (this.textures.exists(ASSET_KEYS.PLAYER_FALL)) {
      try {
        const fallTexture = this.textures.get(ASSET_KEYS.PLAYER_FALL);
        const fallFrames = Math.floor(fallTexture.source[0].width / 200) - 1;
        safeCreate(ANIMATIONS.player_fall.key, ASSET_KEYS.PLAYER_FALL, 0, Math.max(0, fallFrames), 8, 0);
      } catch (e) {
        safeCreate(ANIMATIONS.player_fall.key, ASSET_KEYS.PLAYER_FALL, 0, 3, 8, 0);
      }
    }

    // Attack 1 — 6 frames
    safeCreate(ANIMATIONS.player_attack1.key, ASSET_KEYS.PLAYER_ATTACK1, 0, 5, 14, 0);

    // Attack 2 — 6 frames
    safeCreate(ANIMATIONS.player_attack2.key, ASSET_KEYS.PLAYER_ATTACK2, 0, 5, 14, 0);

    // Hurt — dynamically check
    if (this.textures.exists(ASSET_KEYS.PLAYER_HURT)) {
      try {
        const hurtTexture = this.textures.get(ASSET_KEYS.PLAYER_HURT);
        const hurtFrames = Math.floor(hurtTexture.source[0].width / 200) - 1;
        safeCreate(ANIMATIONS.player_hurt.key, ASSET_KEYS.PLAYER_HURT, 0, Math.max(0, hurtFrames), 10, 0);
      } catch (e) {
        safeCreate(ANIMATIONS.player_hurt.key, ASSET_KEYS.PLAYER_HURT, 0, 3, 10, 0);
      }
    }

    // Death — 6 frames
    safeCreate(ANIMATIONS.player_death.key, ASSET_KEYS.PLAYER_DEATH, 0, 5, 8, 0);
  }

  private createEnemyAnimations(): void {
    // Slime walk animation
    if (this.textures.exists('slime_walk1') && this.textures.exists('slime_walk2')) {
      if (this.anims.exists('slime_walk')) {
        this.anims.remove('slime_walk');
      }
      this.anims.create({
        key: 'slime_walk',
        frames: [
          { key: 'slime_walk1' },
          { key: 'slime_walk2' },
        ],
        frameRate: 6,
        repeat: -1,
      });
    }

    // Fly animation
    if (this.textures.exists('fly_fly1') && this.textures.exists('fly_fly2')) {
      if (this.anims.exists('fly_fly')) {
        this.anims.remove('fly_fly');
      }
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
}
