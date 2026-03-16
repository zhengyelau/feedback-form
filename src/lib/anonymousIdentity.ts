const IDENTITY_KEY = 'anon_identity';

const COLORS = [
  'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Teal',
  'Cyan', 'Magenta', 'Lime', 'Indigo', 'Violet', 'Coral', 'Azure', 'Crimson'
];

const ADJECTIVES = [
  'Silent', 'Swift', 'Brave', 'Clever', 'Gentle', 'Fierce', 'Wise', 'Bold',
  'Calm', 'Quick', 'Bright', 'Noble', 'Mystic', 'Ancient', 'Golden', 'Silver'
];

const ANIMALS = [
  'Panda', 'Tiger', 'Eagle', 'Wolf', 'Fox', 'Bear', 'Owl', 'Hawk',
  'Lion', 'Dolphin', 'Falcon', 'Raven', 'Dragon', 'Phoenix', 'Lynx', 'Otter'
];

function generateShortId(): string {
  const uuid = crypto.randomUUID();
  return uuid.substring(0, 4).toUpperCase();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateAnonymousIdentity(): string {
  const color = getRandomElement(COLORS);
  const adjective = getRandomElement(ADJECTIVES);
  const animal = getRandomElement(ANIMALS);
  const shortId = generateShortId();

  return `${color} ${adjective} ${animal} #${shortId}`;
}

export function getAnonymousIdentity(): string {
  try {
    const existing = localStorage.getItem(IDENTITY_KEY);

    if (existing) {
      return existing;
    }

    const newIdentity = generateAnonymousIdentity();
    localStorage.setItem(IDENTITY_KEY, newIdentity);
    return newIdentity;
  } catch {
    return generateAnonymousIdentity();
  }
}
