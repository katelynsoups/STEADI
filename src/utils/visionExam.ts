/*  USES SEQUENCE ALGORITHM - VARIANT OF LONGEST COMMON SUBSEQUENCE (LCS)
    - ignores skipped letters and resulting order shifts
    - provides overall similarity score and per-letter feedback

    drawbacks: this currently scores each line the same, i recommend 
    future implementations weighing the lines of text dependant based on text size
    (e.g. the first line is more important than the last line, so missing letters
    in the first line should be penalized more than missing letters in the last line)
*/

type LetterResult = {
    letter: string;
    matched: boolean;
};

type VisionExamResult = {
    matched_count: number;
    total: number;
    score: number;
    feedback: LetterResult[];
};

const VISION_EXAM = "Efptozlpedpecfdedfczpfelopzddefpoteclefodpct";

export function checkVisionExam(
    transcription: string,
): VisionExamResult {

    const ref = VISION_EXAM.replace(/\s/g, '').toUpperCase();
    const trans = transcription.replace(/\s/g, '').toUpperCase();

    const n = ref.length;
    const m = trans.length;

    //LCS table: y axis = actual, x axis = transcription
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (ref[i - 1] === trans[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    //backtracking to find which actual letters were matched
    const matchedIndices = new Set<number>();
    let i = n, j = m;
    while (i > 0 && j > 0) {
        if (ref[i - 1] === trans[j - 1]) {
            matchedIndices.add(i - 1);
            i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    const feedback: LetterResult[] = ref.split('').map((letter, idx) => ({
        letter,
        matched: matchedIndices.has(idx),
    }));

    const matched_count = matchedIndices.size;
    const score = n > 0 ? Math.round((matched_count / n) * 1000) / 1000 : 0;

    return {
        matched_count,
        total: n,
        score,
        feedback,
    };
}