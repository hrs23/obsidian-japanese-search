import * as wanakana from 'wanakana';
import { RomajiMapping } from './types';
const Kanji = require('kanji.js');

/**
 * 訓令式ローマ字マッピング（ひらがな）
 */
const KUNREI_ROMAJI_MAP: Record<string, string> = {
    // ひらがな
    'し': 'si', 'ち': 'ti', 'つ': 'tu',
    'じ': 'zi', 'ふ': 'hu', 'を': 'o',
    'づ': 'du', 'ぢ': 'di',
    // カタカナ
    'シ': 'si', 'チ': 'ti', 'ツ': 'tu',
    'ジ': 'zi', 'フ': 'hu', 'ヲ': 'o',
    'ヅ': 'du', 'ヂ': 'di',
};

/**
 * Check if a character is a kanji
 */
function isKanji(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FAF) || (code >= 0x3400 && code <= 0x4DBF);
}

/**
 * Convert kana to all possible romaji variants
 */
function kanaToRomajiVariants(kana: string): string[] {
    const variants: string[] = [];
    
    // ヘボン式（デフォルト）
    const hepburn = wanakana.toRomaji(kana).toLowerCase();
    variants.push(hepburn);
    
    // 訓令式バリアントを生成
    let kunrei = '';
    let hasKunreiDifference = false;
    
    for (const char of kana) {
        if (KUNREI_ROMAJI_MAP[char]) {
            kunrei += KUNREI_ROMAJI_MAP[char];
            hasKunreiDifference = true;
        } else {
            kunrei += wanakana.toRomaji(char).toLowerCase();
        }
    }
    
    if (hasKunreiDifference && kunrei !== hepburn) {
        variants.push(kunrei);
    }
    
    return variants;
}

/**
 * Get all readings for a kanji character
 */
function getKanjiReadings(char: string): string[] {
    try {
        const details = Kanji.getDetails(char);
        if (!details) return [];
        
        const allReadings = new Set<string>();
        
        // Add kunyomi readings
        if (details.kunyomi) {
            details.kunyomi.forEach((reading: string) => {
                const cleanReading = reading.replace(/[.-]/g, '');
                const variants = kanaToRomajiVariants(cleanReading);
                variants.forEach(v => allReadings.add(v));
            });
        }
        
        // Add onyomi readings (カタカナ)
        if (details.onyomi) {
            details.onyomi.forEach((reading: string) => {
                const cleanReading = reading.replace(/[.-]/g, '');
                // カタカナをひらがなに変換してから処理
                const hiragana = wanakana.toHiragana(cleanReading);
                const variants = kanaToRomajiVariants(hiragana);
                variants.forEach(v => allReadings.add(v));
            });
        }
        
        return Array.from(allReadings);
    } catch (error) {
        return [];
    }
}

/**
 * Generate all possible romaji patterns for a text
 */
function generateAllRomajiPatterns(text: string, maxPatterns: number = 100): string[] {
    const patterns: string[] = [''];
    
    for (const char of text) {
        if (isKanji(char)) {
            const readings = getKanjiReadings(char);
            if (readings.length === 0) {
                // No readings found, keep character as is
                for (let i = 0; i < patterns.length; i++) {
                    patterns[i] += char;
                }
                continue;
            }
            
            // Generate new patterns by combining with existing ones
            const newPatterns: string[] = [];
            for (const pattern of patterns) {
                for (const reading of readings) {
                    newPatterns.push(pattern + reading);
                    if (newPatterns.length >= maxPatterns) break;
                }
                if (newPatterns.length >= maxPatterns) break;
            }
            
            patterns.splice(0, patterns.length, ...newPatterns.slice(0, maxPatterns));
        } else {
            // For non-kanji characters, use the same variant generation
            const variants = kanaToRomajiVariants(char);
            
            const newPatterns: string[] = [];
            for (const pattern of patterns) {
                for (const variant of variants) {
                    newPatterns.push(pattern + variant);
                    if (newPatterns.length >= maxPatterns) break;
                }
                if (newPatterns.length >= maxPatterns) break;
            }
            
            patterns.splice(0, patterns.length, ...newPatterns.slice(0, maxPatterns));
        }
    }
    
    return patterns.filter(p => p.length > 0);
}

/**
 * Convert text to romaji with character mapping
 */
function toRomajiWithMapping(text: string, targetPattern: string): RomajiMapping {
    let romaji = '';
    const charMappings: RomajiMapping['charMappings'] = [];
    let currentPatternIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const romajiStart = romaji.length;
        
        if (isKanji(char)) {
            const readings = getKanjiReadings(char);
            let selectedReading = '';
            
            // Find which reading matches the target pattern
            for (const reading of readings) {
                if (targetPattern.substring(currentPatternIndex).startsWith(reading)) {
                    selectedReading = reading;
                    break;
                }
            }
            
            if (selectedReading) {
                romaji += selectedReading;
                currentPatternIndex += selectedReading.length;
            } else {
                romaji += char;
                currentPatternIndex += char.length;
            }
        } else {
            const charRomaji = wanakana.toRomaji(char).toLowerCase();
            romaji += charRomaji;
            currentPatternIndex += charRomaji.length;
        }
        
        const romajiEnd = romaji.length;
        charMappings.push({
            romajiStart,
            romajiEnd,
            originalIndex: i
        });
    }
    
    return { romaji, charMappings };
}

/**
 * Convert text to romaji (simple version for input)
 */
function toRomaji(text: string): string {
    let result = '';
    
    for (const char of text) {
        if (isKanji(char)) {
            const readings = getKanjiReadings(char);
            result += readings[0] || char;
        } else {
            result += wanakana.toRomaji(char).toLowerCase();
        }
    }
    
    return result;
}

/**
 * Check if search query matches target text
 */
export function matchesJapaneseText(searchQuery: string, targetText: string): boolean {
    if (!searchQuery || !targetText) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const targetLower = targetText.toLowerCase();
    
    // Direct match
    if (targetLower.includes(searchLower)) {
        return true;
    }
    
    // Romaji-based matching with all patterns
    const queryRomaji = toRomaji(searchQuery);
    const targetPatterns = generateAllRomajiPatterns(targetText);
    
    return targetPatterns.some(pattern => pattern.includes(queryRomaji));
}

/**
 * Highlight matching text
 */
export function highlightMatches(text: string, searchQuery: string): string {
    if (!searchQuery || !text) return text;
    
    // Try romaji-based highlighting with all patterns
    const queryRomaji = toRomaji(searchQuery);
    const textPatterns = generateAllRomajiPatterns(text);
    
    // Find the best matching pattern
    let bestMatchPattern: string | null = null;
    let bestMatchIndex = -1;
    
    for (const pattern of textPatterns) {
        const matchIndex = pattern.indexOf(queryRomaji);
        if (matchIndex !== -1) {
            bestMatchPattern = pattern;
            bestMatchIndex = matchIndex;
            break;
        }
    }
    
    if (bestMatchPattern && bestMatchIndex !== -1) {
        // Create mapping for the best matching pattern
        const textMapping = toRomajiWithMapping(text, bestMatchPattern);
        
        // Find which original characters to highlight
        const matchEnd = bestMatchIndex + queryRomaji.length;
        const charsToHighlight = new Set<number>();
        
        // Find all original character indices that correspond to the matched romaji range
        for (const mapping of textMapping.charMappings) {
            // If this character's romaji overlaps with the match range
            if (mapping.romajiStart < matchEnd && mapping.romajiEnd > bestMatchIndex) {
                charsToHighlight.add(mapping.originalIndex);
            }
        }
        
        // Build highlighted text
        let result = '';
        let inHighlight = false;
        
        for (let i = 0; i < text.length; i++) {
            const shouldHighlight = charsToHighlight.has(i);
            
            if (shouldHighlight && !inHighlight) {
                result += '<mark class="japanese-search-highlight">';
                inHighlight = true;
            } else if (!shouldHighlight && inHighlight) {
                result += '</mark>';
                inHighlight = false;
            }
            
            result += text[i];
        }
        
        if (inHighlight) {
            result += '</mark>';
        }
        
        return result;
    }
    
    // Fallback: Direct text highlighting
    const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi');
    return text.replace(regex, '<mark class="japanese-search-highlight">$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

