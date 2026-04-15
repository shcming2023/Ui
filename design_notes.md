# UI设计稿关键视觉信息

## 总体设计语言
- 左侧边栏：深蓝色logo区域 + 白色背景导航菜单，选中项蓝色高亮背景+蓝色文字
- 顶部导航栏：白色背景，左侧品牌名，中间导航标签（DASHBOARD/COURSES/LIBRARY），右侧搜索框+通知铃铛+帮助图标+用户头像+蓝色"Create Content"按钮
- 侧边栏底部：升级计划卡片（蓝色按钮）+ Settings + Support
- 4个导航项：DASHBOARD, COURSE MATERIALS, STUDENT ASSETS, METADATA

## image-0: 正式教学成果页（Student Assets Gallery）
- 面包屑：FINALIZED MATERIALS > BATCH 2024.04
- 标题：Student Assets Gallery + 描述文字
- 筛选标签栏：All Materials(蓝色选中), Interactive PDF, Video Lessons, Source Files + SORT BY下拉
- 卡片网格（3列）：每张卡片有封面图+标签（VERIFIED/LEVEL标签）+标题+类型标签(PDF/VIDEO/ASSETS)+描述+操作按钮
- 精选横幅：大图+MASTERCLASS/HIGHEST RATED标签+标题+描述+License按钮+用户头像
- 底部继续卡片网格

## image-1: 仪表盘Dashboard
- 欢迎区：CURATOR WORKSPACE标签 + "Welcome back, Dr. Julian." + 描述
- 4个统计卡片横排：Total Courses(24), Active Students(1,842), Storage Used(85%带进度条), Pending Reviews(12带头像)
- 每个卡片顶部有彩色装饰条（蓝/蓝/橙/蓝绿）
- Recently Modified Materials列表：图标+文件名+类型+修改时间+大小+更多按钮
- 右侧：Student Submissions卡片（头像+名字+提交内容+REVIEW/SKIP按钮）
- Growth Insight卡片（深色背景+闪电图标+数据）

## image-2: 教学资源库（Source Library / Course Materials）
- 标题：Source Library + 描述
- 3个统计卡片：Storage Status(蓝色背景74.2GB+进度条), Active Resources(1,204), Pending Reviews(18)
- 筛选栏：CATEGORY:ALL + DATE ADDED + 网格/列表视图切换 + BATCH UPLOAD蓝色按钮
- 资源卡片网格（4列）：封面图+类型标签(PDF/VIDEO/QUIZ/ZIP)+学科标签+标题+元信息
- RECENT ACTIVITY表格：FILE NAME, AUTHOR, STATUS, ACTIONS

## image-3: 元数据管理（Metadata）
- 左侧列表：资源列表，每项有类型标签(VIDEO/PDF GUIDE/INTERACTIVE)+标题+描述+更新时间
- 右侧详情面板：面包屑+资源ID+大标题+DISCARD/SAVE CHANGES按钮
- CLASSIFICATION区域：Subject Area下拉+Grade Level下拉+Learning Objectives文本框
- TAGS & TAXONOMY区域：标签chips(可删除)+ADD TAG按钮
- GOVERNANCE区域：Public Access开关+Downloadable开关+Copyright License下拉
- ASSET PREVIEW区域：视频预览+时长+分辨率

## 关键设计特征
1. 圆角卡片设计（大圆角约12-16px）
2. 蓝色主色调（#2563EB类似）
3. 统计卡片顶部有彩色装饰条
4. 标签/徽章使用不同颜色区分类型
5. 整体留白充足，间距宽松
6. 字体层次分明：大标题粗体、小标题中等、描述文字灰色
7. 操作按钮使用蓝色填充或蓝色边框样式
