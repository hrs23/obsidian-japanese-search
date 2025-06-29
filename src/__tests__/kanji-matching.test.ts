import { matchesJapaneseText } from '../japanese-utils';

describe('漢字マッチングテスト', () => {
    describe('単一文字の部分マッチ', () => {
        test.each([
            ['y', '山', true, 'yama の頭文字でマッチ'],
            ['y', '雪', true, 'yuki の頭文字でマッチ'],
            ['y', '夜', true, 'yoru の頭文字でマッチ'],
            ['s', '桜', true, 'sakura の頭文字でマッチ'],
            ['n', '日', true, 'nichi の頭文字でマッチ'],
        ])('%s が %s に %s', (input, target, expected, description) => {
            expect(matchesJapaneseText(input, target)).toBe(expected);
        });
    });

    describe('部分的な読みマッチ', () => {
        test.each([
            ['ya', '山', true, '部分読み ya でマッチ'],
            ['ya', '雪', false, 'yuki には ya がない'],
            ['yam', '山', true, '部分読み yam でマッチ'],
            ['saku', '桜', true, '部分読み saku でマッチ'],
        ])('%s が %s に %s', (input, target, expected, description) => {
            expect(matchesJapaneseText(input, target)).toBe(expected);
        });
    });

    describe('完全な読みマッチ', () => {
        test.each([
            ['yama', '山', true],
            ['sakura', '桜', true],
            ['toukyou', '東京', true],
            ['gakukou', '学校', true],
            ['nichi', '日', true],
            ['hon', '本', true],
        ])('%s が %s にマッチする', (input, target) => {
            expect(matchesJapaneseText(input, target)).toBe(true);
        });
    });

    describe('複合語のマッチ', () => {
        test.each([
            ['nichihon', '日本', true, '日(nichi) + 本(hon)'],
            ['toukyou', '東京', true, '東(tou) + 京(kyou)'],
            ['gakukou', '学校', true, '学(gaku) + 校(kou)'],
        ])('%s が %s にマッチする (%s)', (input, target, expected, description) => {
            expect(matchesJapaneseText(input, target)).toBe(expected);
        });
    });

    describe('誤った読みでマッチしない', () => {
        test.each([
            ['tokyo', '東京', false, '正しくは toukyou'],
            ['gakko', '学校', false, '正しくは gakukou'],
            ['nippon', '日本', false, '音読みの組み合わせ'],
        ])('%s が %s にマッチしない (%s)', (input, target, expected, reason) => {
            expect(matchesJapaneseText(input, target)).toBe(expected);
        });
    });
});