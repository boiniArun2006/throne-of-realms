// ============================================================
// THRONE OF REALMS — Main Menu Scene
// Epic title screen with animated background
// ============================================================

import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, GAME_TITLE, GAME_SUBTITLE, COLORS } from '../constants';

export class MenuScene extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private startButton!: Phaser.GameObjects.Container;
  private particles: Phaser.GameObjects.Graphics[] = [];
  private bgStars: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];
  private portalAngle: number = 0;

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    // --- Background ---
    const bg = this.add.graphics();
    // Gradient sky (dark to deep blue)
    for (let y = 0; y < GAME_HEIGHT; y++) {
      const ratio = y / GAME_HEIGHT;
      const r = Math.floor(10 + ratio * 15);
      const g = Math.floor(10 + ratio * 20);
      const b = Math.floor(30 + ratio * 50);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, y, GAME_WIDTH, 1);
    }
    bg.setDepth(0);

    // --- Floating particles (star field) ---
    for (let i = 0; i < 60; i++) {
      this.bgStars.push({
        x: Phaser.Math.Between(0, GAME_WIDTH),
        y: Phaser.Math.Between(0, GAME_HEIGHT),
        speed: Phaser.Math.FloatBetween(0.2, 1.0),
        size: Phaser.Math.Between(1, 3),
        alpha: Phaser.Math.FloatBetween(0.3, 1.0),
      });
    }

    // --- Portal animation in background ---
    this.createPortalEffect(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

    // --- Title Text ---
    this.titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, GAME_TITLE, {
      fontSize: '48px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#8b4513',
      strokeThickness: 4,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 8,
        fill: true,
      },
    }).setOrigin(0.5).setDepth(10);

    // --- Subtitle ---
    this.subtitleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 35, GAME_SUBTITLE, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#e0b0ff',
      stroke: '#4a0080',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    // --- Start Button ---
    this.createStartButton();

    // --- Controls hint ---
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, 'Controls: Arrow Keys / WASD to Move  |  Z / Space to Attack  |  X to Interact', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#808080',
    }).setOrigin(0.5).setDepth(10);

    // --- Version ---
    this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 10, 'v0.1.0-alpha', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#505050',
    }).setOrigin(1).setDepth(10);

    // --- Keyboard input ---
    this.input.keyboard?.on('keydown-SPACE', () => this.startGame());
    this.input.keyboard?.on('keydown-ENTER', () => this.startGame());
  }

  update(_time: number, delta: number): void {
    // Animate stars
    const starGraphics = this.add.graphics();
    starGraphics.setDepth(1);
    for (const star of this.bgStars) {
      star.y += star.speed * (delta / 16);
      if (star.y > GAME_HEIGHT) {
        star.y = 0;
        star.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
      starGraphics.fillStyle(0xffffff, star.alpha * (0.5 + 0.5 * Math.sin(_time / 1000 + star.x)));
      starGraphics.fillCircle(star.x, star.y, star.size);
    }

    // Portal rotation
    this.portalAngle += delta * 0.002;

    // Title pulse effect
    const pulse = 1 + 0.03 * Math.sin(_time / 500);
    this.titleText.setScale(pulse);

    // Subtitle shimmer
    const shimmer = 0.7 + 0.3 * Math.sin(_time / 800);
    this.subtitleText.setAlpha(shimmer);

    // Clean up old particles
    this.particles.forEach(p => p.destroy());
    this.particles = [];

    // Add portal particles
    if (Phaser.Math.Between(0, 3) === 0) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(40, 80);
      const px = GAME_WIDTH / 2 + Math.cos(angle) * dist;
      const py = GAME_HEIGHT / 2 - 30 + Math.sin(angle) * dist;
      const particle = this.add.graphics();
      particle.fillStyle(0xe0b0ff, 0.6);
      particle.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      particle.setPosition(px, py);
      particle.setDepth(2);
      this.particles.push(particle);

      this.tweens.add({
        targets: particle,
        alpha: 0,
        y: py - 30,
        duration: 1000,
        onComplete: () => particle.destroy(),
      });
    }
  }

  private createPortalEffect(cx: number, cy: number): void {
    const portal = this.add.graphics();
    portal.setDepth(2);

    // Draw rotating portal rings
    const drawPortal = () => {
      portal.clear();
      for (let i = 0; i < 3; i++) {
        const angle = this.portalAngle + (i * Math.PI * 2) / 3;
        const radius = 60 + i * 15;
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius * 0.5;
        const x2 = cx + Math.cos(angle + 1) * radius;
        const y2 = cy + Math.sin(angle + 1) * radius * 0.5;

        portal.lineStyle(2, 0x8a2be2, 0.3 + i * 0.15);
        portal.beginPath();
        portal.arc(cx, cy, radius, angle, angle + 2);
        portal.strokePath();
      }
      // Center glow
      portal.fillStyle(0xe0b0ff, 0.15 + 0.05 * Math.sin(this.portalAngle * 3));
      portal.fillCircle(cx, cy, 40);
    };

    // Redraw portal each frame in update
    this.events.on('update', drawPortal);
    drawPortal();
  }

  private createStartButton(): void {
    const btnX = GAME_WIDTH / 2;
    const btnY = GAME_HEIGHT / 2 + 40;

    // Button background
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x2c3e50, 0.8);
    btnBg.fillRoundedRect(-80, -20, 160, 40, 8);
    btnBg.lineStyle(2, 0xffd700, 1);
    btnBg.strokeRoundedRect(-80, -20, 160, 40, 8);

    // Button text
    const btnText = this.add.text(0, 0, 'START QUEST', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.startButton = this.add.container(btnX, btnY, [btnBg, btnText]);
    this.startButton.setDepth(10);
    this.startButton.setSize(160, 40);
    this.startButton.setInteractive();

    // Hover effects
    this.startButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.startButton,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 100,
      });
      btnText.setColor('#ffffff');
    });

    this.startButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.startButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
      btnText.setColor('#ffd700');
    });

    this.startButton.on('pointerdown', () => this.startGame());
  }

  private startGame(): void {
    // Flash effect
    const flash = this.add.graphics();
    flash.fillStyle(0xffffff, 1);
    flash.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    flash.setDepth(100);
    flash.setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: 1 },
      duration: 200,
      yoyo: true,
      onComplete: () => {
        flash.destroy();
        this.scene.start(SCENES.HUB);
        this.scene.launch(SCENES.HUD);
      },
    });
  }
}
