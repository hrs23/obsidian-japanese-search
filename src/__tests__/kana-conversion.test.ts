import { matchesJapaneseText } from '../japanese-utils';

describe('ひらがな・カタカナ・ローマ字変換テスト', () => {
    describe('ひらがな⇔ローマ字', () => {
        test.each([
            ['yama', 'やま', true],
            ['ya', 'やま', true],
            ['やま', 'yama', true],
        ])('%s が %s にマッチする', (input, target) => {
            expect(matchesJapaneseText(input, target)).toBe(true);
        });
    });

    describe('カタカナ⇔ローマ字', () => {
        test.each([
            ['yama', 'ヤマ', true],
            ['ya', 'ヤマ', true],
        ])('%s が %s にマッチする', (input, target) => {
            expect(matchesJapaneseText(input, target)).toBe(true);
        });
    });

    describe('エッジケース', () => {
        test('空の入力', () => {
            expect(matchesJapaneseText('', '山')).toBe(false);
            expect(matchesJapaneseText('yama', '')).toBe(false);
            expect(matchesJapaneseText('', '')).toBe(false);
        });

        test('英数字のみ', () => {
            expect(matchesJapaneseText('loading', 'Loading files')).toBe(true);
            expect(matchesJapaneseText('せ', 'Loading files')).toBe(false);
        });
    });
});