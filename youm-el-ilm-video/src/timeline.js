import data from './voice.json';

/* scene cut points (frames). scripts/make_voice.py stretches scenes so every sentence fits and saves them in voice.json */
const DEFAULT_CUTS = [0, 180, 345, 525, 735, 915, 1155, 1425, 1710, 1875, 2055, 2310];

export const cuts = Array.isArray(data) ? DEFAULT_CUTS : data.cuts;
export const voice = Array.isArray(data) ? data : data.clips;
