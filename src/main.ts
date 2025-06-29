import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { JapaneseSearchModal } from './japanese-search-modal';
import { JapaneseSearchSettings } from './types';

const DEFAULT_SETTINGS: JapaneseSearchSettings = {
	searchInContent: false
}

export default class JapaneseSearchPlugin extends Plugin {
	settings: JapaneseSearchSettings;

	async onload() {
		await this.loadSettings();

		// Main command to open Japanese search
		this.addCommand({
			id: 'open-japanese-search',
			name: 'Open Japanese Search',
			callback: () => {
				new JapaneseSearchModal(this.app, this.settings).open();
			},
			hotkeys: [{ modifiers: ['Mod'], key: 'j' }]
		});

		// Add settings tab
		this.addSettingTab(new JapaneseSearchSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup if needed
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
			.setName('Search in file content')
			.setDesc('Enable searching within file content, not just file names.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.searchInContent)
				.onChange(async (value) => {
					this.plugin.settings.searchInContent = value;
					await this.plugin.saveSettings();
				}));

		const usageEl = containerEl.createDiv();
		usageEl.createEl('h3', {text: 'Usage'});
		usageEl.createEl('p', {text: 'Type romaji text (e.g., "yama") to search for Japanese content (e.g., "山").'});
		usageEl.createEl('p', {text: 'Press Ctrl/Cmd + J to open Japanese Search.'});
	}
}