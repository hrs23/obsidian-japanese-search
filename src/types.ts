import { TFile } from 'obsidian';

export interface JapaneseSearchSettings {
    searchInContent: boolean;
}

export interface SearchableFile {
    file: TFile;
    content: string;
}

export interface RomajiMapping {
    romaji: string;
    charMappings: Array<{
        romajiStart: number;
        romajiEnd: number;
        originalIndex: number;
    }>;
}