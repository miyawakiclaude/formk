// ═══════════════════════════════════════════
// KatagrMa TR申込フォーム - Google Apps Script
// ═══════════════════════════════════════════

const SHEET_ID = 'YOUR_SPREADSHEET_ID'; // ← スプレッドシートのIDに書き換える
const SHEET_NAME_RAW  = '申込データ';
const SHEET_NAME_SUMMARY = '月次集計';

// ─── POST受信（フォーム送信） ───
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    writeToSheet(data);
    updateMonthlySummary();
    return jsonResponse({ status: 'ok' });
  } catch(err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ─── GET受信（管理画面データ取得） ───
function doGet(e) {
  const action = e.parameter.action || '';
  if (action === 'summary') {
    return jsonResponse(getSummaryData());
  }
  return jsonResponse({ status: 'ok', message: 'KatagrMa TR API' });
}

// ─── スプレッドシートへの書き込み ───
function writeToSheet(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME_RAW);

  // シートがなければ作成＆ヘッダー設定
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_RAW);
    const headers = [
      '送信日時', '希望プロダクト', '希望機能', '希望施設数',
      '自己評価実施時期', '個人面談実施時期', '保護者アンケート実施時期',
      '法人名', '法人名フリガナ', '代表者氏名', '代表者氏名フリガナ',
      '代表者役職', '電話番号', '代表メールアドレス', '施設種別',
      '本部担当者氏名', '本部担当者フリガナ', '本部担当者役職', '本部アカウントメール',
      'レクチャー会予約済み',
    ];
    // 施設列ヘッダー（最大12施設）
    for (let i = 1; i <= 12; i++) {
      headers.push(
        `施設${i}_種別`, `施設${i}_施設名`, `施設${i}_施設名フリガナ`,
        `施設${i}_担当者氏名`, `施設${i}_担当者フリガナ`,
        `施設${i}_役職`, `施設${i}_電話番号`, `施設${i}_メールアドレス`
      );
    }
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#1a1a2e').setFontColor('#CFDB00').setFontWeight('bold');
  }

  // データ行を作成
  const now = new Date();
  const row = [
    Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss'),
    data.trialICT || '',
    (data.functions || []).join('・'),
    data.facilityCount || 0,
    data.jikoTime || '',
    data.menTime || '',
    data.hogoTime || '',
    data.corpName || '',
    data.corpNameKana || '',
    data.repName || '',
    data.repNameKana || '',
    data.repPos || '',
    data.tel || '',
    data.email || '',
    (data.facilityTypes || []).join('・'),
    data.honbuName || '',
    data.honbuNameKana || '',
    data.honbuPos || '',
    data.honbuEmail || '',
    data.lectureBooked || '',
  ];

  // 施設データ（最大12施設）
  const facilities = data.facilities || [];
  for (let i = 0; i < 12; i++) {
    const f = facilities[i] || {};
    row.push(f.type||'', f.name||'', f.nameKana||'', f.contact||'', f.contactKana||'', f.pos||'', f.tel||'', f.email||'');
  }

  sheet.appendRow(row);

  // 列幅の自動調整（初回のみ重いので10行ごと）
  if (sheet.getLastRow() % 10 === 2) {
    sheet.autoResizeColumns(1, 20);
  }
}

// ─── 月次集計シート更新 ───
function updateMonthlySummary() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const rawSheet = ss.getSheetByName(SHEET_NAME_RAW);
  if (!rawSheet || rawSheet.getLastRow() < 2) return;

  let summarySheet = ss.getSheetByName(SHEET_NAME_SUMMARY);
  if (!summarySheet) {
    summarySheet = ss.insertSheet(SHEET_NAME_SUMMARY);
  }
  summarySheet.clearContents();

  // 集計
  const data = rawSheet.getRange(2, 1, rawSheet.getLastRow() - 1, 4).getValues();
  const monthly = {};
  data.forEach(row => {
    const dateStr = row[0]; // 送信日時
    if (!dateStr) return;
    const d = new Date(dateStr);
    const ym = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!monthly[ym]) monthly[ym] = { count: 0, facilities: 0 };
    monthly[ym].count++;
    monthly[ym].facilities += Number(row[3]) || 0;
  });

  // ヘッダー
  summarySheet.appendRow(['年月', '申込件数（法人数）', '施設数合計']);
  summarySheet.getRange(1,1,1,3).setBackground('#1a1a2e').setFontColor('#CFDB00').setFontWeight('bold');

  // 月次データ（新しい順）
  Object.keys(monthly).sort().reverse().forEach(ym => {
    summarySheet.appendRow([ym, monthly[ym].count, monthly[ym].facilities]);
  });

  summarySheet.autoResizeColumns(1, 3);
}

// ─── 管理画面用データ取得 ───
function getSummaryData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const rawSheet = ss.getSheetByName(SHEET_NAME_RAW);
  if (!rawSheet || rawSheet.getLastRow() < 2) {
    return { totalCorps: 0, totalFacilities: 0, monthly: [] };
  }

  const data = rawSheet.getRange(2, 1, rawSheet.getLastRow() - 1, 4).getValues();
  const monthly = {};
  let totalFacilities = 0;

  data.forEach(row => {
    const dateStr = row[0];
    if (!dateStr) return;
    const d = new Date(dateStr);
    const ym = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!monthly[ym]) monthly[ym] = { corps: 0, facilities: 0 };
    monthly[ym].corps++;
    const fac = Number(row[3]) || 0;
    monthly[ym].facilities += fac;
    totalFacilities += fac;
  });

  const monthlyArr = Object.keys(monthly).sort().reverse().map(ym => ({
    ym,
    corps: monthly[ym].corps,
    facilities: monthly[ym].facilities,
  }));

  return {
    totalCorps: data.filter(r => r[0]).length,
    totalFacilities,
    monthly: monthlyArr,
  };
}

// ─── CORSヘッダー付きJSONレスポンス ───
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
