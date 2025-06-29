import { App, SuggestModal } from 'obsidian';
import { matchesJapaneseText, highlightMatches } from './japanese-utils';
import { JapaneseSearchSettings, SearchableFile } from './types';

export class JapaneseSearchModal extends SuggestModal<SearchableFile> {
    private files: SearchableFile[] = [];
    private settings: JapaneseSearchSettings;
    private currentQuery: string = '';

    constructor(app: App, settings: JapaneseSearchSettings) {
        super(app);
        this.settings = settings;
        this.setPlaceholder('Search files with Japanese support (romaji → hiragana/katakana/kanji)...');
    }

    async onOpen() {
        super.onOpen();
        await this.loadFiles();
    }

    private async loadFiles() {
        const markdownFiles = this.app.vault.getMarkdownFiles();
        this.files = [];

        for (const file of markdownFiles) {
            try {
                const content = await this.app.vault.read(file);
                this.files.push({ file, content });
            } catch (error) {
                console.warn(`Failed to read file ${file.path}:`, error);
            }
        }
    }

    getSuggestions(query: string): SearchableFile[] {
        this.currentQuery = query;
        
        if (!query) return this.files.slice(0, 50);

        const results = this.files.filter(item => {
            // Check filename
            if (matchesJapaneseText(query, item.file.basename)) {
                return true;
            }
            
            // Check file path
            if (matchesJapaneseText(query, item.file.path)) {
                return true;
            }
            
            // Check content if enabled
            if (this.settings.searchInContent) {
                const contentPreview = item.content.slice(0, 1000);
                if (matchesJapaneseText(query, contentPreview)) {
                    return true;
                }
            }
            
            return false;
        });
        
        return results.slice(0, 50);
    }

    renderSuggestion(item: SearchableFile, el: HTMLElement): void {
        const titleEl = el.createDiv({ cls: 'suggestion-title' });
        const pathEl = el.createDiv({ cls: 'suggestion-note' });
        
        // Highlight filename
        if (this.currentQuery) {
            titleEl.innerHTML = highlightMatches(item.file.basename, this.currentQuery);
            pathEl.innerHTML = highlightMatches(item.file.path, this.currentQuery);
        } else {
            titleEl.setText(item.file.basename);
            pathEl.setText(item.file.path);
        }
        
        // Show content preview if enabled
        if (this.settings.searchInContent) {
            const previewEl = el.createDiv({ cls: 'suggestion-aux' });
            const preview = item.content.slice(0, 100).replace(/\n/g, ' ');
            
            if (this.currentQuery) {
                previewEl.innerHTML = highlightMatches(preview, this.currentQuery) + 
                    (item.content.length > 100 ? '...' : '');
            } else {
                previewEl.setText(preview + (item.content.length > 100 ? '...' : ''));
            }
        }
    }

    onChooseSuggestion(item: SearchableFile): void {
        this.app.workspace.getLeaf().openFile(item.file);
    }
}