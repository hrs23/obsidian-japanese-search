import { highlightMatches } from '../japanese-utils';

describe('ハイライトテスト', () => {
    const highlightClass = 'japanese-search-highlight';
    
    describe('漢字のハイライト', () => {
        test.each([
            ['yama', '私の山登り日記', '山', '山だけがハイライトされる'],
            ['y', '高い山の写真', '山', '山だけがハイライトされる'],
            ['saku', '春の桜並木', '桜', '桜だけがハイライトされる'],
        ])('%s で検索時、%s の %s がハイライトされる', (query, text, expectedHighlight) => {
            const result = highlightMatches(text, query);
            expect(result).toContain(`<mark class="${highlightClass}">${expectedHighlight}</mark>`);
        });
    });

    describe('複合語のハイライト', () => {
        test('nichi で日がハイライトされる', () => {
            const result = highlightMatches('日本の文化について', 'nichi');
            // nichi matches 日's reading, should highlight it
            expect(result).toContain(`<mark class="${highlightClass}">日</mark>`);
        });

        test('nichihon で日本両方ハイライト', () => {
            const result = highlightMatches('日本語の勉強', 'nichihon');
            // nichihon = nichi + hon, should highlight both
            expect(result).toContain(`<mark class="${highlightClass}">日</mark>`);
            expect(result).toContain(`<mark class="${highlightClass}">本</mark>`);
        });
    });

    describe('混合テキストのハイライト', () => {
        test('sujiwo で筋をがハイライトされる', () => {
            const result = highlightMatches('背筋を鍛える運動', 'sujiwo');
            expect(result).toContain(`<mark class="${highlightClass}">筋を</mark>`);
            expect(result).not.toContain(`<mark class="${highlightClass}">背</mark>`);
        });
    });

    describe('ひらがな・カタカナのハイライト', () => {
        test('yama でやまがハイライトされる', () => {
            const result = highlightMatches('やまのぼり', 'yama');
            expect(result).toContain(`<mark class="${highlightClass}">やま</mark>`);
        });

        test('直接マッチのハイライト', () => {
            const result = highlightMatches('山田太郎', '山田');
            expect(result).toContain(`<mark class="${highlightClass}">山田</mark>`);
        });
    });

    describe('マッチしない場合', () => {
        test('マッチしない場合はハイライトなし', () => {
            const result = highlightMatches('猫の写真', 'yama');
            expect(result).not.toContain('<mark');
            expect(result).toBe('猫の写真');
        });
    });
});