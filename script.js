// LIFF問卷表 JavaScript 主要邏輯
class SurveyApp {
    constructor() {
        this.liffId = '2007735873-3DPeBMbL'; // 請替換為您的LIFF ID
        this.gasUrl = 'https://script.google.com/macros/s/AKfycbzCsBRdDueWmHe0PRYf4Dy07VdViGqdjm488grKF-jzhPaZ0H3VjgeaQuZ3HczFV8vF/exec'; // 請替換為您的GAS Web App URL
        this.userProfile = null;
        this.isSubmitting = false;
        
        this.init();
    }

    // 初始化應用程式
    async init() {
        console.log('📋 [LOG] 開始初始化問卷表應用程式');
        
        try {
            // 檢查是否在LINE環境中
            if (typeof liff !== 'undefined') {
                await this.initializeLiff();
            } else {
                console.warn('⚠️ [LOG] 未在LINE環境中運行，使用測試模式');
                this.initTestMode();
            }
            
            this.setupEventListeners();
            this.setupFormInteractions();
            
            console.log('✅ [LOG] 問卷表應用程式初始化完成');
            
        } catch (error) {
            console.error('❌ [ERROR] 初始化失敗:', error);
            this.showError('初始化失敗，請重新整理頁面');
        }
    }

    // 初始化LIFF
    async initializeLiff() {
        console.log('🔄 [LOG] 正在初始化LIFF...');
        
        if (!this.liffId) {
            throw new Error('LIFF ID未設定，請在script.js中設定您的LIFF ID');
        }
        
        try {
            await liff.init({ liffId: this.liffId });
            console.log('✅ [LOG] LIFF初始化成功');
            
            if (liff.isLoggedIn()) {
                this.userProfile = await liff.getProfile();
                this.updateUserInfo();
                console.log('👤 [LOG] 用戶資訊載入成功:', this.userProfile.displayName);
            } else {
                console.log('🔐 [LOG] 用戶未登入，導向登入頁面');
                liff.login();
            }
            
        } catch (error) {
            console.error('❌ [ERROR] LIFF初始化失敗:', error);
            throw error;
        }
    }

    // 測試模式初始化
    initTestMode() {
        console.log('🧪 [LOG] 啟動測試模式');
        this.userProfile = {
            displayName: '測試用戶',
            userId: 'test-user-id',
            pictureUrl: ''
        };
        this.updateUserInfo();
    }

    // 更新用戶資訊顯示
    updateUserInfo() {
        const userInfoElement = document.getElementById('userInfo');
        if (this.userProfile) {
            userInfoElement.textContent = `歡迎您，${this.userProfile.displayName}！`;
            userInfoElement.style.opacity = '1';
            
            // 預填姓名欄位
            const nameInput = document.getElementById('name');
            if (nameInput && !nameInput.value) {
                nameInput.value = this.userProfile.displayName;
            }
        } else {
            userInfoElement.textContent = '歡迎填寫問卷！';
        }
    }

    // 設定事件監聽器
    setupEventListeners() {
        console.log('🎯 [LOG] 設定事件監聽器');
        
        // 表單提交事件
        const form = document.getElementById('surveyForm');
        form.addEventListener('submit', this.handleSubmit.bind(this));

        // 推薦度滑桿事件
        const recommendationSlider = document.getElementById('recommendation');
        recommendationSlider.addEventListener('input', this.updateRecommendationValue.bind(this));

        // 表單驗證事件
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', this.validateField.bind(this));
            field.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    // 設定表單互動效果
    setupFormInteractions() {
        console.log('✨ [LOG] 設定表單互動效果');
        
        // 添加聚焦效果
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });

        // 初始化推薦度值顯示
        this.updateRecommendationValue();
    }

    // 更新推薦度值顯示
    updateRecommendationValue() {
        const slider = document.getElementById('recommendation');
        const valueDisplay = document.getElementById('recommendationValue');
        valueDisplay.textContent = slider.value;
    }

    // 驗證單個欄位
    validateField(event) {
        const field = event.target;
        const formGroup = field.closest('.form-group');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            formGroup.classList.add('error');
            return false;
        } else {
            formGroup.classList.remove('error');
            return true;
        }
    }

    // 清除欄位錯誤狀態
    clearFieldError(event) {
        const field = event.target;
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    }

    // 驗證整個表單
    validateForm(form) {
        console.log('🔍 [LOG] 開始驗證表單');
        
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.remove('error');
            }
        });
        
        // 驗證滿意度單選按鈕
        const satisfactionRadios = form.querySelectorAll('input[name="satisfaction"]');
        const satisfactionChecked = Array.from(satisfactionRadios).some(radio => radio.checked);
        
        if (!satisfactionChecked) {
            const satisfactionGroup = satisfactionRadios[0].closest('.form-group');
            satisfactionGroup.classList.add('error');
            isValid = false;
        }
        
        console.log(isValid ? '✅ [LOG] 表單驗證通過' : '❌ [LOG] 表單驗證失敗');
        return isValid;
    }

    // 收集表單資料
    collectFormData(form) {
        console.log('📋 [LOG] 收集表單資料');
        
        const formData = new FormData(form);
        const data = {};
        
        // 基本資料
        data.timestamp = new Date().toISOString();
        data.userId = this.userProfile ? this.userProfile.userId : 'anonymous';
        data.displayName = this.userProfile ? this.userProfile.displayName : '匿名用戶';
        
        // 表單資料
        data.name = formData.get('name');
        data.email = formData.get('email');
        data.age = formData.get('age');
        data.occupation = formData.get('occupation');
        data.satisfaction = formData.get('satisfaction');
        data.recommendation = formData.get('recommendation');
        data.feedback = formData.get('feedback') || '';
        
        // 收集複選框資料
        const interests = formData.getAll('interests');
        data.interests = interests.join(', ');
        
        console.log('📊 [LOG] 收集到的資料:', data);
        return data;
    }

    // 處理表單提交
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            console.log('⏳ [LOG] 表單正在提交中，忽略重複提交');
            return;
        }
        
        console.log('🚀 [LOG] 開始處理表單提交');
        
        const form = event.target;
        
        // 驗證表單
        if (!this.validateForm(form)) {
            console.log('❌ [LOG] 表單驗證失敗，停止提交');
            this.showError('請填寫所有必填欄位');
            return;
        }
        
        // 設定提交狀態
        this.isSubmitting = true;
        this.setSubmitButtonState(true);
        
        try {
            // 收集資料
            const data = this.collectFormData(form);
            
            // 提交資料
            await this.submitData(data);
            
            console.log('✅ [LOG] 問卷提交成功');
            this.showSuccess();
            
        } catch (error) {
            console.error('❌ [ERROR] 問卷提交失敗:', error);
            this.showError('提交失敗，請稍後再試');
            
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
        }
    }

    // 提交資料到GAS
    async submitData(data) {
        console.log('📤 [LOG] 開始提交資料到GAS');
        
        if (!this.gasUrl) {
            throw new Error('GAS URL未設定，請在script.js中設定您的GAS Web App URL');
        }
        
        try {
            // 使用JSONP方式避免CORS問題
            const result = await this.makeJSONPRequest(data);
            console.log('📨 [LOG] GAS回應:', result);
            
            if (result.success) {
                console.log('✅ [LOG] 資料成功寫入Google Sheet');
                return result;
            } else {
                throw new Error(result.error || '未知錯誤');
            }
            
        } catch (error) {
            console.error('❌ [ERROR] 提交到GAS失敗:', error);
            throw error;
        }
    }

    // 使用JSONP方式發送請求
    makeJSONPRequest(data) {
        return new Promise((resolve, reject) => {
            // 生成唯一的callback函數名
            const callbackName = 'jsonpCallback' + Date.now() + Math.random().toString(36).substr(2, 9);
            
            // 建立全域callback函數
            window[callbackName] = (result) => {
                // 清理
                document.head.removeChild(script);
                delete window[callbackName];
                
                resolve(result);
            };
            
            // 建立參數
            const params = new URLSearchParams();
            params.append('action', 'submit');
            params.append('callback', callbackName);
            
            // 添加所有資料作為URL參數
            Object.keys(data).forEach(key => {
                params.append(key, data[key]);
            });
            
            const url = `${this.gasUrl}?${params.toString()}`;
            console.log('🔗 [LOG] JSONP請求URL:', url);
            
            // 建立script標籤
            const script = document.createElement('script');
            script.src = url;
            
            // 處理錯誤
            script.onerror = () => {
                // 清理
                document.head.removeChild(script);
                delete window[callbackName];
                
                reject(new Error('JSONP請求失敗'));
            };
            
            // 設定超時
            setTimeout(() => {
                if (window[callbackName]) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('請求超時'));
                }
            }, 30000); // 30秒超時
            
            // 執行請求
            document.head.appendChild(script);
        });
    }

    // 設定提交按鈕狀態
    setSubmitButtonState(isLoading) {
        const button = document.getElementById('submitBtn');
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // 顯示成功訊息
    showSuccess() {
        console.log('🎉 [LOG] 顯示成功訊息');
        
        const form = document.getElementById('surveyForm');
        const successMessage = document.getElementById('successMessage');
        
        form.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.classList.add('fade-in');
        
        // 3秒後可以關閉LIFF視窗
        setTimeout(() => {
            if (typeof liff !== 'undefined' && liff.isInClient()) {
                liff.closeWindow();
            }
        }, 3000);
    }

    // 顯示錯誤訊息
    showError(message) {
        console.error('💥 [ERROR] 顯示錯誤訊息:', message);
        
        const form = document.getElementById('surveyForm');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        errorText.textContent = message;
        form.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.classList.add('fade-in');
    }
}

// 當頁面載入完成時初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 [LOG] 頁面載入完成，初始化問卷表應用程式');
    new SurveyApp();
});

// 錯誤處理
window.addEventListener('error', (event) => {
    console.error('💥 [ERROR] 全域錯誤:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 [ERROR] 未處理的Promise拒絕:', event.reason);
}); 
