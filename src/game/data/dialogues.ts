// ============================================================
// THRONE OF REALMS — Dialogue Data
// Story sequences mixing epic action with bathroom comedy
// ============================================================

import { DialogueSequence } from '../types';

export const DIALOGUES: Record<string, DialogueSequence> = {
  // --- Opening: Veer wakes up in his half-constructed house ---
  game_intro: {
    id: 'game_intro',
    trigger: 'game_start',
    lines: [
      { speaker: 'Narrator', text: 'In the village of Avani, where Indian temples meet Japanese shrines...', emotion: 'neutral' },
      { speaker: 'Narrator', text: 'There lived a boy no one believed in. An orphan. A nobody.', emotion: 'sad' },
      { speaker: 'Veer', text: 'Ugh... another day of being invisible. Maybe today someone will actually look at me.', emotion: 'sad' },
      { speaker: 'Veer', text: "...Nah. Who am I kidding. Let me just go about my day.", emotion: 'neutral' },
      { speaker: 'Veer', text: "Wait... I need to use the bathroom first. Nature calls!", emotion: 'comedy' },
    ],
    onComplete: 'hub_free_roam',
  },

  // --- First bathroom entry ---
  first_bathroom: {
    id: 'first_bathroom',
    trigger: 'bathroom_enter_1',
    lines: [
      { speaker: 'Veer', text: 'Finally! Some peace and—', emotion: 'neutral' },
      { speaker: 'Veer', text: 'WH-WHAT IS HAPPENING?!', emotion: 'angry' },
      { speaker: 'Veer', text: "Why is everything glowing?! I'm just trying to use the bathroom!", emotion: 'comedy' },
      { speaker: 'Veer', text: "My body... it's... CHANGING! What's this golden light?!", emotion: 'angry' },
      { speaker: 'Narrator', text: 'The bathroom swirls with divine energy. Veer transforms — muscles surge, eyes glow, power awakens.', emotion: 'mysterious' },
      { speaker: 'Veer', text: "Okay... okay... I look different now. WAY different. Did that expired curry do this?!", emotion: 'comedy' },
      { speaker: 'Veer', text: "...Where am I? This is definitely NOT the bathroom.", emotion: 'neutral' },
    ],
    onComplete: 'first_dungeon_enter',
  },

  // --- Third dungeon attempt: meeting Nirvani ---
  meet_nirvani: {
    id: 'meet_nirvani',
    trigger: 'dungeon_attempt_3',
    lines: [
      { speaker: 'Narrator', text: 'Deep within the dungeon, a faint light appears. An old woman materializes from the shadows.', emotion: 'mysterious' },
      { speaker: 'Nirvani', text: 'So... you are the one who keeps falling through the toilet gates.', emotion: 'comedy' },
      { speaker: 'Veer', text: "Toilet gates?! They're BATHROOMS! And I didn't ASK to fall through them!", emotion: 'angry' },
      { speaker: 'Nirvani', text: 'Heh... you have fire in you, boy. More than you know.', emotion: 'mysterious' },
      { speaker: 'Nirvani', text: 'Listen carefully. These dungeons are portals to the realms of gods. Each one is a crack in reality.', emotion: 'neutral' },
      { speaker: 'Nirvani', text: 'If you do not close them, Avani — your world — will be consumed. Everything and everyone you know... gone.', emotion: 'sad' },
      { speaker: 'Veer', text: 'Everyone? Even... even the girl at the flower shop who doesn\'t know I exist?', emotion: 'sad' },
      { speaker: 'Nirvani', text: "...Yes. Even her.", emotion: 'sad' },
      { speaker: 'Veer', text: "Then I'll close them. Every last one!", emotion: 'angry' },
      { speaker: 'Nirvani', text: 'Each dungeon holds a divine weapon. Earn them, and you might survive. Fail... and the portal remains open.', emotion: 'neutral' },
      { speaker: 'Nirvani', text: "I must go now. But remember... I will always be watching over you.", emotion: 'mysterious' },
      { speaker: 'Veer', text: 'Wait! Who ARE you? Why do you care about me?', emotion: 'neutral' },
      { speaker: 'Nirvani', text: '...You will know, when the time is right.', emotion: 'sad' },
    ],
    onComplete: 'nirvani_revealed',
  },

  // --- After completing first dungeon ---
  dungeon_complete_1: {
    id: 'dungeon_complete_1',
    trigger: 'dungeon_complete_agni_furnace',
    lines: [
      { speaker: 'Narrator', text: 'The dungeon crumbles. Veer holds the Chakra of Agni, flames dancing along its edge.', emotion: 'neutral' },
      { speaker: 'Veer', text: "A weapon from a FIRE GOD. And I got it by going to the BATHROOM.", emotion: 'comedy' },
      { speaker: 'Veer', text: "If I told anyone this, they'd think I'm insane. More insane than usual.", emotion: 'comedy' },
      { speaker: 'Veer', text: "...Hana. She's in that village. I have to protect it. I have to protect her.", emotion: 'neutral' },
      { speaker: 'Veer', text: "Even if she still won't know I exist.", emotion: 'sad' },
    ],
    onComplete: 'return_to_hub',
  },

  // --- Hub world: Hana encounter ---
  hana_encounter: {
    id: 'hana_encounter',
    trigger: 'talk_to_hana',
    lines: [
      { speaker: 'Veer', text: "H-Hey, Hana... I just wanted to say—", emotion: 'neutral' },
      { speaker: 'Hana', text: "Oh! You're that boy who lives in the unfinished house, right?", emotion: 'neutral' },
      { speaker: 'Veer', text: "...Yes. That's me. The unfinished boy in the unfinished house.", emotion: 'comedy' },
      { speaker: 'Hana', text: "You look... different today. Did you do something with your hair?", emotion: 'happy' },
      { speaker: 'Veer', text: "I DIDN'T DO ANYTHING! I mean... yeah, maybe. Thanks.", emotion: 'comedy' },
      { speaker: 'Hana', text: "Well, it looks nice. See you around!", emotion: 'happy' },
      { speaker: 'Veer', text: "She noticed me. SHE NOTICED ME! ...Wait, was that a compliment or pity?", emotion: 'comedy' },
    ],
    onComplete: 'hana_first_meeting',
  },

  // --- Bathroom re-entry (comedy) ---
  bathroom_reenter: {
    id: 'bathroom_reenter',
    trigger: 'bathroom_enter_repeat',
    lines: [
      { speaker: 'Veer', text: "Okay, I REALLY need to go this time. No portals, no dungeons, just a normal—", emotion: 'comedy' },
      { speaker: 'Veer', text: "...It's glowing again.", emotion: 'neutral' },
      { speaker: 'Veer', text: "WHY DOES THE BATHROOM ALWAYS GLOW?!", emotion: 'angry' },
      { speaker: 'Narrator', text: 'The portal activates once more. Veer sighs, then grins — he\'s starting to get used to this.', emotion: 'comedy' },
    ],
    onComplete: 'dungeon_enter',
  },

  // --- Before boss fight ---
  before_boss: {
    id: 'before_boss',
    trigger: 'boss_encounter',
    lines: [
      { speaker: 'Narrator', text: 'The air grows heavy. A powerful presence blocks the path ahead.', emotion: 'mysterious' },
      { speaker: 'Veer', text: "Of course. The biggest, scariest monster is always right in front of the exit.", emotion: 'comedy' },
      { speaker: 'Veer', text: "Alright, big guy. I just want to use the bathroom in peace. Let's make this quick.", emotion: 'angry' },
    ],
    onComplete: 'boss_fight_start',
  },
};
