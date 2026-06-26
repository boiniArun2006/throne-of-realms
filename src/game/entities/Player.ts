// ============================================================
// THRONE OF REALMS — Player Entity (Real Assets)
// Uses Martial Hero sprite sheets by LuizMelo (CC0)
// Side-scrolling hack-and-slash with combo system
// ============================================================

import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_JUMP_FORCE, PLAYER_ATTACK_DURATION, PLAYER_HURT_DURATION, PLAYER_INVINCIBLE_DURATION, PLAYER_BASE_HP, PLAYER_BASE_ATTACK, PLAYER_ATTACK_RANGE, SCENES } from '../constants';
import { ASSET_KEYS, ANIMATIONS } from '../AssetManifest';
import { PlayerState, Direction } from '../types';

export class Player extends Phaser.GameObjects.Container {
  // --- Sprite ---
  public sprite!: Phaser.GameObjects.Sprite;

  // --- State ---
  public state: PlayerState = 'idle';
  public facing: Direction = 'right';
  public isTransformed: boolean = false;
  public isAttacking: boolean = false;
  public isHurt: boolean = false;
  public isInvincible: boolean = false;
  public isDead: boolean = false;

  // --- Stats ---
  public hp: number = PLAYER_BASE_HP;
  public maxHp: number = PLAYER_BASE_HP;
  public attack: number = PLAYER_BASE_ATTACK;

  // --- Physics ---
  public body!: Phaser.Physics.Arcade.Body;

  // --- Input ---
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private attackKey!: Phaser.Input.Keyboard.Key;
  private interactKey!: Phaser.Input.Keyboard.Key;

  // --- Attack hitbox ---
  private attackHitbox!: Phaser.GameObjects.Rectangle;

  // --- Timers ---
  private attackTimer: number = 0;
  private hurtTimer: number = 0;
  private invincibleTimer: number = 0;

  // --- Combo ---
  private comboCount: number = 0;
  private comboTimer: number = 0;
  private nextAttack: number = 1; // alternates between attack1 and attack2

  // --- Events ---
  public events: Phaser.Events.EventEmitter;

  // --- Player scale (Martial Hero sprites are 200px tall, we scale down) ---
  private readonly SPRITE_SCALE = 0.45;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.events = new Phaser.Events.EventEmitter();

    // Create animated sprite
    this.sprite = scene.add.sprite(0, 0, ASSET_KEYS.PLAYER_IDLE);
    this.sprite.setScale(this.SPRITE_SCALE);
    this.sprite.setOrigin(0.5, 0.85);
    this.sprite.play(ANIMATIONS.player_idle.key);
    this.add(this.sprite);

    // Attack hitbox (invisible)
    this.attackHitbox = scene.add.rectangle(30, -20, PLAYER_ATTACK_RANGE, 40, 0xff0000, 0) as Phaser.GameObjects.Rectangle;
    this.add(this.attackHitbox);
    scene.physics.add.existing(this.attackHitbox, false);
    const hitboxBody = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hitboxBody.setAllowGravity(false);
    hitboxBody.enable = false;

    // Physics body
    scene.physics.add.existing(this);
    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(30, 70);
    this.body.setOffset(-15, -60);
    this.body.setCollideWorldBounds(true);
    this.body.setGravityY(800);

    // Input
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
      this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
      this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', () => {
        this.handleAttack();
      });
    }

    scene.add.existing(this);
  }

  update(time: number, delta: number): void {
    if (this.isDead) return;

    // --- Timers ---
    if (this.isAttacking) {
      this.attackTimer -= delta;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
        this.attackHitbox.body.enable = false;
      }
    }

    if (this.isHurt) {
      this.hurtTimer -= delta;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
      }
    }

    if (this.isInvincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.setAlpha(1);
      } else {
        this.setAlpha(Math.sin(time / 50) > 0 ? 1 : 0.3);
      }
    }

    // Combo timer
    if (this.comboCount > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.nextAttack = 1;
      }
    }

    // --- Movement ---
    if (!this.isAttacking && !this.isHurt) {
      this.handleMovement();
    }

    // --- Attack input ---
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.handleAttack();
    }

    // --- Interact input ---
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.events.emit('interact');
    }

    // --- Update animation ---
    this.updateAnimation();

    // --- Update attack hitbox position ---
    if (this.isAttacking) {
      const hitboxX = this.facing === 'right' ? 30 : -30;
      this.attackHitbox.setX(hitboxX);
    }
  }

  private handleMovement(): void {
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const jump = this.cursors.up.isDown || this.wasd.W.isDown;

    if (left) {
      this.body.setVelocityX(-PLAYER_SPEED);
      this.facing = 'left';
      this.sprite.setFlipX(true);
      this.state = 'walk';
    } else if (right) {
      this.body.setVelocityX(PLAYER_SPEED);
      this.facing = 'right';
      this.sprite.setFlipX(false);
      this.state = 'walk';
    } else {
      this.body.setVelocityX(0);
      this.state = 'idle';
    }

    // Jump
    if (jump && this.body.touching.down) {
      this.body.setVelocityY(PLAYER_JUMP_FORCE);
      this.state = 'jump';
    }

    // Flip attack hitbox direction
    const hitboxX = this.facing === 'right' ? 30 : -30;
    this.attackHitbox.setX(hitboxX);
  }

  private handleAttack(): void {
    if (this.isAttacking || this.isHurt || this.isDead) return;

    this.isAttacking = true;
    this.attackTimer = PLAYER_ATTACK_DURATION;
    this.state = 'attack';

    // Enable attack hitbox
    this.attackHitbox.body.enable = true;

    // Combo system
    this.comboCount++;
    this.comboTimer = 600;

    // Calculate combo damage
    const comboMultiplier = Math.min(this.comboCount, 3);
    const damage = this.attack * (1 + (comboMultiplier - 1) * 0.3);

    // Alternate attack animations
    const attackAnimKey = this.nextAttack === 1
      ? ANIMATIONS.player_attack1.key
      : ANIMATIONS.player_attack2.key;

    this.sprite.play(attackAnimKey);
    this.nextAttack = this.nextAttack === 1 ? 2 : 1;

    // Emit attack event
    this.events.emit('attack', {
      damage,
      combo: this.comboCount,
      facing: this.facing,
      hitbox: this.attackHitbox,
    });

    // Screen shake on combo
    if (this.comboCount >= 2) {
      this.scene.cameras.main.shake(50 + this.comboCount * 25, 0.003 + this.comboCount * 0.002);
    }

    // Reset after attack animation
    this.sprite.on('animationcomplete', (anim: Phaser.Animations.Animation) => {
      if (anim.key.includes('attack')) {
        this.isAttacking = false;
        this.attackHitbox.body.enable = false;
        if (this.state === 'attack') {
          this.state = 'idle';
        }
      }
    });
  }

  public takeDamage(amount: number, knockbackDirection: Direction = 'left'): void {
    if (this.isInvincible || this.isDead) return;

    this.hp -= amount;
    this.isHurt = true;
    this.hurtTimer = PLAYER_HURT_DURATION;
    this.isInvincible = true;
    this.invincibleTimer = PLAYER_INVINCIBLE_DURATION;

    // Knockback
    const knockback = knockbackDirection === 'right' ? 150 : -150;
    this.body.setVelocity(knockback, -200);

    // Play hurt animation
    this.sprite.play(ANIMATIONS.player_hurt.key);
    this.scene.cameras.main.shake(100, 0.005);

    this.events.emit('hurt', { hp: this.hp, maxHp: this.maxHp });

    if (this.hp <= 0) {
      this.die();
    }
  }

  public heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.events.emit('heal', { hp: this.hp, maxHp: this.maxHp });
  }

  public transform(): void {
    if (this.isTransformed) return;
    this.isTransformed = true;

    this.attack = Math.floor(PLAYER_BASE_ATTACK * 1.5);
    this.maxHp = Math.floor(PLAYER_BASE_HP * 1.3);
    this.hp = this.maxHp;

    // Visual feedback — golden tint overlay
    this.sprite.setTint(0xffd700);
    this.scene.cameras.main.flash(500, 255, 215, 0);
    this.scene.cameras.main.shake(300, 0.01);

    // Remove tint after a moment (keep subtle glow)
    this.scene.time.delayedCall(1000, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
        this.sprite.setTint(0xffeebb); // Slight golden tone
      }
    });

    this.events.emit('transform', { hp: this.hp, maxHp: this.maxHp, attack: this.attack });
  }

  private die(): void {
    this.isDead = true;
    this.state = 'die';
    this.body.setVelocity(0, 0);
    this.body.enable = false;

    this.sprite.play(ANIMATIONS.player_death.key);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y - 20,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        this.events.emit('death');
      },
    });
  }

  private updateAnimation(): void {
    if (this.isDead || this.isHurt || this.isAttacking) return;

    if (this.state === 'idle') {
      if (this.sprite.anims.currentAnim?.key !== ANIMATIONS.player_idle.key) {
        this.sprite.play(ANIMATIONS.player_idle.key);
      }
    } else if (this.state === 'walk') {
      if (this.sprite.anims.currentAnim?.key !== ANIMATIONS.player_run.key) {
        this.sprite.play(ANIMATIONS.player_run.key);
      }
    } else if (this.state === 'jump') {
      if (this.sprite.anims.currentAnim?.key !== ANIMATIONS.player_jump.key) {
        this.sprite.play(ANIMATIONS.player_jump.key);
      }
    }
  }

  getAttackHitbox(): Phaser.GameObjects.Rectangle {
    return this.attackHitbox;
  }

  isOnGround(): boolean {
    return this.body.touching.down;
  }

  destroy(fromScene?: boolean): void {
    this.events.destroy();
    super.destroy(fromScene);
  }
}
