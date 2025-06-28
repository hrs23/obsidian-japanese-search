import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { JapaneseSearchModal } from './japanese-search-modal';

interface JapaneseSearchSettings {
	enableRibbon: boolean;
}

const DEFAULT_SETTINGS: JapaneseSearchSettings = {
	enableRibbon: true
}

export default class JapaneseSearchPlugin extends Plugin {
	settings: JapaneseSearchSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon for Japanese search
		if (this.settings.enableRibbon) {
			const ribbonIconEl = this.addRibbonIcon('search', 'Japanese Search', (evt: MouseEvent) => {
				new JapaneseSearchModal(this.app).open();
			});
			ribbonIconEl.addClass('japanese-search-ribbon-class');
		}

		// Main command to open Japanese search
		this.addCommand({
			id: 'open-japanese-search',
			name: 'Open Japanese Search',
			callback: () => {
				new JapaneseSearchModal(this.app).open();
			},
			hotkeys: [{ modifiers: ['Mod'], key: 'j' }]
		});

		// Alternative command with different hotkey
		this.addCommand({
			id: 'japanese-search-alt',
			name: 'Japanese Search (Alternative)',
			callback: () => {
				new JapaneseSearchModal(this.app).open();
			},
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'j' }]
		});

		// Add settings tab
		this.addSettingTab(new JapaneseSearchSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class JapaneseSearchSettingTab extends PluginSettingTab {
	plugin: JapaneseSearchPlugin;

	constructor(app: App, plugin: JapaneseSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Japanese Search Settings'});

		new Setting(containerEl)
			.setName('Show ribbon icon')
			.setDesc('Display the Japanese search icon in the left ribbon')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableRibbon)
				.onChange(async (value) => {
					this.plugin.settings.enableRibbon = value;
					await this.plugin.saveSettings();
					new Notice('Please reload the plugin for changes to take effect.');
				}));

		const hotkeysEl = containerEl.createDiv();
		hotkeysEl.createEl('h3', {text: 'Hotkeys'});
		hotkeysEl.createEl('p', {text: 'Ctrl/Cmd + J: Open Japanese Search'});
		hotkeysEl.createEl('p', {text: 'Ctrl/Cmd + Shift + J: Alternative Japanese Search'});
		
		const usageEl = containerEl.createDiv();
		usageEl.createEl('h3', {text: 'Usage'});
		usageEl.createEl('p', {text: 'Type romaji text (e.g., "konnichiwa") to search for Japanese content (e.g., "こんにちは").'});
		usageEl.createEl('p', {text: 'The search will automatically convert between romaji, hiragana, katakana, and kanji.'});
	}
}
