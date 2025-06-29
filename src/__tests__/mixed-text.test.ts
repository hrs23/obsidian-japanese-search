import { matchesJapaneseText } from '../japanese-utils';

describe('混合テキストテスト（漢字＋ひらがな）', () => {
    describe('漢字とひらがなの組み合わせ', () => {
        test.each([
            ['sujiwo', '背筋を鍛える', true, '筋(suji) + を(wo)'],
            ['suji', '背筋を鍛える', true, '部分マッチ'],
            ['s', '背筋を鍛える', true, '単一文字マッチ'],
            ['kitaeru', '背筋を鍛える', true, '鍛える部分'],
            ['haikinwokitaeru', '背筋を鍛える', true, '全体マッチ'],
            ['se', '背中を伸ばす', true, '背(se)'],
            ['せ', '背中を伸ばす', true, 'ひらがな入力'],
        ])('%s が "%s" にマッチする', (input, target, expected) => {
            expect(matchesJapaneseText(input, target)).toBe(expected);
        });
    });

    describe('ファイル名での実用例', () => {
        test.each([
            ['y', '私の山登り日記', true],
            ['yama', '高い山の写真', true],
            ['saku', '春の桜並木', true],
            ['nichihon', '日本の文化について', true],
        ])('%s でファイル名 "%s" を検索できる', (query, filename) => {
            expect(matchesJapaneseText(query, filename)).toBe(true);
        });
    });

    describe('特殊なケース', () => {
        test('山にはせんという読みがある', () => {
            expect(matchesJapaneseText('せ', '山')).toBe(true);
            expect(matchesJapaneseText('se', '山')).toBe(true);
            expect(matchesJapaneseText('sen', '山')).toBe(true);
        });

        test('無関係なテキストにはマッチしない', () => {
            expect(matchesJapaneseText('sujiwo', '頭を冷やす')).toBe(false);
            expect(matchesJapaneseText('yama', '猫の写真')).toBe(false);
            expect(matchesJapaneseText('saku', '海の景色')).toBe(false);
        });
    });
});