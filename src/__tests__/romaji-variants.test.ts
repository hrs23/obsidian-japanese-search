import { matchesJapaneseText, highlightMatches } from '../japanese-utils';

describe('ローマ字バリエーションテスト', () => {
    describe('基本的な訓令式ローマ字での検索', () => {
        test.each([
            ['si', 'しんぶん', true, '訓令式 si で し をマッチ'],
            ['ti', 'ちず', true, '訓令式 ti で ち をマッチ'],
            ['tu', 'つき', true, '訓令式 tu で つ をマッチ'],
            ['zi', 'じかん', true, '訓令式 zi で じ をマッチ'],
            ['hu', 'ふじさん', true, '訓令式 hu で ふ をマッチ'],
        ])('%s で %s を検索できる (%s)', (query, text, expected, description) => {
            expect(matchesJapaneseText(query, text)).toBe(expected);
        });
    });

    describe('ヘボン式ローマ字での検索（既存）', () => {
        test.each([
            ['shi', 'しんぶん', true],
            ['chi', 'ちず', true],
            ['tsu', 'つき', true],
            ['ji', 'じかん', true],
            ['fu', 'ふじさん', true],
        ])('%s で %s を検索できる', (query, text, expected) => {
            expect(matchesJapaneseText(query, text)).toBe(expected);
        });
    });

    describe('ハイライトのテスト', () => {
        test('si でしがハイライトされる', () => {
            const result = highlightMatches('新しい機能', 'si');
            expect(result).toContain('<mark class="japanese-search-highlight">し</mark>');
        });

        test('ti で地がハイライトされる', () => {
            const result = highlightMatches('地図を見る', 'ti');
            expect(result).toContain('<mark class="japanese-search-highlight">地</mark>');
        });
    });

    describe('混在する入力方式', () => {
        test('shi と si 両方でしを検索', () => {
            expect(matchesJapaneseText('shi', 'しんぶん')).toBe(true);
            expect(matchesJapaneseText('si', 'しんぶん')).toBe(true);
        });

        test('shin と sin 両方でしんを検索', () => {
            expect(matchesJapaneseText('shin', '新聞')).toBe(true);
            expect(matchesJapaneseText('sin', '新聞')).toBe(true);
        });

        test('chi と ti 両方でちを検索', () => {
            expect(matchesJapaneseText('chi', '地図')).toBe(true);
            expect(matchesJapaneseText('ti', '地図')).toBe(true);
        });
    });
});