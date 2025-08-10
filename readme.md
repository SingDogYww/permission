# 权限管理系统

一个功能完整的用户权限管理系统，采用前后端分离架构，支持用户注册、登录、权限控制等功能。

## 技术栈

### 后端
- **Java 17** - 核心开发语言
- **Spring Boot 3.x** - 应用框架
- **Spring Security** - 安全认证
- **Spring Data JPA** - 数据访问层
- **MySQL** - 数据库
- **JWT** - 令牌认证
- **Maven** - 项目管理

### 前端
- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Ant Design Vue** - UI组件库
- **Axios** - HTTP客户端
- **Vite** - 构建工具

## 功能特性

### 🔐 用户认证
- **用户注册** - 支持手机号/邮箱验证
- **用户登录** - JWT令牌认证
- **密码重置** - 通过验证码重置密码
- **账户激活** - 邮箱/短信验证

### 👥 用户管理
- **用户信息管理** - 个人资料修改
- **头像上传** - 支持图片上传
- **账户状态** - 启用/禁用管理

### 🛡️ 权限控制
- **角色管理** - 系统角色定义
- **权限分配** - 细粒度权限控制
- **访问控制** - 基于角色的访问控制(RBAC)

### 📱 用户体验
- **响应式设计** - 适配各种设备
- **炫酷动画** - 粒子背景和过渡效果
- **消息提示** - 优雅的用户反馈
- **加载状态** - 操作状态反馈

## 项目结构

```
permission/
├── permission-backend/     # 后端服务
│   ├── src/main/java/
│   │   └── com/example/permission/
│   │       ├── controller/     # 控制器层
│   │       ├── service/        # 服务层
│   │       ├── entity/         # 实体类
│   │       ├── repository/     # 数据访问层
│   │       ├── config/         # 配置类
│   │       └── security/       # 安全配置
│   └── src/main/resources/
│       └── application.yml     # 应用配置
├── permission-front/       # 前端应用
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── views/          # 页面视图
│   │   ├── api/            # API接口
│   │   ├── types/          # 类型定义
│   │   ├── stores/         # 状态管理
│   │   └── router/         # 路由配置
│   └── public/             # 静态资源
└── README.md
```

## 快速开始

### 环境要求
- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Maven 3.6+**

### 后端启动

1. **数据库配置**
   ```bash
   # 创建数据库
   CREATE DATABASE permission_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **修改配置**
   ```yaml
   # permission-backend/src/main/resources/application.yml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/permission_db
       username: your_username
       password: your_password
   ```

3. **启动服务**
   ```bash
   cd permission-backend
   ./mvnw spring-boot:run
   ```

### 前端启动

1. **安装依赖**
   ```bash
   cd permission-front
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问应用**
   ```
   http://localhost:5173
   ```

## API接口

### 认证相关
- `POST /api/auth/register-basic` - 基础信息注册
- `POST /api/auth/send-phone-code` - 发送手机验证码
- `POST /api/auth/send-email-code` - 发送邮箱验证码
- `POST /api/auth/bind-phone` - 绑定手机号
- `POST /api/auth/bind-email` - 绑定邮箱
- `POST /api/auth/complete-registration` - 完成注册
- `POST /api/auth/login` - 用户登录

### 用户相关
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/upload-avatar` - 上传头像

## 开发说明

### 代码规范
- 后端遵循阿里巴巴Java开发规范
- 前端使用ESLint + Prettier格式化
- 提交信息遵循Conventional Commits规范

### 测试
```bash
# 后端测试
cd permission-backend
./mvnw test

# 前端测试
cd permission-front
npm run test
```

### 构建部署
```bash
# 后端构建
cd permission-backend
./mvnw clean package

# 前端构建
cd permission-front
npm run build
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请提交 Issue 或联系开发者。

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 