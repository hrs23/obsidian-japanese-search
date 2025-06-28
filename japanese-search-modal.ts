import { App, FuzzySuggestModal, TFile } from 'obsidian';
import { getAllSearchTerms, matchesAnyVariant } from './japanese-utils';

export interface SearchableFile {
    file: TFile;
    content: string;
}

export class JapaneseSearchModal extends FuzzySuggestModal<SearchableFile> {
    private files: SearchableFile[] = [];

    constructor(app: App) {
        super(app);
        this.setPlaceholder('Search files with Japanese support (romaji → hiragana/katakana)...');
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
                this.files.push({
                    file,
                    content: content
                });
            } catch (error) {
                console.warn(`Failed to read file ${file.path}:`, error);
            }
        }
    }

    getItems(): SearchableFile[] {
        return this.files;
    }

    getItemText(item: SearchableFile): string {
        return `${item.file.basename} - ${item.file.path}`;
    }

    onChooseItem(item: SearchableFile, evt: MouseEvent | KeyboardEvent): void {
        // Open the selected file
        this.app.workspace.getLeaf().openFile(item.file);
    }

    // Override the default filtering to use Japanese-aware search
    getSuggestions(query: string): SearchableFile[] {
        if (!query) return this.getItems().slice(0, 50); // Limit initial results

        const searchTerms = getAllSearchTerms(query);
        if (searchTerms.length === 0) return [];

        return this.getItems().filter(item => {
            // Search in filename
            const filenameMatch = matchesAnyVariant(query, item.file.basename);
            
            // Search in file path
            const pathMatch = matchesAnyVariant(query, item.file.path);
            
            // Search in content (limit search to avoid performance issues)
            const contentPreview = item.content.slice(0, 1000); // First 1000 chars
            const contentMatch = matchesAnyVariant(query, contentPreview);

            return filenameMatch || pathMatch || contentMatch;
        }).slice(0, 50); // Limit results for performance
    }

    renderSuggestion(item: SearchableFile, el: HTMLElement): void {
        const titleEl = el.createDiv({ cls: 'suggestion-title' });
        titleEl.setText(item.file.basename);

        const pathEl = el.createDiv({ cls: 'suggestion-note' });
        pathEl.setText(item.file.path);

        // Show a small preview of content if available
        const preview = item.content.slice(0, 100).replace(/\n/g, ' ');
        if (preview) {
            const previewEl = el.createDiv({ cls: 'suggestion-aux' });
            previewEl.setText(preview + (item.content.length > 100 ? '...' : ''));
        }
    }
}