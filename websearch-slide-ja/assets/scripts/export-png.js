/* export-png.js
 * PNG / ZIP エクスポート: html2canvas + JSZip の動的ロード。
 *
 * 依存:
 *   - view-toggle.js  : currentView
 *   - navigation.js   : cur（現在スライドのインデックス）
 *
 * Step 4 の JS 統合順: fit-slide → theme-toggle → view-toggle → navigation → export-pdf → export-png
 *
 * 設計原則:
 *   1. 外部 CDN は「エクスポート操作時のみ」動的ロード。閲覧自体は完全自己完結を維持。
 *   2. 2 回目以降の呼び出しではロード済み <script> を再利用（重複ロードなし）。
 *   3. エラーは alert で明示通知。console.error だけだとユーザーが気づかない。
 *   4. キャプチャ範囲は .slide 要素そのもの（960×540 のネイティブサイズ）。
 *      hero モードの transform: scale() の影響を受けないよう width/height を明示指定。
 */

/* ==========================================================================
 * 1. CDN URL の定義
 * ========================================================================== */

const HTML2CANVAS_CDN = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
const JSZIP_CDN       = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

/* ==========================================================================
 * 2. 動的スクリプトロードのヘルパー
 * ========================================================================== */

/**
 * 指定 URL のスクリプトを動的にロードする。
 * 既にロード済みの場合は即座に resolve（重複ロードを防ぐ）。
 *
 * @param {string} src - スクリプトの URL
 * @returns {Promise<void>}
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 既にロード済みなら何もせず resolve
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = false; // 依存順を保つため非同期実行を抑制
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.head.appendChild(s);
    });
}

/* ==========================================================================
 * 3. html2canvas の共通オプション
 * ========================================================================== */

/**
 * html2canvas のオプションを生成する。
 * 現在のテーマ背景色を引き継ぐため、関数化して都度呼び出す。
 *
 * @returns {object} html2canvas のオプション
 */
function buildCanvasOptions() {
    return {
        width: 960,            // スライドのネイティブ幅
        height: 540,           // スライドのネイティブ高さ
        scale: 2,              // レティナ相当（1920×1080 で出力）
        useCORS: true,         // CORS 対応の外部画像をキャプチャ可能に
        allowTaint: false,     // 汚染キャンバスは作らない（CORS NG の画像は欠落させる）
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        logging: false,        // コンソールログを抑制
    };
}

/* ==========================================================================
 * 4. 単一スライド PNG エクスポート
 * ========================================================================== */

/**
 * 現在表示中のスライドを PNG としてダウンロードする。
 * hero モード・list モードどちらでも動作する。
 */
async function exportSinglePNG() {
    try {
        // 1. html2canvas を動的ロード（2 回目以降はキャッシュ）
        await loadScript(HTML2CANVAS_CDN);

        // 2. 現在スライドを取得
        const allSlides = document.querySelectorAll('.slide');
        const idx = (typeof cur !== 'undefined') ? cur : 0;
        const slide = allSlides[idx];

        if (!slide) {
            throw new Error('対象スライドが見つかりません');
        }

        // 3. キャプチャ
        const canvas = await html2canvas(slide, buildCanvasOptions());

        // 4. PNG として blob 化 → ダウンロード
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('PNG の生成に失敗しました');
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `slide-${String(idx + 1).padStart(2, '0')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');

    } catch (e) {
        showExportError('PNGエクスポート', e);
    }
}

/* ==========================================================================
 * 5. 全スライド ZIP エクスポート
 * ========================================================================== */

/**
 * 全スライドを PNG にキャプチャし、ZIP ファイルとしてダウンロードする。
 * 各スライドは slide-01.png 〜 slide-NN.png として連番格納される。
 */
async function exportAllPNG() {
    try {
        // 1. html2canvas と JSZip を並行ロード
        await Promise.all([
            loadScript(HTML2CANVAS_CDN),
            loadScript(JSZIP_CDN),
        ]);

        // 2. 全スライドを取得
        const allSlides = document.querySelectorAll('.slide');
        if (allSlides.length === 0) {
            throw new Error('スライドが見つかりません');
        }

        // 3. ZIP インスタンスを作成
        // eslint-disable-next-line no-undef
        const zip = new JSZip();

        // 4. 各スライドを順にキャプチャして ZIP に追加
        //    list モードでもキャプチャ可能だが、hero モードのほうがレイアウト計算が安定する
        //    ここでは現在のモードを維持し、html2canvas の width/height 指定で原寸を強制する
        for (let i = 0; i < allSlides.length; i++) {
            const canvas = await html2canvas(allSlides[i], buildCanvasOptions());
            const dataUrl = canvas.toDataURL('image/png');
            const base64 = dataUrl.split(',')[1];
            const filename = `slide-${String(i + 1).padStart(2, '0')}.png`;
            zip.file(filename, base64, { base64: true });
        }

        // 5. ZIP blob を生成してダウンロード
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'slides.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (e) {
        showExportError('ZIPエクスポート', e);
    }
}

/* ==========================================================================
 * 6. エラー通知ヘルパー
 * ========================================================================== */

/**
 * エクスポート失敗時にユーザーへ alert で通知する。
 * 失敗原因の候補を箇条書きで提示し、代替手段（PDF）を案内する。
 *
 * @param {string} action - 失敗した操作名（例: "PNGエクスポート"）
 * @param {Error}  error  - 発生したエラー
 */
function showExportError(action, error) {
    const message = [
        `${action}に失敗しました。`,
        '',
        '考えられる原因：',
        '・ネットワーク接続が不安定（CDN ロード失敗）',
        '・外部画像が CORS 未対応',
        '・ブラウザがダウンロードをブロックした',
        '',
        'オフライン環境では P キーから PDF エクスポートをご利用ください。',
        '',
        `詳細: ${error.message || error}`,
    ].join('\n');

    alert(message);
    console.error(`[${action}] ${error.message || error}`, error);
}
