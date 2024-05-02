<div align="center">
  <img src="./src/assets/logo_color.svg" width="128" height="128"/>
  <h2 style="margin-top: 0;">ConFlux Client</h2>
  <p>
    <strong>🎥 又一个视频会议与协作平台</strong>
  </p>
  <p>
    <img alt="WebRTC" src="https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=WebRTC&logoColor=white"/>
    <img alt="Socket.io" src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white"/>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
    <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
    <img alt="TypeScript" src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
  </p>
  <h4>
    <a href="https://conflux.liukairui.me/">在线演示</a>
    <span> | </span>
    <a href="./README.md">English</a>
    <span> | </span>
    <a href="./README-CN.md">简体中文</a>
  </h4>
</div>



### ✨ 特性

- 基于 WebRTC 的多人 P2P 视频会议
- 本地用户, 无需注册, 无需登录
- 支持会议预约与邀请码入会
- 支持视频背景替换
- 支持屏幕共享
- 支持会议聊天室
- 支持音视频设备测试与切换
- 支持会议成员权限管理 (设置联席主持人, 禁言, 踢出)
- 实时流量监控

### 🛠️ 安装

```bash
# 安装pnpm
> npm install -g pnpm

# 安装全部依赖
> pnpm install

# 安装某个依赖
> pnpm install xxx  -D/-S

# 运行
> pnpm dev

# 打包
> pnpm build
```

### 🥰 参考

- 视频背景替换的实现参考自 [Volcomix/virtual-background](https://github.com/Volcomix/virtual-background) , 使用了 [google/mediapipe](https://github.com/google/mediapipe) 的 [Meet Segmentation](https://drive.google.com/file/d/1lnP1bRi9CSqQQXUHa13159vLELYDgDu0/preview) 模型
