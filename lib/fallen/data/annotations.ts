import annotationsEn from './annotations-en.json';
import annotationsFr from './annotations-fr.json';

export interface Annotation {
  timeSec: number;
  label: string;
  lyricQuote: string | null;
  commentary: string;
  section: string;
}

interface TrackAnnotations {
  id: number;
  slug: string;
  title: string;
  durationSec: number;
  annotations: Annotation[];
}

interface AnnotationsData {
  tracks: TrackAnnotations[];
}

const localeMap: Record<string, AnnotationsData> = {
  en: annotationsEn as AnnotationsData,
  fr: annotationsFr as AnnotationsData,
};

/**
 * Returns annotations for a given track and locale.
 * Falls back to 'en' if the requested locale is not available.
 */
export function getAnnotations(
  locale: string,
  trackSlug: string
): Annotation[] {
  const data = localeMap[locale] ?? localeMap['en'];
  const track = data.tracks.find((t) => t.slug === trackSlug);
  return track?.annotations ?? [];
}

/**
 * Binary-searches for the annotation that is active at `currentTimeSec`.
 * An annotation is "active" if its timeSec <= currentTimeSec and it is the
 * last such annotation (i.e. no later annotation has started yet).
 * Returns null if currentTimeSec is before all annotations.
 */
export function getActiveAnnotation(
  annotations: Annotation[],
  currentTimeSec: number
): Annotation | null {
  if (annotations.length === 0) return null;

  // All annotations are before the first one
  if (currentTimeSec < annotations[0].timeSec) return null;

  let lo = 0;
  let hi = annotations.length - 1;

  // Find the rightmost annotation whose timeSec <= currentTimeSec
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (annotations[mid].timeSec <= currentTimeSec) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // hi is now the index of the last annotation with timeSec <= currentTimeSec
  return hi >= 0 ? annotations[hi] : null;
}

/**
 * Returns the next `count` upcoming annotations after `currentTimeSec`.
 */
export function getUpcomingAnnotations(
  annotations: Annotation[],
  currentTimeSec: number,
  count: number
): Annotation[] {
  if (annotations.length === 0 || count <= 0) return [];

  // Find the first annotation with timeSec > currentTimeSec
  let lo = 0;
  let hi = annotations.length;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (annotations[mid].timeSec <= currentTimeSec) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return annotations.slice(lo, lo + count);
}
