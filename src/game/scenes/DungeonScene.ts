// ============================================================
// THRONE OF REALMS — Dungeon Scene (Real Assets)
// Uses 0x72 DungeonTileset II + Dungeon Crawl Stone Soup
// Side-scrolling combat dungeon with themed environments
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, COLORS } from '../constants';
import { DungeonRealm } from '../types';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { DUNGEON_CONFIGS } from '../data/dungeons';
import { DIALOGUES } from '../data/dialogues';
import { useGameState } from '../GameState';
import { ASSET_KEYS, ANIMATIONS } from '../AssetManifest';
import { MusicManager } from '../systems/MusicManager';

const GROUND_Y = 460;

export class DungeonScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private boss: Enemy | null = null;
  private realm!: DungeonRealm;
  private dungeonConfig: any;
  private exitPortal!: Phaser.GameObjects.Sprite;
  private dungeonComplete: boolean = false;
  private musicManager!: MusicManager;

  // Dialogue
  private dialogueActive: boolean = false;
  private dialogueOverlay!: Phaser.GameObjects.Container;
  private dialogueLines: { speaker: string; text: string }[] = [];
  private dialogueIndex: number = 0;
  private _dialogueOnComplete: (() => void) | null = null;

  constructor() {
    super({ key: SCENES.DUNGEON });
  }

  init(data: { realm: DungeonRealm; fromBathroom?: boolean }): void {
    this.realm = data.realm;
    this.dungeonConfig = DUNGEON_CONFIGS[data.realm];
    this.enemies = [];
    this.boss = null;
    this.dungeonComplete = false;
    this.dialogueActive = false;
  }

  create(): void {
    const gameState = useGameState.getState();
    gameState.setCurrentScene(SCENES.DUNGEON);

    // --- Music ---
    this.musicManager = new MusicManager(this);
    this.musicManager.play('music_dungeon', { volume: 0.25, loop: true });

    // --- Background ---
    this.createDungeonBackground();

    // --- World bounds ---
    this.physics.world.setBounds(0, 0, this.dungeonConfig.width, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.dungeonConfig.width, GAME_HEIGHT);

    // --- Layout ---
    this.createDungeonLayout();

    // --- Enemies ---
    this.spawnEnemies();

    // --- Exit Portal ---
    this.createExitPortal();

    // --- Player ---
    this.player = new Player(this, 100, GROUND_Y - 40);
    if (!this.player.isTransformed) {
      this.player.transform();
    }

    // --- Camera ---
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // --- Collisions ---
    this.setupCollisions();

    // --- Launch HUD ---
    this.scene.launch(SCENES.HUD);

    // --- Dialogue overlay ---
    this.createDialogueOverlay();

    // --- Intro dialogue ---
    if (gameState.dungeonAttempt >= 2 && !gameState.dialogueFlags.met_nirvani) {
      this.time.delayedCall(1000, () => {
        this.startDialogue(DIALOGUES.meet_nirvani.lines, () => {
          gameState.setDialogueFlag('met_nirvani', true);
        });
      });
    } else {
      this.time.delayedCall(500, () => {
        this.startDialogue([
          { speaker: 'Veer', text: `This place... ${this.dungeonConfig.name}.` },
          { speaker: 'Veer', text: 'I need to clear these enemies to close this dungeon!' },
        ]);
      });
    }

    // --- Keyboard for dialogue ---
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.dialogueActive) this.advanceDialogue();
    });
    this.input.keyboard?.on('keydown-X', () => {
      if (this.dialogueActive) this.advanceDialogue();
    });
  }

  update(time: number, delta: number): void {
    if (this.dialogueActive) {
      this.player.body.setVelocityX(0);
      return;
    }

    this.player.update(time, delta);

    for (const enemy of this.enemies) {
      if (enemy.isAlive) enemy.update(time, delta);
    }

    this.enemies = this.enemies.filter(e => e.isAlive || e.active);

    const aliveEnemies = this.enemies.filter(e => e.isAlive);
    const bossDefeated = this.boss ? !this.boss.isAlive : true;

    if (!this.dungeonComplete && aliveEnemies.length === 0 && bossDefeated) {
      this.onDungeonCleared();
    }

    if (this.exitPortal && this.exitPortal.active && this.dungeonComplete) {
      this.exitPortal.setAngle(Math.sin(time / 300) * 3);
      this.exitPortal.setAlpha(0.8 + 0.2 * Math.sin(time / 200));
    }
  }

  // ============================================================
  // DUNGEON BACKGROUND
  // ============================================================
  private createDungeonBackground(): void {
    const bg = this.add.graphics();
    const topColor = this.dungeonConfig.bgColors.top;
    const bottomColor = this.dungeonConfig.bgColors.bottom;

    for (let y = 0; y < GAME_HEIGHT; y++) {
      const ratio = y / GAME_HEIGHT;
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.IntegerToColor(topColor),
        Phaser.Display.Color.IntegerToColor(bottomColor),
        100, Math.floor(ratio * 100)
      );
      bg.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
      bg.fillRect(0, y, this.dungeonConfig.width, 1);
    }
    bg.setDepth(0);
    bg.setScrollFactor(0.8, 0);

    // Atmospheric effects
    this.createAtmosphericEffects();
  }

  private createAtmosphericEffects(): void {
    const tileColors = this.dungeonConfig.tileColors;

    // Floating particles based on realm theme
    for (let i = 0; i < 15; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(tileColors.accent, 0.4);
      particle.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      particle.setPosition(
        Phaser.Math.Between(0, this.dungeonConfig.width),
        Phaser.Math.Between(0, GAME_HEIGHT)
      );
      particle.setDepth(2);

      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(30, 80),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          particle.setPosition(Phaser.Math.Between(0, this.dungeonConfig.width), GAME_HEIGHT);
          particle.setAlpha(0.4);
        },
      });
    }
  }

  // ============================================================
  // DUNGEON LAYOUT
  // ============================================================
  private createDungeonLayout(): void {
    this.platforms = this.physics.add.staticGroup();
    const tileColors = this.dungeonConfig.tileColors;
    const width = this.dungeonConfig.width;

    // --- Ground ---
    const groundGfx = this.add.graphics();
    groundGfx.fillStyle(tileColors.ground, 1);
    groundGfx.fillRect(0, GROUND_Y, width, GAME_HEIGHT - GROUND_Y);
    groundGfx.setDepth(3);

    // Ground top edge highlight
    groundGfx.fillStyle(tileColors.accent, 0.5);
    groundGfx.fillRect(0, GROUND_Y, width, 4);
    groundGfx.setDepth(3);

    // Ground physics body
    const groundBody = this.add.rectangle(width / 2, GROUND_Y + 80, width, 160, 0x000000, 0);
    this.platforms.add(groundBody);

    // --- Platforms (procedural) ---
    const platformPatterns = this.generatePlatformLayout();
    for (const plat of platformPatterns) {
      const platGfx = this.add.graphics();
      platGfx.fillStyle(tileColors.platform, 1);
      platGfx.fillRect(0, 0, plat.width, 12);
      platGfx.fillStyle(tileColors.accent, 0.5);
      platGfx.fillRect(0, 0, plat.width, 3);
      platGfx.lineStyle(1, tileColors.decoration, 0.3);
      platGfx.strokeRect(0, 0, plat.width, 12);
      platGfx.generateTexture(`dng_plat_${plat.x}_${plat.y}`, plat.width, 12);
      platGfx.destroy();

      const platform = this.add.image(plat.x + plat.width / 2, plat.y + 6, `dng_plat_${plat.x}_${plat.y}`);
      platform.setDepth(5);
      this.platforms.add(platform);
    }

    // --- Decorations ---
    this.createDungeonDecorations();

    // --- Walls ---
    const leftWall = this.add.rectangle(0, GAME_HEIGHT / 2, 16, GAME_HEIGHT, tileColors.platform);
    this.platforms.add(leftWall);
    const rightWall = this.add.rectangle(width, GAME_HEIGHT / 2, 16, GAME_HEIGHT, tileColors.platform);
    this.platforms.add(rightWall);
  }

  private generatePlatformLayout(): { x: number; y: number; width: number }[] {
    const platforms: { x: number; y: number; width: number }[] = [];
    const width = this.dungeonConfig.width;
    const sectionWidth = 300;

    for (let section = 0; section < width / sectionWidth; section++) {
      const baseX = section * sectionWidth + 50;
      const numPlats = Phaser.Math.Between(1, 3);
      for (let i = 0; i < numPlats; i++) {
        const platWidth = Phaser.Math.Between(3, 7) * TILE_SIZE;
        const platX = baseX + Phaser.Math.Between(0, 150);
        const platY = GROUND_Y - Phaser.Math.Between(80, 220);
        const overlaps = platforms.some(p => Math.abs(p.x - platX) < 60 && Math.abs(p.y - platY) < 40);
        if (!overlaps) platforms.push({ x: platX, y: platY, width: platWidth });
      }
    }
    return platforms;
  }

  private createDungeonDecorations(): void {
    const tileColors = this.dungeonConfig.tileColors;
    const width = this.dungeonConfig.width;

    // Pillars
    for (let x = 150; x < width - 150; x += 200) {
      const pillar = this.add.graphics();
      pillar.fillStyle(tileColors.decoration, 0.5);
      pillar.fillRect(x - 8, GROUND_Y - 100, 16, 100);
      pillar.fillStyle(tileColors.accent, 0.6);
      pillar.fillRect(x - 12, GROUND_Y - 108, 24, 12);
      pillar.setDepth(4);
    }

    // Torches with glow
    for (let x = 100; x < width; x += 150) {
      const torch = this.add.graphics();
      torch.fillStyle(0x654321, 1);
      torch.fillRect(x - 2, GROUND_Y - 70, 4, 12);
      torch.fillStyle(tileColors.accent, 0.8);
      torch.fillCircle(x, GROUND_Y - 74, 4);
      torch.fillStyle(0xffff00, 0.5);
      torch.fillCircle(x, GROUND_Y - 76, 2);
      torch.setDepth(4);

      // Glow
      const glow = this.add.graphics();
      glow.fillStyle(tileColors.accent, 0.05);
      glow.fillCircle(x, GROUND_Y - 70, 30);
      glow.setDepth(2);
    }
  }

  // ============================================================
  // ENEMIES
  // ============================================================
  private spawnEnemies(): void {
    for (const spawn of this.dungeonConfig.enemySpawns) {
      for (let i = 0; i < spawn.count; i++) {
        const sp = spawn.spawnPoints[i % spawn.spawnPoints.length];
        const enemy = new Enemy(this, sp.x, GROUND_Y - 20, spawn.type, this.player as unknown as Phaser.GameObjects.Container);
        this.enemies.push(enemy);
        this.physics.add.collider(enemy, this.platforms);
      }
    }

    // Boss at the far end
    const bossX = this.dungeonConfig.width - 200;
    this.boss = new Enemy(this, bossX, GROUND_Y - 40, 'boss', this.player as unknown as Phaser.GameObjects.Container);
    this.enemies.push(this.boss);
    this.physics.add.collider(this.boss, this.platforms);
  }

  // ============================================================
  // COLLISION
  // ============================================================
  private setupCollisions(): void {
    this.physics.add.collider(this.player, this.platforms);

    this.player.events.on('attack', (data: { damage: number; combo: number; facing: string }) => {
      const hitbox = this.player.getAttackHitbox();
      for (const enemy of this.enemies) {
        if (!enemy.isAlive) continue;
        if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox.getBounds(), enemy.getBounds())) {
          const knockDir = data.facing === 'right' ? 'right' : 'left';
          enemy.takeDamage(data.damage, knockDir);
          this.spawnHitEffect(enemy.x, enemy.y - 20);
          if (data.combo >= 2) {
            this.showFloatingText(enemy.x, enemy.y - 60, `${data.combo}x COMBO!`, '#ffd700');
          }
        }
      }
    });

    // Enemy attacks
    this.time.addEvent({
      delay: 100, loop: true,
      callback: () => {
        for (const enemy of this.enemies) {
          if (!enemy.isAlive || !enemy.canDealDamage()) continue;
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
          if (dist < enemy.config.attackRange + 20) {
            const knockDir = enemy.x < this.player.x ? 'left' : 'right';
            this.player.takeDamage(enemy.config.attack, knockDir as any);
          }
        }
      },
    });
  }

  // ============================================================
  // DUNGEON COMPLETION
  // ============================================================
  private onDungeonCleared(): void {
    this.dungeonComplete = true;
    const gameState = useGameState.getState();

    // Switch to victory music
    this.musicManager.play('music_victory', { volume: 0.3, loop: false });

    this.exitPortal.setVisible(true);
    this.exitPortal.setPosition(this.dungeonConfig.width - 100, GROUND_Y - 40);
    this.cameras.main.flash(500, 255, 215, 0);

    this.time.delayedCall(800, () => {
      this.startDialogue([
        { speaker: 'Veer', text: 'That was INTENSE! I actually did it!' },
        { speaker: 'Veer', text: `I got the ${this.dungeonConfig.reward.name}!` },
        { speaker: 'Narrator', text: 'The dungeon seal weakens. The portal back to Avani opens.' },
      ], () => {
        gameState.completeDungeon(this.realm);
        gameState.unlockWeapon(this.dungeonConfig.reward);
      });
    });
  }

  private createExitPortal(): void {
    this.exitPortal = this.add.sprite(this.dungeonConfig.width - 100, GROUND_Y - 40, 'p1_stand');
    this.exitPortal.setScale(0.25);
    this.exitPortal.setTint(0xffd700);
    this.exitPortal.setDepth(6);
    this.exitPortal.setVisible(false);

    this.input.keyboard?.on('keydown-X', () => {
      if (!this.dungeonComplete) return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitPortal.x, this.exitPortal.y);
      if (dist < 60) this.exitDungeon();
    });
  }

  private exitDungeon(): void {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(600, () => {
      this.scene.stop(SCENES.HUD);
      this.scene.start(SCENES.HUB, { returningFromDungeon: true });
    });
  }

  // ============================================================
  // EFFECTS
  // ============================================================
  private spawnHitEffect(x: number, y: number): void {
    const effect = this.add.graphics();
    effect.fillStyle(0xffffff, 0.8);
    effect.fillCircle(0, 0, 8);
    effect.fillStyle(0xff0000, 0.5);
    effect.fillCircle(0, 0, 4);
    effect.setPosition(x, y);
    effect.setDepth(50);

    this.tweens.add({
      targets: effect, alpha: 0, scaleX: 2, scaleY: 2,
      duration: 200, onComplete: () => effect.destroy(),
    });
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const ft = this.add.text(x, y, text, {
      fontSize: '16px', fontFamily: 'monospace', fontStyle: 'bold',
      color, stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({ targets: ft, y: y - 40, alpha: 0, duration: 1000, onComplete: () => ft.destroy() });
  }

  // ============================================================
  // DIALOGUE
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

    const speaker = this.add.text(-GAME_WIDTH / 2 + 40, -40, '', {
      fontSize: '14px', fontFamily: 'monospace', fontStyle: 'bold', color: '#ffd700',
    });
    const text = this.add.text(-GAME_WIDTH / 2 + 40, -18, '', {
      fontSize: '13px', fontFamily: 'monospace', color: '#e0e0e0',
      wordWrap: { width: GAME_WIDTH - 100 },
    });
    const hint = this.add.text(GAME_WIDTH / 2 - 50, 32, '[X/Space]', {
      fontSize: '10px', fontFamily: 'monospace', color: '#808080',
    });

    this.dialogueOverlay.add([bg, speaker, text, hint]);
  }

  private startDialogue(lines: { speaker: string; text: string }[], onComplete?: () => void): void {
    this.dialogueActive = true;
    this.dialogueLines = lines;
    this.dialogueIndex = 0;
    this.dialogueOverlay.setVisible(true);
    this._dialogueOnComplete = onComplete || null;
    this.showDialogueLine();
  }

  private showDialogueLine(): void {
    if (this.dialogueIndex >= this.dialogueLines.length) { this.endDialogue(); return; }
    const line = this.dialogueLines[this.dialogueIndex];
    const speakerText = this.dialogueOverlay.getAt(1) as Phaser.GameObjects.Text;
    const dialogueText = this.dialogueOverlay.getAt(2) as Phaser.GameObjects.Text;
    const speakerColors: Record<string, string> = { 'Veer': '#e8a87c', 'Hana': '#ffb7c5', 'Nirvani': '#9370db', 'Narrator': '#808080' };
    speakerText.setText(line.speaker);
    speakerText.setColor(speakerColors[line.speaker] || '#ffd700');
    dialogueText.setText('');
    const chars = line.text.split('');
    let idx = 0;
    this.time.removeAllEvents();
    this.time.addEvent({ delay: 25, repeat: chars.length - 1, callback: () => { if (idx < chars.length) dialogueText.setText(dialogueText.text + chars[idx++]); } });
  }

  private advanceDialogue(): void {
    this.dialogueIndex++;
    if (this.dialogueIndex >= this.dialogueLines.length) this.endDialogue();
    else this.showDialogueLine();
  }

  private endDialogue(): void {
    this.dialogueActive = false;
    this.dialogueOverlay.setVisible(false);
    if (this._dialogueOnComplete) { this._dialogueOnComplete(); this._dialogueOnComplete = null; }
  }
}
