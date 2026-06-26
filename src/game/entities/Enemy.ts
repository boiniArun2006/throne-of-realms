// ============================================================
// THRONE OF REALMS — Enemy Entity (Real Assets)
// Uses Kenney Platformer sprites + Dungeon Crawl Stone Soup
// ============================================================

import Phaser from 'phaser';
import { EnemyType } from '../types';
import { COLORS } from '../constants';

interface EnemyConfig {
  type: EnemyType;
  hp: number;
  attack: number;
  speed: number;
  textureKey: string;
  size: { width: number; height: number };
  attackRange: number;
  xpReward: number;
  spriteScale: number;
  animKey?: string;
}

const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  slime: {
    type: 'slime',
    hp: 20,
    attack: 5,
    speed: 40,
    textureKey: 'slime_walk1',
    size: { width: 24, height: 20 },
    attackRange: 30,
    xpReward: 10,
    spriteScale: 1.2,
    animKey: 'slime_walk',
  },
  skeleton: {
    type: 'skeleton',
    hp: 35,
    attack: 10,
    speed: 50,
    textureKey: 'skeleton_enemy',
    size: { width: 24, height: 32 },
    attackRange: 40,
    xpReward: 20,
    spriteScale: 1.5,
  },
  demon: {
    type: 'demon',
    hp: 50,
    attack: 15,
    speed: 60,
    textureKey: 'demon_enemy',
    size: { width: 28, height: 36 },
    attackRange: 45,
    xpReward: 35,
    spriteScale: 1.8,
  },
  yokai: {
    type: 'yokai',
    hp: 30,
    attack: 12,
    speed: 70,
    textureKey: 'yokai_enemy',
    size: { width: 24, height: 26 },
    attackRange: 50,
    xpReward: 25,
    spriteScale: 1.5,
  },
  boss: {
    type: 'boss',
    hp: 200,
    attack: 25,
    speed: 30,
    textureKey: 'boss_enemy',
    size: { width: 48, height: 60 },
    attackRange: 60,
    xpReward: 100,
    spriteScale: 2.5,
  },
};

export class Enemy extends Phaser.GameObjects.Container {
  public sprite!: Phaser.GameObjects.Sprite;
  public config: EnemyConfig;
  public hp: number;
  public maxHp: number;
  public isAlive: boolean = true;
  public isAttacking: boolean = false;
  public isHurt: boolean = false;
  public facing: 'left' | 'right' = 'left';
  public enemyType: EnemyType;

  private body!: Phaser.Physics.Arcade.Body;
  private hurtTimer: number = 0;
  private attackCooldown: number = 0;
  private aiState: 'patrol' | 'chase' | 'attack' | 'retreat' = 'patrol';
  private patrolOriginX: number;
  private patrolRange: number = 100;
  private patrolDirection: number = 1;
  private playerRef: Phaser.GameObjects.Container | null = null;
  private healthBar!: Phaser.GameObjects.Graphics;
  private detectRange: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, type: EnemyType, playerRef?: Phaser.GameObjects.Container) {
    super(scene, x, y);
    this.config = ENEMY_CONFIGS[type];
    this.hp = this.config.hp;
    this.maxHp = this.config.hp;
    this.enemyType = type;
    this.patrolOriginX = x;
    this.playerRef = playerRef || null;

    // Create sprite — use animation if available, else static image
    if (this.config.animKey) {
      this.sprite = scene.add.sprite(0, 0, this.config.textureKey);
      this.sprite.play(this.config.animKey);
    } else {
      this.sprite = scene.add.sprite(0, 0, this.config.textureKey);
    }

    this.sprite.setScale(this.config.spriteScale);
    this.sprite.setOrigin(0.5, 0.85);
    this.add(this.sprite);

    // Health bar
    this.healthBar = scene.add.graphics();
    this.add(this.healthBar);
    this.drawHealthBar();

    // Physics
    scene.physics.add.existing(this);
    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.config.size.width, this.config.size.height);
    this.body.setOffset(-this.config.size.width / 2, -this.config.size.height);
    this.body.setCollideWorldBounds(true);
    // Gravity is now set globally in game config (y: 800)

    this.setDepth(5);
    scene.add.existing(this);
  }

  update(time: number, delta: number): void {
    if (!this.isAlive) return;

    // Hurt recovery
    if (this.isHurt) {
      this.hurtTimer -= delta;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
        this.setAlpha(1);
        this.sprite.clearTint();
      }
      return;
    }

    // Attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }

    // AI
    this.updateAI(delta);
  }

  private updateAI(delta: number): void {
    if (!this.playerRef) {
      this.patrol(delta);
      return;
    }

    const distToPlayer = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.playerRef.x, this.playerRef.y
    );

    if (distToPlayer <= this.config.attackRange && this.attackCooldown <= 0) {
      this.aiState = 'attack';
    } else if (distToPlayer <= this.detectRange) {
      this.aiState = 'chase';
    } else {
      this.aiState = 'patrol';
    }

    switch (this.aiState) {
      case 'patrol':
        this.patrol(delta);
        break;
      case 'chase':
        this.chase();
        break;
      case 'attack':
        this.attackPlayer();
        break;
    }
  }

  private patrol(delta: number): void {
    this.body.setVelocityX(this.config.speed * 0.5 * this.patrolDirection);

    if (this.x > this.patrolOriginX + this.patrolRange) {
      this.patrolDirection = -1;
      this.facing = 'left';
      this.sprite.setFlipX(false);
    } else if (this.x < this.patrolOriginX - this.patrolRange) {
      this.patrolDirection = 1;
      this.facing = 'right';
      this.sprite.setFlipX(true);
    }
  }

  private chase(): void {
    if (!this.playerRef) return;
    const direction = this.playerRef.x > this.x ? 1 : -1;
    this.body.setVelocityX(this.config.speed * direction);
    this.facing = direction > 0 ? 'right' : 'left';
    this.sprite.setFlipX(direction > 0);
  }

  private attackPlayer(): void {
    if (!this.playerRef || this.attackCooldown > 0) return;

    this.isAttacking = true;
    this.body.setVelocityX(0);
    this.attackCooldown = 1500;

    const direction = this.playerRef.x > this.x ? 1 : -1;
    this.facing = direction > 0 ? 'right' : 'left';
    this.sprite.setFlipX(direction > 0);

    // Attack flash (red tint)
    this.sprite.setTint(0xff4444);
    this.scene.time.delayedCall(200, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
      }
      this.isAttacking = false;
    });
  }

  public takeDamage(amount: number, knockbackDir: 'left' | 'right' = 'left'): void {
    if (!this.isAlive) return;

    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = 300;

    // Knockback
    const knockback = knockbackDir === 'right' ? 120 : -120;
    this.body.setVelocity(knockback, -100);

    // Flash white
    this.setAlpha(0.5);
    this.sprite.setTint(0xffffff);

    this.drawHealthBar();

    if (this.hp <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.isAlive = false;
    this.hp = 0;

    // Death particle burst
    this.spawnDeathParticles();

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      y: this.y - 15,
      duration: 500,
      ease: 'Power2',
      onComplete: () => this.destroy(),
    });
  }

  private spawnDeathParticles(): void {
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.graphics();
      const color = this.getEnemyColor();
      particle.fillStyle(color, 0.8);
      particle.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      particle.setPosition(this.x + Phaser.Math.Between(-15, 15), this.y + Phaser.Math.Between(-30, 0));
      particle.setDepth(20);

      this.scene.tweens.add({
        targets: particle,
        alpha: 0,
        y: particle.y - Phaser.Math.Between(20, 60),
        x: particle.x + Phaser.Math.Between(-40, 40),
        duration: Phaser.Math.Between(400, 800),
        onComplete: () => particle.destroy(),
      });
    }
  }

  private getEnemyColor(): number {
    switch (this.enemyType) {
      case 'slime': return 0x50c878;
      case 'skeleton': return 0xf5f5dc;
      case 'demon': return 0xdc143c;
      case 'yokai': return 0x9932cc;
      case 'boss': return 0xff0000;
      default: return 0xffffff;
    }
  }

  private drawHealthBar(): void {
    this.healthBar.clear();
    const barWidth = this.config.size.width + 14;
    const barHeight = 4;
    const yOffset = -this.config.size.height - 10;

    this.healthBar.fillStyle(0x2c3e50, 0.8);
    this.healthBar.fillRect(-barWidth / 2, yOffset, barWidth, barHeight);

    const healthPercent = Math.max(0, this.hp / this.maxHp);
    const healthColor = healthPercent > 0.5 ? 0x2ecc71 : healthPercent > 0.25 ? 0xf39c12 : 0xe74c3c;
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(-barWidth / 2, yOffset, barWidth * healthPercent, barHeight);

    this.healthBar.lineStyle(1, 0xecf0f1, 0.5);
    this.healthBar.strokeRect(-barWidth / 2, yOffset, barWidth, barHeight);
  }

  canDealDamage(): boolean {
    return this.isAlive && this.isAttacking && this.attackCooldown > 1200;
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
