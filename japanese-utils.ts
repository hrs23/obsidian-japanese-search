import * as wanakana from 'wanakana';

export interface SearchVariant {
    original: string;
    hiragana: string;
    katakana: string;
    romaji: string;
}

export function generateSearchVariants(input: string): SearchVariant {
    const trimmed = input.trim();
    
    return {
        original: trimmed,
        hiragana: wanakana.toHiragana(trimmed),
        katakana: wanakana.toKatakana(trimmed),
        romaji: wanakana.toRomaji(trimmed)
    };
}

export function getAllSearchTerms(input: string): string[] {
    if (!input.trim()) return [];
    
    const variants = generateSearchVariants(input);
    const terms = new Set([
        variants.original,
        variants.hiragana,
        variants.katakana,
        variants.romaji
    ]);
    
    // Remove duplicates and empty strings
    return Array.from(terms).filter(term => term && term.trim().length > 0);
}

export function matchesAnyVariant(searchInput: string, targetText: string): boolean {
    if (!searchInput || !targetText) return false;
    
    const searchTerms = getAllSearchTerms(searchInput.toLowerCase());
    const targetLower = targetText.toLowerCase();
    
    return searchTerms.some(term => 
        targetLower.includes(term.toLowerCase())
    );
}

export function isJapaneseText(text: string): boolean {
    return wanakana.isJapanese(text);
}

export function isRomaji(text: string): boolean {
    return wanakana.isRomaji(text);
}