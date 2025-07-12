# LIFF問卷表專案

## 📋 專案簡介

此專案使用LINE Front-end Framework (LIFF) 建立一個功能完整的問卷表，結合Google Apps Script (GAS) 將問卷資料自動記錄到Google Sheet中。

### 🎯 主要功能

- **現代化UI設計**：採用響應式設計，支援手機和桌面裝置
- **LIFF整合**：自動獲取LINE用戶資訊，提供個人化體驗
- **表單驗證**：完整的前端驗證機制，確保資料完整性
- **自動化記錄**：問卷資料自動記錄到Google Sheet
- **錯誤處理**：統一的錯誤處理機制，提供友善的錯誤訊息
- **詳細日誌**：完整的操作記錄，方便追蹤和除錯
- **安全性**：包含來源驗證和資料驗證機制

## 📁 專案結構

```
LINE功能串接/
├── index.html          # LIFF問卷表主頁面
├── style.css           # 樣式表檔案
├── script.js           # 前端JavaScript邏輯
├── gas-script.js       # Google Apps Script代碼
└── README.md           # 專案說明文件
```

## 🚀 快速開始

### 步驟1：設定Google Sheet

1. 建立一個新的Google Sheet
2. 記錄Google Sheet的ID（從URL中取得）
3. 將Google Sheet設定為可編輯狀態

### 步驟2：建立Google Apps Script

1. 前往 [Google Apps Script](https://script.google.com/)
2. 建立新專案
3. 將 `gas-script.js` 的內容複製到腳本編輯器中
4. 修改 `CONFIG` 設定：
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_GOOGLE_SHEET_ID', // 替換為您的Google Sheet ID
     SHEET_NAME: '問卷回應',
     ALLOWED_ORIGINS: ['https://your-domain.com'], // 替換為您的網域
     LOG_SHEET_NAME: '操作記錄'
   };
   ```
5. 儲存專案並部署為Web App：
   - 點擊「部署」→「新增部署」
   - 選擇「Web App」類型
   - 執行身分選擇「我」
   - 存取權限選擇「任何人」
   - 記錄部署後的Web App URL

### 步驟3：設定LIFF應用程式

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇您的LINE Bot頻道
3. 在「LIFF」分頁中新增LIFF應用程式：
   - 名稱：問卷表
   - 大小：Full
   - 端點URL：您的網頁託管URL
4. 記錄LIFF ID

### 步驟4：配置前端檔案

1. 修改 `script.js` 中的設定：
   ```javascript
   constructor() {
       this.liffId = 'YOUR_LIFF_ID'; // 替換為您的LIFF ID
       this.gasUrl = 'YOUR_GAS_WEB_APP_URL'; // 替換為您的GAS Web App URL
       // ...
   }
   ```

### 步驟5：部署網頁

1. 將 `index.html`、`style.css`、`script.js` 上傳到您的網頁伺服器
2. 確保HTTPS連線（LIFF要求）
3. 在LINE Developers Console中更新LIFF端點URL

## 🔧 設定詳細說明

### Google Apps Script設定

#### 必要設定項目

```javascript
const CONFIG = {
  SPREADSHEET_ID: '', // Google Sheet ID
  SHEET_NAME: '問卷回應', // 主要資料工作表名稱
  ALLOWED_ORIGINS: ['https://your-domain.com'], // 允許的來源網域
  LOG_SHEET_NAME: '操作記錄' // 記錄操作的工作表名稱
};
```

#### 權限設定

確保Google Apps Script有以下權限：
- Google Sheets API
- Google Drive API（用於存取試算表）

### LIFF設定

#### 必要設定項目

```javascript
// 在script.js中設定
this.liffId = 'YOUR_LIFF_ID'; // 從LINE Developers Console取得
this.gasUrl = 'YOUR_GAS_WEB_APP_URL'; // 從Google Apps Script部署取得
```

#### LIFF應用程式設定

- **類型**：Web App
- **大小**：Full（推薦）
- **端點URL**：您的網頁URL（必須是HTTPS）

## 📊 資料結構

### 問卷資料欄位

| 欄位名稱 | 資料類型 | 必填 | 描述 |
|---------|---------|------|------|
| 時間戳記 | 字串 | 是 | 問卷填寫時間 |
| 用戶ID | 字串 | 是 | LINE用戶ID |
| 顯示名稱 | 字串 | 是 | LINE用戶顯示名稱 |
| 姓名 | 字串 | 是 | 用戶填寫的姓名 |
| 電子信箱 | 字串 | 是 | 用戶電子信箱 |
| 年齡 | 字串 | 是 | 年齡範圍 |
| 職業 | 字串 | 是 | 用戶職業 |
| 滿意度 | 字串 | 是 | 服務滿意度 |
| 推薦度 | 數字 | 是 | 推薦度評分（1-10） |
| 回饋建議 | 字串 | 否 | 用戶回饋內容 |
| 興趣類型 | 字串 | 否 | 用戶感興趣的資訊類型 |
| 提交時間 | 字串 | 是 | 伺服器記錄時間 |

## 🛠️ 功能特色

### 前端功能

- **響應式設計**：適配各種裝置螢幕
- **即時驗證**：表單欄位即時驗證
- **視覺回饋**：載入動畫和狀態提示
- **錯誤恢復**：友善的錯誤處理和恢復機制
- **無障礙設計**：符合網頁無障礙標準

### 後端功能

- **資料驗證**：嚴格的伺服器端資料驗證
- **自動記錄**：問卷資料自動記錄到Google Sheet
- **操作日誌**：詳細的操作記錄和錯誤追蹤
- **安全性**：來源驗證和資料過濾
- **自動維護**：自動清理舊記錄

## 📝 使用說明

### 用戶操作流程

1. 用戶透過LINE開啟LIFF應用程式
2. 系統自動獲取用戶LINE資訊
3. 用戶填寫問卷表單
4. 系統驗證表單資料
5. 資料提交到Google Apps Script
6. 資料記錄到Google Sheet
7. 顯示成功或錯誤訊息

### 管理員操作

1. **查看回應**：直接在Google Sheet中查看問卷回應
2. **監控日誌**：查看「操作記錄」工作表監控系統狀態
3. **匯出資料**：使用Google Sheet的匯出功能
4. **統計分析**：使用Google Sheet的圖表功能進行資料分析

## 🔍 錯誤排除

### 常見問題

#### 1. LIFF無法初始化
- **原因**：LIFF ID設定錯誤或未設定
- **解決方案**：檢查並正確設定LIFF ID

#### 2. 資料無法提交
- **原因**：GAS URL錯誤或權限問題
- **解決方案**：檢查GAS Web App部署設定和權限

#### 3. Google Sheet無法寫入
- **原因**：Google Sheet ID錯誤或權限不足
- **解決方案**：檢查Google Sheet ID和GAS權限設定

#### 4. 跨域請求失敗
- **原因**：來源網域未在允許列表中
- **解決方案**：在GAS中設定正確的ALLOWED_ORIGINS

### 除錯方法

1. **查看瀏覽器控制台**：檢查JavaScript錯誤訊息
2. **檢查GAS日誌**：在Apps Script編輯器中查看執行日誌
3. **查看操作記錄**：在Google Sheet的「操作記錄」工作表中查看詳細記錄
4. **使用測試功能**：在GAS中執行testFunction()進行測試

## 🚨 安全性注意事項

### 資料保護

- 所有資料傳輸使用HTTPS加密
- 實施嚴格的資料驗證機制
- 記錄所有操作以供稽核

### 存取控制

- 設定允許的來源網域
- 驗證用戶LINE身分
- 限制API存取權限

### 隱私權保護

- 僅收集必要的用戶資訊
- 遵守相關隱私權法規
- 提供資料刪除機制

## 🔄 版本更新記錄

### v1.0.0 (2024-01-01)
- ✅ 初始版本發佈
- ✅ 完整的LIFF問卷表功能
- ✅ Google Apps Script整合
- ✅ 響應式設計
- ✅ 完整的錯誤處理機制
- ✅ 詳細的日誌記錄
- ✅ 自動化維護功能

## 📞 技術支援

如果您在使用過程中遇到任何問題，請：

1. 首先查看本README檔案的錯誤排除章節
2. 檢查瀏覽器控制台和GAS日誌
3. 查看Google Sheet中的操作記錄

## 📄 授權條款

本專案採用MIT授權條款，詳情請參考專案根目錄的LICENSE檔案。

## 🤝 貢獻指南

歡迎提交Issue和Pull Request來改進此專案。在提交之前，請確保：

1. 遵循現有的代碼風格
2. 新增適當的測試
3. 更新相關文件
4. 確保所有測試通過

---

**注意**：使用此專案前，請確保您已經具備LINE Bot開發和Google Apps Script的基本知識。 
