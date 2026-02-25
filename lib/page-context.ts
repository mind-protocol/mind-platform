/**
 * Page Context Extraction
 *
 * Extracts a structured summary of what the user is currently viewing
 * on the webapp. Attached to each chat message so MIND has full
 * situational awareness without receiving raw HTML.
 */

export interface PageContext {
  /** Route segment: "tracker" | "tracker/3d" | "tracker/health" | etc. */
  page: string;
  /** ISO timestamp of extraction */
  timestamp: string;
  /** Meaningful data currently visible to the user */
  visible_data: {
    substances_logged_today: string[];
    active_recommendations: string[];
    surveillance_active: boolean;
    surveillance_severity: string | null;
    active_alerts: string[];
    biometrics: {
      hr: number | null;
      stress: number | null;
      body_battery: number | null;
      ans_mode: string | null;
    } | null;
    current_tab: string;
    food_logged_today: number;
  };
  /** Current UI state */
  ui_state: {
    theme: string;
    view_mode: string;
    expanded_sections: string[];
  };
}

// ---------------------------------------------------------------------------
// DOM scraping helpers (resilient — never throw, always return defaults)
// ---------------------------------------------------------------------------

/** Read the current route from pathname, stripping locale prefix */
function extractPage(): string {
  if (typeof window === 'undefined') return 'unknown';
  const path = window.location.pathname;
  // Strip locale prefix: /en/tracker/health -> tracker/health
  const clean = path.replace(/^\/[a-z]{2}(?=\/)/, '').replace(/^\//, '');
  return clean || 'home';
}

/** Scrape substance card counts from the DOM */
function extractSubstancesLoggedToday(): string[] {
  const results: string[] = [];
  try {
    // SubstanceCard renders a grid of cards. Each card has:
    //   - A label span with icon + name
    //   - A count div with font-mono class
    const cards = document.querySelectorAll('.grid .bg-zinc-900.border.border-zinc-800.rounded-lg');
    cards.forEach((card) => {
      const labelEl = card.querySelector('.text-sm.font-medium.text-zinc-300');
      const countEl = card.querySelector('.text-2xl.font-mono.font-bold');
      if (labelEl && countEl) {
        const label = labelEl.textContent?.trim() || '';
        const count = parseInt(countEl.textContent?.trim() || '0', 10);
        if (count > 0) {
          results.push(`${label}: ${count}`);
        }
      }
    });
  } catch { /* DOM scraping should never crash */ }
  return results;
}

/** Extract active recommendations from Recommendation component */
function extractActiveRecommendations(): string[] {
  const results: string[] = [];
  try {
    // Top recommendation has a distinct border/bg pattern
    const recCards = document.querySelectorAll('[class*="flex items-start gap-3 p-3 rounded-lg border"]');
    recCards.forEach((card) => {
      const actionEl = card.querySelector('.font-medium.text-sm');
      const reasonEl = card.querySelector('.text-xs.text-zinc-500');
      if (actionEl) {
        const action = actionEl.textContent?.trim() || '';
        const reason = reasonEl?.textContent?.trim() || '';
        results.push(reason ? `${action} (${reason})` : action);
      }
    });
    // Secondary recommendations
    const secondaries = document.querySelectorAll('.text-xs.text-zinc-400.flex-1.truncate');
    secondaries.forEach((el) => {
      const text = el.textContent?.trim();
      if (text) results.push(text);
    });
  } catch { /* never crash */ }
  return results;
}

/** Extract surveillance data from the DOM */
function extractSurveillance(): {
  active: boolean;
  severity: string | null;
  alerts: string[];
} {
  const result = { active: false, severity: null as string | null, alerts: [] as string[] };
  try {
    const survSection = document.querySelector('[class*="border-red-500/40"], [class*="border-amber-500/30"]');
    if (!survSection) return result;

    result.active = true;

    // Determine severity from the border color class
    const className = survSection.className || '';
    if (className.includes('border-red-500')) {
      result.severity = 'high';
    } else if (className.includes('border-amber-500')) {
      result.severity = 'moderate';
    } else {
      result.severity = 'low';
    }

    // Extract alert notes
    const alertItems = survSection.querySelectorAll('.text-xs .text-zinc-400');
    alertItems.forEach((el) => {
      const text = el.textContent?.trim();
      if (text) result.alerts.push(text);
    });
  } catch { /* never crash */ }
  return result;
}

/** Extract biometric data from the recommendation context bar */
function extractBiometrics(): PageContext['visible_data']['biometrics'] {
  try {
    // The recommendation component shows biometrics in the context bar
    const contextBar = document.querySelector('.flex.items-center.justify-between.mb-3');
    if (!contextBar) return null;

    const text = contextBar.textContent || '';
    const hr = text.match(/[^a-z](\d+)(?=\s*bpm|\s*♡|♡(\d+))/i);
    const stress = text.match(/[σ](\d+)/);
    const bb = text.match(/[⚡](\d+)/);

    // Also check for the unicode characters directly
    const hrMatch = text.match(/♡(\d+)/);
    const stressMatch = text.match(/σ(\d+)/);
    const bbMatch = text.match(/⚡(\d+)/);

    const hrVal = hrMatch?.[1] || hr?.[1] || null;
    const stressVal = stressMatch?.[1] || stress?.[1] || null;
    const bbVal = bbMatch?.[1] || bb?.[1] || null;

    if (!hrVal && !stressVal && !bbVal) return null;

    return {
      hr: hrVal ? parseInt(hrVal, 10) : null,
      stress: stressVal ? parseInt(stressVal, 10) : null,
      body_battery: bbVal ? parseInt(bbVal, 10) : null,
      ans_mode: null,
    };
  } catch { return null; }
}

/** Detect which tab is active */
function extractCurrentTab(): string {
  try {
    // Tab buttons have specific active classes
    const bodyTab = document.querySelector('button[class*="border-teal-500"]');
    const subTab = document.querySelector('button[class*="border-green-500"]');
    if (bodyTab && bodyTab.className.includes('bg-teal-500')) return 'body';
    if (subTab && subTab.className.includes('bg-green-500')) return 'substances';
    // Fallback: check text content of active-looking button
    const activeTab = document.querySelector('button[class*="border-teal-500/40"], button[class*="border-green-500/40"]');
    if (activeTab?.textContent?.includes('Body')) return 'body';
    if (activeTab?.textContent?.includes('Substances')) return 'substances';
  } catch { /* never crash */ }
  return 'body';
}

/** Count food entries logged today */
function extractFoodCount(): number {
  try {
    // FoodLog shows entry cards — count them
    const foodEntries = document.querySelectorAll('[class*="food-entry"], [data-food-entry]');
    if (foodEntries.length > 0) return foodEntries.length;

    // Fallback: look for meal-type badges or food-related list items
    // The FoodLog component renders items with meal_type labels
    const mealCards = document.querySelectorAll('.bg-zinc-900 .text-xs');
    let count = 0;
    mealCards.forEach((el) => {
      const text = el.textContent?.toLowerCase() || '';
      if (text.includes('kcal') || text.includes('cal')) count++;
    });
    return count;
  } catch { return 0; }
}

/** Detect current view mode (now vs plan) */
function extractViewMode(): string {
  try {
    // PlanViewToggle renders buttons — check which is active
    const planBtn = document.querySelector('button[class*="plan"]');
    const nowBtn = document.querySelector('button[class*="now"]');
    // Check for PlanningCalendar presence
    const calendar = document.querySelector('[class*="PlanningCalendar"], [class*="calendar"]');
    if (calendar) return 'plan';
    return 'now';
  } catch { return 'now'; }
}

/** Detect expanded sections */
function extractExpandedSections(): string[] {
  const sections: string[] = [];
  try {
    // Check if SensationLogger is expanded (has visible content)
    const sensationSection = document.querySelector('[class*="sensation"]');
    if (sensationSection) sections.push('sensation_logger');

    // Check if KCalculator is visible
    const kCalc = document.querySelector('[class*="k-calc"], [class*="KCalculator"]');
    if (kCalc) sections.push('k_calculator');

    // Check for the K Calculator toggle state
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn) => {
      if (btn.textContent?.includes('Hide') && btn.className.includes('purple')) {
        sections.push('k_calculator');
      }
    });

    // Check if ScheduleDoseForm modal is open
    const modal = document.querySelector('[class*="ScheduleDoseForm"]');
    if (modal) sections.push('schedule_form');

    // Check for BiometricCorrelation
    const bioCorr = document.querySelector('canvas, [class*="correlation"]');
    if (bioCorr) sections.push('biometric_correlation');
  } catch { /* never crash */ }
  return [...new Set(sections)];
}

/** Detect color theme from chat preferences in localStorage */
function extractTheme(): string {
  try {
    const raw = localStorage.getItem('chat-prefs');
    if (raw) {
      const prefs = JSON.parse(raw);
      return prefs.theme || 'zinc';
    }
  } catch { /* never crash */ }

  // Fallback: check if body/html has a theme class
  try {
    const html = document.documentElement;
    if (html.classList.contains('dark')) return 'dark';
    if (html.classList.contains('light')) return 'light';
  } catch { /* never crash */ }

  return 'dark';
}

// ---------------------------------------------------------------------------
// Main extraction function
// ---------------------------------------------------------------------------

/**
 * Extract a structured summary of the current page context.
 * Designed to be called right before sending a chat message.
 * Never throws — always returns a valid PageContext.
 */
export function extractPageContext(): PageContext {
  const surveillance = extractSurveillance();

  return {
    page: extractPage(),
    timestamp: new Date().toISOString(),
    visible_data: {
      substances_logged_today: extractSubstancesLoggedToday(),
      active_recommendations: extractActiveRecommendations(),
      surveillance_active: surveillance.active,
      surveillance_severity: surveillance.severity,
      active_alerts: surveillance.alerts,
      biometrics: extractBiometrics(),
      current_tab: extractCurrentTab(),
      food_logged_today: extractFoodCount(),
    },
    ui_state: {
      theme: extractTheme(),
      view_mode: extractViewMode(),
      expanded_sections: extractExpandedSections(),
    },
  };
}

/**
 * Capture a screenshot of the visible page area using html2canvas.
 * Returns a base64-encoded PNG data URL, or null on failure.
 */
export async function capturePageScreenshot(): Promise<string | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(document.body, {
      // Performance: scale down for chat context (no need for retina)
      scale: 1,
      // Skip the chat widget itself to avoid recursion
      ignoreElements: (el) => {
        return el.hasAttribute('data-chat-panel') ||
               el.getAttribute('aria-label') === 'Open chat';
      },
      useCORS: true,
      logging: false,
      backgroundColor: '#09090b', // zinc-950
    });

    // Compress to JPEG for smaller payload, quality 0.7
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch (err) {
    console.warn('Screenshot capture failed:', err);
    return null;
  }
}

/**
 * Convert a File object to a base64 data URL.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
