# 🎮 Throne of Realms — The Unlikely Hero

A 2D side-scrolling action-adventure game mixing Indian and Japanese mythology with comedy.

## 🗡️ Story
Veer is an orphan nobody believes in — until a bathroom portal transforms him into a divine warrior. Each bathroom visit plunges him into mythological dungeons where he must defeat enemies, earn divine weapons, and save the world of Avani. He just wants to use the bathroom in peace.

## 🎯 Features
- **Combat System**: Combo attacks with screen shake + hit effects
- **6 Dungeon Realms**: Agni's Furnace, Susanoo's Storm, Yama's Underworld, Amaterasu's Light, Shiva's Tandava, Tsukuyomi's Eclipse
- **Bathroom Portal Mechanic**: Comedy meets gameplay
- **Epic Soundtrack**: 5 scene-specific music tracks + 10+ SFX
- **Pixel Art Style**: Professional CC0 sprites and tilesets
- **Android Ready**: Capacitor + touch controls

## 🎮 Controls
| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move | Arrow Keys / WASD | D-Pad |
| Attack | Z / Space | ATK Button |
| Interact | X | INT Button |

## 🛠️ Tech Stack
- **Engine**: Phaser 4.2.0 (WebGL)
- **Framework**: Next.js 16 + TypeScript
- **State**: Zustand
- **Android**: Capacitor
- **CI/CD**: GitHub Actions → Android APK

## 📦 Build Android APK
```bash
bun install
bun run build
npx cap sync
npx cap open android
```

## 📜 License
GPL-3.0 — See [LICENSE](./LICENSE) for details. Third-party assets under their respective licenses.
