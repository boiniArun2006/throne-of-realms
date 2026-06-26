// ============================================================
// THRONE OF REALMS — Hub World Scene (Real Assets)
// Village of Avani with Kenney Platformer Deluxe tilesets
// Parallax backgrounds, buildings, NPCs, bathroom portal
// FIXED: time.removeAllEvents() killing all timers
// FIXED: StaticGroup physics bodies need proper setup
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, COLORS, CHARACTERS } from '../constants';
import { MusicManager } from '../systems/MusicManager';
import { ASSET_KEYS, ANIMATIONS } from '../AssetManifest';
import { Player } from '../entities/Player';
import { DIALOGUES } from '../data/dialogues';
import { useGameState } from '../GameState';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 600;
const GROUND_Y = 480;

export class HubWorldScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private interactables: { object: Phaser.GameObjects.Rectangle; type: string; label: string }[] = [];
  private interactHint!: Phaser.GameObjects.Text;
  private nearInteractable: string | null = null;
  private dialogueActive: boolean = false;
  private dialogueOverlay!: Phaser.GameObjects.Container;
  private dialogueLines: { speaker: string; text: string; emotion?: string }[] = [];
  private dialogueIndex: number = 0;
  private _dialogueOnComplete: (() => void) | null = null;
  private bathroomPortal!: Phaser.GameObjects.Sprite;
  private musicManager!: MusicManager;
  private dialogueTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super({ key: SCENES.HUB });
  }

  create(): void {
    const gameState = useGameState.getState();
    gameState.setCurrentScene(SCENES.HUB);

    // --- Music ---
    this.musicManager = new MusicManager(this);
    this.musicManager.play('music_hub', { volume: 0.2, loop: true });

    // --- Parallax Background ---
    this.createBackground();

    // --- World Bounds ---
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // --- Ground & Platforms ---
    this.createEnvironment();

    // --- Player ---
    this.player = new Player(this, 200, GROUND_Y - 40);

    if (gameState.completedDungeons.length > 0) {
      this.player.transform();
    }

    // --- Camera ---
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 50);

    // --- Interact hint ---
    this.interactHint = this.add.text(0, 0, '', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2,
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 },
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    // --- Dialogue overlay ---
    this.createDialogueOverlay();

    // --- Collisions ---
    this.physics.add.collider(this.player, this.platforms);

    // --- Interaction detection ---
    this.setupInteractionDetection();

    // --- Show intro dialogue ---
    if (!gameState.dialogueFlags.intro_complete) {
      this.time.delayedCall(1000, () => {
        this.startDialogue(DIALOGUES.game_intro.lines, () => {
          gameState.setDialogueFlag('intro_complete', true);
        });
      });
    }

    // --- Return from dungeon handler ---
    this.game.events.on('returnToHub', (data: { hp: number }) => {
      this.player.hp = data.hp;
      this.player.x = 400;
      this.player.y = GROUND_Y - 40;
      if (!this.player.isTransformed) {
        this.player.transform();
      }
      this.cameras.main.fadeIn(500);
    });
  }

  update(time: number, delta: number): void {
    if (this.dialogueActive) {
      this.player.body.setVelocityX(0);
      return;
    }

    this.player.update(time, delta);

    this.updateInteractHint();

    // Bathroom portal animation
    if (this.bathroomPortal && this.bathroomPortal.active) {
      this.bathroomPortal.setAngle(Math.sin(time / 500) * 5);
      this.bathroomPortal.setAlpha(0.7 + 0.3 * Math.sin(time / 300));
    }

    const gameState = useGameState.getState();
    gameState.setPlayerPosition(Math.floor(this.player.x), Math.floor(this.player.y));
  }

  // ============================================================
  // BACKGROUND (Parallax with real Kenney backgrounds)
  // ============================================================
  private createBackground(): void {
    // Sky background tile (repeating)
    const sky = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.BG_HUB_SKY);
    sky.setOrigin(0, 0);
    sky.setDepth(0);
    sky.setScrollFactor(0.1, 0);

    // Castle/mountain background (parallax mid layer)
    const castle = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.BG_HUB_CASTLE);
    castle.setOrigin(0, 0);
    castle.setDepth(1);
    castle.setScrollFactor(0.3, 0);

    // Atmospheric gradient overlay
    const overlay = this.add.graphics();
    overlay.setDepth(2);
    overlay.setScrollFactor(0);

    // Warm sunset gradient at the bottom
    for (let y = GAME_HEIGHT - 200; y < GAME_HEIGHT; y++) {
      const ratio = (y - (GAME_HEIGHT - 200)) / 200;
      const r = Math.floor(30 + ratio * 40);
      const g = Math.floor(20 + ratio * 20);
      const b = Math.floor(50 + ratio * 30);
      overlay.fillStyle(Phaser.Display.Color.GetColor(r, g, b), ratio * 0.4);
      overlay.fillRect(0, y, GAME_WIDTH, 1);
    }
  }

  // ============================================================
  // ENVIRONMENT — FIXED: proper physics body creation
  // ============================================================
  private createEnvironment(): void {
    this.platforms = this.physics.add.staticGroup();

    // --- Main ground using physics rectangles with tileSprite visuals ---
    // Ground top layer (grass visual + physics)
    const groundTopVisual = this.add.tileSprite(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, TILE_SIZE, 'tile_grass');
    groundTopVisual.setDepth(3);
    // Create a separate invisible physics body for the ground
    const groundTopBody = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + TILE_SIZE / 2, WORLD_WIDTH, TILE_SIZE, 0x000000, 0);
    this.physics.add.existing(groundTopBody, true); // static=true
    this.platforms.add(groundTopBody);

    // Ground fill layer (dirt visual, no physics needed — it's below)
    const groundDirtVisual = this.add.tileSprite(WORLD_WIDTH / 2, GROUND_Y + TILE_SIZE * 2, WORLD_WIDTH, TILE_SIZE * 4, 'tile_dirt');
    groundDirtVisual.setDepth(3);

    // --- Sub-ground physics body (prevents falling through) ---
    const subGround = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y + TILE_SIZE * 3, WORLD_WIDTH, TILE_SIZE * 4, 0x000000, 0);
    this.physics.add.existing(subGround, true);
    this.platforms.add(subGround);

    // --- Veer's House (half-constructed) ---
    this.buildHouse(200);

    // --- Bathroom (with portal!) ---
    this.buildBathroom(450);

    // --- Stone path / bridge ---
    const bridgeVisual = this.add.tileSprite(700, GROUND_Y, 200, TILE_SIZE, 'tile_stone');
    bridgeVisual.setDepth(4);

    // --- Temple area ---
    this.buildTemple(1000);

    // --- Flower shop area ---
    this.buildFlowerShop(1350);

    // --- Water area (decorative only, no physics) ---
    const water = this.add.tileSprite(1700, GROUND_Y + TILE_SIZE, 200, TILE_SIZE * 2, 'tile_water');
    water.setDepth(3);
    const waterBridgeVisual = this.add.tileSprite(1700, GROUND_Y, 200, TILE_SIZE, 'tile_stone');
    waterBridgeVisual.setDepth(5);

    // --- Decorations ---
    this.placeDecorations();

    // --- Upper platforms for exploration (with proper physics) ---
    const platPositions = [
      { x: 500, y: GROUND_Y - 120, w: 100 },
      { x: 800, y: GROUND_Y - 150, w: 120 },
      { x: 1100, y: GROUND_Y - 130, w: 110 },
      { x: 1500, y: GROUND_Y - 110, w: 100 },
    ];
    for (const pos of platPositions) {
      const platVisual = this.add.tileSprite(pos.x, pos.y, pos.w, 12, 'tile_stone');
      platVisual.setDepth(5);
      // Create physics body separately
      const platBody = this.add.rectangle(pos.x, pos.y + 6, pos.w, 12, 0x000000, 0);
      this.physics.add.existing(platBody, true);
      this.platforms.add(platBody);
    }

    // --- World walls (prevent going out of bounds) ---
    const leftWall = this.add.rectangle(0, GROUND_Y / 2, 32, WORLD_HEIGHT, 0x000000, 0);
    this.physics.add.existing(leftWall, true);
    this.platforms.add(leftWall);

    const rightWall = this.add.rectangle(WORLD_WIDTH, GROUND_Y / 2, 32, WORLD_HEIGHT, 0x000000, 0);
    this.physics.add.existing(rightWall, true);
    this.platforms.add(rightWall);
  }

  private buildHouse(x: number): void {
    // Half-constructed house using castle/brick tiles
    const house = this.add.graphics();
    house.setDepth(4);

    // Base walls (partial)
    house.fillStyle(0x8b6914, 1);
    house.fillRect(x - 40, GROUND_Y - 64, 80, 64);

    // Brick details
    house.fillStyle(0xa07a28, 1);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const bx = x - 36 + col * 16;
        const by = GROUND_Y - 60 + row * 16;
        if (Math.random() > 0.3) { // Missing bricks = under construction
          house.fillRect(bx, by, 14, 14);
        }
      }
    }

    // Roof (half done, Japanese-style red)
    house.fillStyle(0xc0392b, 1);
    house.fillRect(x - 45, GROUND_Y - 72, 90, 10);
    house.fillRect(x - 42, GROUND_Y - 80, 84, 8);

    // Door
    house.fillStyle(0x2c1810, 1);
    house.fillRect(x - 10, GROUND_Y - 36, 20, 36);

    // Scaffolding
    house.fillStyle(0x654321, 1);
    house.fillRect(x + 42, GROUND_Y - 50, 3, 50);
    house.fillRect(x + 42, GROUND_Y - 30, 15, 3);

    // Sign
    this.add.text(x, GROUND_Y - 90, "Veer's House", {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#b8884a',
      stroke: '#000',
      strokeThickness: 1,
    }).setOrigin(0.5).setDepth(10);
  }

  private buildBathroom(x: number): void {
    // Bathroom building
    const bath = this.add.graphics();
    bath.setDepth(4);

    // Walls
    bath.fillStyle(0xb0c4de, 1);
    bath.fillRect(x - 20, GROUND_Y - 48, 40, 48);

    // Roof (small red roof)
    bath.fillStyle(0xc0392b, 1);
    bath.fillRect(x - 24, GROUND_Y - 52, 48, 6);
    bath.fillRect(x - 22, GROUND_Y - 58, 44, 6);

    // Door (with glow for portal)
    bath.fillStyle(0x8b4513, 1);
    bath.fillRect(x - 8, GROUND_Y - 32, 16, 32);

    // Purple glow around door
    bath.fillStyle(0x8a2be2, 0.3);
    bath.fillRect(x - 10, GROUND_Y - 34, 20, 36);

    // Sign
    bath.fillStyle(0xffffff, 1);
    bath.fillRect(x - 6, GROUND_Y - 48, 12, 6);
    bath.fillStyle(0x4682b4, 1);
    bath.fillRect(x - 2, GROUND_Y - 47, 4, 4);

    // Portal sprite (animated)
    this.bathroomPortal = this.add.sprite(x, GROUND_Y - 24, 'p1_stand');
    this.bathroomPortal.setScale(0.2);
    this.bathroomPortal.setTint(0x8a2be2);
    this.bathroomPortal.setDepth(5);

    this.add.text(x, GROUND_Y - 70, 'Bathroom', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#8a2be2',
      stroke: '#000',
      strokeThickness: 1,
    }).setOrigin(0.5).setDepth(10);

    // Interaction zone
    const zone = this.add.rectangle(x, GROUND_Y - 24, 36, 48, 0x8a2be2, 0) as Phaser.GameObjects.Rectangle;
    zone.setDepth(6);
    this.interactables.push({ object: zone, type: 'bathroom', label: '[X] Enter Bathroom' });
  }

  private buildTemple(x: number): void {
    const temple = this.add.graphics();
    temple.setDepth(4);

    // Temple base
    temple.fillStyle(0x808080, 1);
    temple.fillRect(x - 50, GROUND_Y - 64, 100, 64);

    // Stone texture
    temple.fillStyle(0x999999, 1);
    for (let i = 0; i < 5; i++) {
      temple.fillRect(x - 48 + i * 20, GROUND_Y - 60, 18, 8);
    }

    // Steps
    temple.fillStyle(0x909090, 1);
    temple.fillRect(x - 55, GROUND_Y - 4, 110, 4);
    temple.fillRect(x - 52, GROUND_Y - 8, 104, 4);

    // Door
    temple.fillStyle(0x2c1810, 1);
    temple.fillRect(x - 12, GROUND_Y - 40, 24, 40);

    // Japanese roof (red, curved)
    temple.fillStyle(0xc0392b, 1);
    temple.fillRect(x - 58, GROUND_Y - 72, 116, 10);
    temple.fillRect(x - 55, GROUND_Y - 80, 110, 8);

    // Indian dome on top (gold)
    temple.fillStyle(0xf39c12, 1);
    temple.fillRect(x - 15, GROUND_Y - 88, 30, 8);
    temple.fillRect(x - 10, GROUND_Y - 94, 20, 6);
    temple.fillRect(x - 5, GROUND_Y - 98, 10, 4);

    // Temple steps platform (physics)
    const templePlatform = this.add.rectangle(x, GROUND_Y, 110, 8, 0x000000, 0);
    this.physics.add.existing(templePlatform, true);
    this.platforms.add(templePlatform);

    // Torii pillars
    temple.fillStyle(0xc0392b, 1);
    temple.fillRect(x - 58, GROUND_Y - 72, 4, 72);
    temple.fillRect(x + 54, GROUND_Y - 72, 4, 72);

    this.add.text(x, GROUND_Y - 110, 'Sacred Temple', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#f39c12',
      stroke: '#000',
      strokeThickness: 1,
    }).setOrigin(0.5).setDepth(10);

    // Temple interaction
    const templeZone = this.add.rectangle(x, GROUND_Y - 20, 40, 50, 0xf39c12, 0) as Phaser.GameObjects.Rectangle;
    templeZone.setDepth(6);
    this.interactables.push({ object: templeZone, type: 'temple', label: '[X] Pray at Temple' });
  }

  private buildFlowerShop(x: number): void {
    const shop = this.add.graphics();
    shop.setDepth(4);

    // Shop building
    shop.fillStyle(0x8b6914, 1);
    shop.fillRect(x - 40, GROUND_Y - 50, 80, 50);

    // Roof
    shop.fillStyle(0xc0392b, 1);
    shop.fillRect(x - 45, GROUND_Y - 56, 90, 8);

    // Door
    shop.fillStyle(0x8b4513, 1);
    shop.fillRect(x - 8, GROUND_Y - 30, 16, 30);

    // Flowers (colorful)
    const flowerColors = [0xff69b4, 0xff6347, 0xffd700, 0xff1493, 0xff4500];
    for (let i = 0; i < 8; i++) {
      shop.fillStyle(flowerColors[i % flowerColors.length], 1);
      shop.fillCircle(x - 35 + i * 10, GROUND_Y - 58, 4);
      shop.fillStyle(0x228b22, 1);
      shop.fillRect(x - 36 + i * 10, GROUND_Y - 54, 2, 8);
    }

    // Sign
    this.add.text(x, GROUND_Y - 70, "Hana's Flowers", {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#ffb7c5',
      stroke: '#000',
      strokeThickness: 1,
    }).setOrigin(0.5).setDepth(10);

    // Hana interaction
    const hanaZone = this.add.rectangle(x, GROUND_Y - 25, 30, 50, 0xffb7c5, 0) as Phaser.GameObjects.Rectangle;
    hanaZone.setDepth(6);
    this.interactables.push({ object: hanaZone, type: 'hana', label: '[X] Talk to Hana' });
  }

  private placeDecorations(): void {
    // Torches along path
    for (let x = 300; x < WORLD_WIDTH - 200; x += 180) {
      if (this.textures.exists('obj_torch_lit')) {
        const torch = this.add.image(x, GROUND_Y - 10, 'obj_torch_lit');
        torch.setScale(0.8);
        torch.setDepth(4);
      }
    }

    // Flags
    if (this.textures.exists('obj_flag_red')) {
      this.add.image(600, GROUND_Y - 40, 'obj_flag_red').setScale(0.8).setDepth(4);
    }
    if (this.textures.exists('obj_flag_green')) {
      this.add.image(1200, GROUND_Y - 40, 'obj_flag_green').setScale(0.8).setDepth(4);
    }

    // Sign
    if (this.textures.exists('obj_sign')) {
      this.add.image(650, GROUND_Y - 10, 'obj_sign').setScale(0.8).setDepth(4);
    }

    // Coins scattered (decorative)
    if (this.textures.exists('item_coin')) {
      for (let i = 0; i < 8; i++) {
        const cx = 300 + i * 250 + Phaser.Math.Between(-20, 20);
        const coin = this.add.image(cx, GROUND_Y - 8, 'item_coin');
        coin.setScale(0.5);
        coin.setDepth(4);

        // Bobbing animation
        this.tweens.add({
          targets: coin,
          y: coin.y - 4,
          duration: 800 + i * 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }

    // Fences
    if (this.textures.exists('obj_fence')) {
      for (let x = 900; x < 980; x += 20) {
        const fence = this.add.image(x, GROUND_Y - 8, 'obj_fence');
        fence.setScale(0.7);
        fence.setDepth(4);
      }
    }
  }

  // ============================================================
  // INTERACTION SYSTEM
  // ============================================================
  private setupInteractionDetection(): void {
    this.player.events.on('interact', () => {
      if (this.nearInteractable && !this.dialogueActive) {
        this.handleInteraction(this.nearInteractable);
      } else if (this.dialogueActive) {
        this.advanceDialogue();
      }
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.dialogueActive) this.advanceDialogue();
    });
  }

  private updateInteractHint(): void {
    this.nearInteractable = null;
    let nearestDist = Infinity;
    let nearestLabel = '';

    for (const i of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, i.object.x, i.object.y);
      if (dist < 55 && dist < nearestDist) {
        nearestDist = dist;
        this.nearInteractable = i.type;
        nearestLabel = i.label;
      }
    }

    if (this.nearInteractable) {
      this.interactHint.setText(nearestLabel);
      this.interactHint.setPosition(this.player.x, this.player.y - 55);
      this.interactHint.setVisible(true);
    } else {
      this.interactHint.setVisible(false);
    }
  }

  private handleInteraction(type: string): void {
    const gameState = useGameState.getState();

    switch (type) {
      case 'bathroom':
        this.enterBathroom();
        break;
      case 'temple':
        if (this.player.hp < this.player.maxHp) {
          this.player.heal(this.player.maxHp - this.player.hp);
          this.showFloatingText(this.player.x, this.player.y - 60, 'HP Restored!', '#2ecc71');
        } else {
          this.showFloatingText(this.player.x, this.player.y - 60, 'Already at full health', '#b0b0b0');
        }
        break;
      case 'hana':
        if (!gameState.dialogueFlags.hana_first_meeting) {
          this.startDialogue(DIALOGUES.hana_encounter.lines, () => {
            gameState.setDialogueFlag('hana_first_meeting', true);
          });
        } else {
          this.startDialogue([
            { speaker: 'Hana', text: 'Oh, hey again! You seem... stronger today.', emotion: 'happy' },
            { speaker: 'Veer', text: 'Th-thanks! I\'ve been... working out. (In bathrooms.)', emotion: 'comedy' },
            { speaker: 'Hana', text: 'Bathrooms? That\'s... unique!', emotion: 'happy' },
            { speaker: 'Veer', text: 'You have NO idea.', emotion: 'comedy' },
          ]);
        }
        break;
    }
  }

  // ============================================================
  // BATHROOM PORTAL MECHANIC
  // ============================================================
  private enterBathroom(): void {
    const gameState = useGameState.getState();

    if (!gameState.dialogueFlags.first_bathroom) {
      this.startDialogue(DIALOGUES.first_bathroom.lines, () => {
        gameState.setDialogueFlag('first_bathroom', true);
        gameState.incrementDungeonAttempt();
        this.transitionToDungeon();
      });
    } else {
      gameState.incrementDungeonAttempt();
      this.startDialogue(DIALOGUES.bathroom_reenter.lines, () => {
        this.transitionToDungeon();
      });
    }
  }

  private transitionToDungeon(): void {
    // Play portal SFX
    if (this.cache.audio.exists('sfx_portal')) {
      this.sound.play('sfx_portal', { volume: 0.5 });
    }

    this.musicManager.stop(500);
    this.cameras.main.flash(300, 138, 43, 226);
    this.cameras.main.shake(200, 0.01);

    this.time.delayedCall(500, () => {
      const gameState = useGameState.getState();
      const nextDungeon = gameState.completedDungeons.length;
      const dungeonOrder = ['agni_furnace', 'susanoo_storm', 'yama_underworld', 'amaterasu_light', 'shiva_tandava', 'tsukuyomi_eclipse'] as const;
      const realm = dungeonOrder[Math.min(nextDungeon, dungeonOrder.length - 1)];

      this.scene.stop(SCENES.HUD);
      this.scene.start(SCENES.DUNGEON, { realm, fromBathroom: true });
    });
  }

  // ============================================================
  // DIALOGUE SYSTEM — FIXED: no more removeAllEvents()
  // ============================================================
  private createDialogueOverlay(): void {
    this.dialogueOverlay = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT - 80);
    this.dialogueOverlay.setDepth(200);
    this.dialogueOverlay.setScrollFactor(0);
    this.dialogueOverlay.setVisible(false);

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1e, 0.92);
    bg.fillRoundedRect(-GAME_WIDTH / 2 + 20, -50, GAME_WIDTH - 40, 100, 8);
    bg.lineStyle(2, 0xffd700, 0.8);
    bg.strokeRoundedRect(-GAME_WIDTH / 2 + 20, -50, GAME_WIDTH - 40, 100, 8);

    const speakerText = this.add.text(-GAME_WIDTH / 2 + 40, -40, '', {
      fontSize: '14px', fontFamily: '"Press Start 2P", monospace', fontStyle: 'bold', color: '#ffd700',
    });

    const dialogueText = this.add.text(-GAME_WIDTH / 2 + 40, -18, '', {
      fontSize: '11px', fontFamily: '"Press Start 2P", monospace', color: '#e0e0e0',
      wordWrap: { width: GAME_WIDTH - 100 }, lineSpacing: 4,
    });

    const continueHint = this.add.text(GAME_WIDTH / 2 - 50, 32, '[X/Space]', {
      fontSize: '10px', fontFamily: 'monospace', color: '#808080',
    });

    this.dialogueOverlay.add([bg, speakerText, dialogueText, continueHint]);
  }

  private startDialogue(lines: { speaker: string; text: string; emotion?: string }[], onComplete?: () => void): void {
    this.dialogueActive = true;
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueOverlay.setVisible(true);
    this._dialogueOnComplete = onComplete || null;
    this.showDialogueLine();
  }

  private showDialogueLine(): void {
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.endDialogue();
      return;
    }

    const line = this.dialogueLines[this.dialogueIndex];
    const speakerText = this.dialogueOverlay.getAt(1) as Phaser.GameObjects.Text;
    const dialogueText = this.dialogueOverlay.getAt(2) as Phaser.GameObjects.Text;

    const speakerColors: Record<string, string> = {
      'Veer': '#e8a87c', 'Hana': '#ffb7c5', 'Nirvani': '#9370db', 'Narrator': '#808080',
    };

    speakerText.setText(line.speaker);
    speakerText.setColor(speakerColors[line.speaker] || '#ffd700');
    dialogueText.setText('');

    // Cancel only the dialogue typewriter timer, NOT all timers
    if (this.dialogueTimer) {
      this.dialogueTimer.remove();
      this.dialogueTimer = null;
    }

    const chars = line.text.split('');
    let idx = 0;
    this.dialogueTimer = this.time.addEvent({
      delay: 25, repeat: chars.length - 1,
      callback: () => {
        if (idx < chars.length) {
          dialogueText.setText(dialogueText.text + chars[idx++]);
        }
      },
    });
  }

  private advanceDialogue(): void {
    this.dialogueIndex++;
    if (this.dialogueIndex >= this.dialogueLines.length) this.endDialogue();
    else this.showDialogueLine();
  }

  private endDialogue(): void {
    this.dialogueActive = false;
    this.dialogueOverlay.setVisible(false);
    // Clean up dialogue timer
    if (this.dialogueTimer) {
      this.dialogueTimer.remove();
      this.dialogueTimer = null;
    }
    if (this._dialogueOnComplete) { this._dialogueOnComplete(); this._dialogueOnComplete = null; }
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const ft = this.add.text(x, y, text, {
      fontSize: '14px', fontFamily: 'monospace', fontStyle: 'bold',
      color, stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({ targets: ft, y: y - 40, alpha: 0, duration: 1200, onComplete: () => ft.destroy() });
  }
}
