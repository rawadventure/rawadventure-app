/**
 * video-posters — posters embarqués des vidéos Supabase Storage.
 *
 * Frames extraites à t=1s de chaque vidéo du bucket `phase0-videos`
 * (script ffmpeg, session 3 juillet 2026), embarquées dans le bundle :
 * preview instantanée sans téléchargement vidéo, et seule solution fiable
 * sur iOS Safari qui ne peint jamais la frame d'une vidéo en pause
 * (le fragment `#t=1` est ignoré).
 *
 * Clé = nom de fichier mp4 sans extension. `getVideoPoster(uri)` résout
 * automatiquement le poster depuis l'URL — les écrans n'ont rien à faire.
 * Les jpg sont recadrés en 16:9 (bande centrale en hauteur) pour remplir le
 * conteneur VideoPreview sans recadrage à l'affichage (choix Stéphane, 21
 * juillet 2026). Vidéo re-tournée → régénérer le jpg :
 * ffmpeg -ss 1 -i video.mp4 -vf "crop=540:304:0:328" -q:v 3 poster.jpg
 * (base : frame source 540x960 verticale ; adapter le crop si autre format).
 */

import type { ImageSourcePropType } from 'react-native';

const POSTERS: Record<string, ImageSourcePropType> = {
  'welcome-j1-bienvenue': require('../../assets/video-posters/welcome-j1-bienvenue.jpg'),
  'charniere-j7-une-semaine': require('../../assets/video-posters/charniere-j7-une-semaine.jpg'),
  'charniere-j14-fin-phase-0': require('../../assets/video-posters/charniere-j14-fin-phase-0.jpg'),
  's0-1-celebration': require('../../assets/video-posters/s0-1-celebration.jpg'),
  's0-2-roadmap': require('../../assets/video-posters/s0-2-roadmap.jpg'),
  'palier-15j': require('../../assets/video-posters/palier-15j.jpg'),
  'palier-30j': require('../../assets/video-posters/palier-30j.jpg'),
  'palier-60j': require('../../assets/video-posters/palier-60j.jpg'),
  'palier-100j': require('../../assets/video-posters/palier-100j.jpg'),
  'palier-365j': require('../../assets/video-posters/palier-365j.jpg'),
  'pilier-s1-respiration': require('../../assets/video-posters/pilier-s1-respiration.jpg'),
  'pilier-s2-activite-physique': require('../../assets/video-posters/pilier-s2-activite-physique.jpg'),
  'pilier-s3-alimentation': require('../../assets/video-posters/pilier-s3-alimentation.jpg'),
  'pilier-s4-connexion-vivant': require('../../assets/video-posters/pilier-s4-connexion-vivant.jpg'),
  'pilier-s5-repos-regeneration': require('../../assets/video-posters/pilier-s5-repos-regeneration.jpg'),
  'pilier-s6-passion': require('../../assets/video-posters/pilier-s6-passion.jpg'),
  'pilier-s7-mindset': require('../../assets/video-posters/pilier-s7-mindset.jpg'),
  'pilier-s8-elimination-detox': require('../../assets/video-posters/pilier-s8-elimination-detox.jpg'),
};

/**
 * Résout le poster embarqué depuis l'URL mp4 (basename sans extension).
 * Retourne null si la vidéo n'a pas de poster connu (nouvelle vidéo pas
 * encore extraite) — la preview retombe sur le fond sombre + bouton play.
 */
export function getVideoPoster(uri: string): ImageSourcePropType | null {
  const match = uri.match(/\/([^/?#]+)\.mp4(?:[?#].*)?$/);
  if (!match) return null;
  return POSTERS[match[1]] ?? null;
}
