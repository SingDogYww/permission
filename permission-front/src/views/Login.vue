<template>
    <vue-particles id="tsparticles" :options="particlesOptions" />
    <div class="login-card">
        <div class="login-header">
            <div class="logo">
                <i class="fas fa-user-astronaut"></i>
            </div>
            <font-awesome-icon icon="fa-solid fa-user-astronaut" />
            <h1>未来科技平台</h1>
            <p>探索未来科技，开启无限可能</p>
        </div>

        <a-tabs v-model:activeKey="activeTab" centered>
            <!-- 用户名密码登录 -->
            <a-tab-pane key="1" tab="账号登录">
                <a-form :model="usernameForm" name="username-login" class="login-form" @finish="onUsernameLogin">
                    <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
                        <a-input v-model:value="usernameForm.username" placeholder="用户名/账号" size="large">
                            <template #prefix>
                                <i class="fas fa-user"></i>
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                        <a-input-password v-model:value="usernameForm.password" placeholder="密码" size="large">
                            <template #prefix>
                                <i class="fas fa-lock"></i>
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <div class="login-options">
                        <div class="remember-me">
                            <a-checkbox v-model:checked="usernameForm.remember">记住我</a-checkbox>
                        </div>
                        <a class="forgot-password" href="#">忘记密码?</a>
                    </div>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" class="login-btn" :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>

            <!-- 手机号登录 -->
            <a-tab-pane key="2" tab="手机登录">
                <a-form :model="phoneForm" name="phone-login" class="login-form" @finish="onPhoneLogin">
                    <a-form-item name="phone" :rules="[
                        { required: true, message: '请输入手机号!' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                    ]">
                        <a-input v-model:value="phoneForm.phone" placeholder="手机号码" size="large">
                            <template #prefix>
                                <i class="fas fa-mobile-alt"></i>
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
                        <div class="code-container">
                            <a-input v-model:value="phoneForm.code" placeholder="验证码" size="large" style="flex: 1">
                                <template #prefix>
                                    <i class="fas fa-sms"></i>
                                </template>
                            </a-input>
                            <a-button class="send-code-btn" :disabled="countdown > 0" @click="sendCode">
                                {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
                            </a-button>
                        </div>
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" class="login-btn" :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>

            <!-- 邮箱登录 -->
            <a-tab-pane key="3" tab="邮箱登录">
                <a-form :model="emailForm" name="email-login" class="login-form" @finish="onEmailLogin">
                    <a-form-item name="email" :rules="[
                        { required: true, message: '请输入邮箱!' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                    ]">
                        <a-input v-model:value="emailForm.email" placeholder="电子邮箱" size="large">
                            <template #prefix>
                                <i class="fas fa-envelope"></i>
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                        <a-input-password v-model:value="emailForm.password" placeholder="密码" size="large">
                            <template #prefix>
                                <i class="fas fa-lock"></i>
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <div class="login-options">
                        <div class="remember-me">
                            <a-checkbox v-model:checked="emailForm.remember">记住我</a-checkbox>
                        </div>
                        <a class="forgot-password" href="#">忘记密码?</a>
                    </div>

                    <a-form-item>
                        <a-button type="primary" html-type="submit" class="login-btn" :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>

        <div class="other-login">
            <span>其他登录方式</span>
            <div class="social-icons">
                <a href="#"><i class="fab fa-weixin"></i></a>
                <a href="#"><i class="fab fa-qq"></i></a>
                <a href="#"><i class="fab fa-weibo"></i></a>
                <a href="#"><i class="fab fa-github"></i></a>
            </div>
        </div>

        <div class="register-link">
            还没有账号? <a href="#">立即注册</a>
        </div>

        <div class="login-footer">
            © 2023 未来科技平台 | 隐私政策 | 服务条款
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 当前激活的标签页
const activeTab = ref('1');

// 加载状态
const loading = ref(false);

// 验证码倒计时
const countdown = ref(0);

// 用户名登录表单
const usernameForm = reactive({
    username: '',
    password: '',
    remember: false
});

// 手机登录表单
const phoneForm = reactive({
    phone: '',
    code: ''
});

// 邮箱登录表单
const emailForm = reactive({
    email: '',
    password: '',
    remember: false
});

// TSParticles 配置
const particlesOptions = ref({
    particles: {
        number: { value: 300, density: { value_area: 800 } },
        color: { value: "#00eeff" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: {
            value: {
                min: 1,
                max: 3
            }
        },
        links: {
            enable: true,
            distance: 150,
            color: "#00eeff",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out"
        }
    },
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: "push"
            },
            onHover: {
                enable: true,
                mode: "grab"
            }
        }
    }
})

// 发送验证码
const sendCode = () => {
    if (phoneForm.phone && /^1[3-9]\d{9}$/.test(phoneForm.phone)) {
        countdown.value = 60;
        const timer = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(timer);
            }
        }, 1000);
    }
};

// 用户名登录提交
const onUsernameLogin = () => {
    loading.value = true;
    console.log('用户名登录:', usernameForm);
    // 模拟登录请求
    setTimeout(() => {
        loading.value = false;
        alert('登录成功！');
    }, 1500);
};

// 手机登录提交
const onPhoneLogin = () => {
    loading.value = true;
    console.log('手机登录:', phoneForm);
    // 模拟登录请求
    setTimeout(() => {
        loading.value = false;
        alert('登录成功！');
    }, 1500);
};

// 邮箱登录提交
const onEmailLogin = () => {
    loading.value = true;
    console.log('邮箱登录:', emailForm);
    // 模拟登录请求
    setTimeout(() => {
        loading.value = false;
        alert('登录成功！');
    }, 1500);
};


</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    overflow: hidden;
    position: relative;
}

#app {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px;
    padding: 20px;
}

.login-card {
    position: relative;
    z-index: 20;
    width: 100%;
    padding: 40px;
    background: rgba(15, 23, 42, 0.85);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 238, 255, 0.2);
    overflow: hidden;
}

.login-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05), transparent);
    transform: rotate(0deg);
    animation: animate 6s linear infinite;
    z-index: -1;
}

@keyframes animate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
}

.logo {
    margin-bottom: 20px;
}

.logo i {
    font-size: 64px;
    color: #00eeff;
    text-shadow: 0 0 15px rgba(0, 238, 255, 0.6);
}

.login-header h1 {
    font-size: 32px;
    margin-bottom: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    background: linear-gradient(90deg, #00eeff, #00b4db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.login-header p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
}

.ant-tabs-tab {
    color: rgba(255, 255, 255, 0.7) !important;
    font-size: 16px;
    padding: 12px 20px !important;
    transition: all 0.3s;
}

.ant-tabs-tab-active {
    color: #00eeff !important;
}

.ant-tabs-tab:hover {
    color: #00eeff !important;
}

.ant-tabs-ink-bar {
    background: #00eeff !important;
    height: 3px !important;
}

.ant-tabs-nav::before {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.ant-form-item-label label {
    color: rgba(255, 255, 255, 0.8) !important;
}

.ant-input {
    background: rgba(255, 255, 255, 0.07) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: white !important;
    padding: 10px 15px !important;
    height: 46px !important;
    border-radius: 10px !important;
}

.ant-input:hover,
.ant-input:focus {
    border-color: #00eeff !important;
    box-shadow: 0 0 0 2px rgba(0, 238, 255, 0.2) !important;
}

.ant-input-affix-wrapper {
    background: rgba(255, 255, 255, 0.07) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 10px !important;
}

.ant-input-affix-wrapper:hover,
.ant-input-affix-wrapper-focused {
    border-color: #00eeff !important;
    box-shadow: 0 0 0 2px rgba(0, 238, 255, 0.2) !important;
}

.ant-input-affix-wrapper input {
    background: transparent !important;
    color: white !important;
}

.ant-input-prefix {
    color: rgba(255, 255, 255, 0.5) !important;
    margin-right: 8px !important;
}

.login-form .ant-form-item {
    margin-bottom: 24px;
}

.login-btn {
    width: 100%;
    height: 46px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(45deg, #00eeff, #00b4db) !important;
    border: none !important;
    border-radius: 10px !important;
    color: #0f2027 !important;
    transition: all 0.3s;
    margin-top: 10px;
}

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 238, 255, 0.4) !important;
}

.code-container {
    display: flex;
    gap: 15px;
}

.send-code-btn {
    flex: 0 0 120px;
    height: 46px;
    background: linear-gradient(45deg, #00b4db, #0083b0) !important;
    border: none !important;
    border-radius: 10px !important;
    color: white !important;
    transition: all 0.3s;
}

.send-code-btn:hover {
    background: linear-gradient(45deg, #0083b0, #00b4db) !important;
    box-shadow: 0 0 15px rgba(0, 180, 219, 0.4) !important;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
}

.remember-me .ant-checkbox-inner {
    background: rgba(255, 255, 255, 0.07) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
}

.remember-me .ant-checkbox-checked .ant-checkbox-inner {
    background: #00eeff !important;
    border-color: #00eeff !important;
}

.forgot-password {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.3s ease;
}

.forgot-password:hover {
    color: #00eeff;
}

.other-login {
    margin-top: 30px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    position: relative;
}

.other-login::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
}

.other-login span {
    background: rgba(15, 23, 42, 0.85);
    padding: 0 15px;
    position: relative;
    z-index: 1;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.social-icons a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    font-size: 20px;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-icons a:hover {
    background: rgba(0, 238, 255, 0.1);
    color: #00eeff;
    transform: translateY(-5px);
}

.register-link {
    text-align: center;
    margin-top: 25px;
    color: rgba(255, 255, 255, 0.7);
}

.register-link a {
    color: #00eeff;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    transition: all 0.3s ease;
}

.register-link a:hover {
    text-decoration: underline;
}

.login-footer {
    margin-top: 20px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}

.particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

/* 响应式设计 */
@media (max-width: 576px) {
    .login-card {
        padding: 30px 20px;
    }

    .login-header h1 {
        font-size: 26px;
    }

    .ant-tabs-tab {
        padding: 10px 15px !important;
        font-size: 14px;
    }

    .code-container {
        flex-direction: column;
        gap: 10px;
    }

    .send-code-btn {
        width: 100%;
    }
}
</style>