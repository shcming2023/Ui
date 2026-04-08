/**
 * 全局 Mock 数据
 * 从各页面组件中集中迁移的静态数据，统一作为全局 Store 的初始状态
 */

import type {
  Material,
  ProcessTask,
  Task,
  Product,
  FlexibleTag,
  AiRule,
  AiRuleSettings,
  AssetDetail,
  AiConfig,
  MinerUConfig,
} from './types';

// ==================== 原始资料 ====================

/** 原始资料列表（初始数据） */
export const initialMaterials: Material[] = [];

// ==================== 处理任务 ====================

/** 处理中心任务列表（初始数据） */
export const initialProcessTasks: ProcessTask[] = [];

// ==================== 任务中心 ====================

/** 任务中心任务列表（初始数据） */
export const initialTasks: Task[] = [];

// ==================== 成品库 ====================

/** 成品列表（初始数据） */
export const initialProducts: Product[] = [];

// ==================== 标签 ====================

/** 灵活标签（初始数据） */
export const initialFlexibleTags: FlexibleTag[] = [];

// ==================== AI 规则 ====================

/** AI 自动标注规则（初始数据） */
export const initialAiRules: AiRule[] = [];

/** AI 规则执行设置（初始数据） */
export const initialAiRuleSettings: AiRuleSettings = {
  autoOnUpload: true,
  parallelExecution: true,
  requireManualReview: false,
  lowConfidenceAlert: true,
  confidenceThreshold: 85,
};

// ==================== AI 识别配置 ====================

/** AI 识别配置（默认值） */
export const initialAiConfig: AiConfig = {
  apiEndpoint: 'https://api.moonshot.cn/v1/chat/completions',
  apiKey: '',
  model: 'moonshot-v1-32k',
  timeout: 300, // 默认 5 分钟，适应大文本识别需求
  maxFileSize: 50 * 1024 * 1024, // AI 分析最大 50MB
  enabledFileTypes: ['.pdf', '.docx', '.doc', '.txt', '.md'],
  prompts: {
    title: '根据以下教育资料的内容，生成一个简洁准确的中文资料名称。要求：包含学科、年级、内容类型等关键信息，长度不超过30字。',
    subject: '分析以下教育资料的内容，识别其所属学科。返回值仅限：数学、语文、英语、物理、化学、生物、历史、地理、政治、其他。',
    grade: '根据以下教育资料的难度和知识点范围，判断其适用的学段/年级。返回值格式：小学/初中/高中/高三。',
    materialType: '判断以下教育资料的类型分类。可选值：真题、练习册、试卷、教学资料、讲义、课件、题库、其他。',
    tags: '从以下教育资料的 Markdown 内容中提取 3~8 个关键标签，包含学科、年级、考试类型、教材版本、知识点等维度。以逗号分隔的纯文本形式返回。',
    summary: '用 2-3 句话概括以下教育资料的核心内容和适用场景，用于在列表中快速了解资料概况。',
  },
};

/** MinerU API 配置（默认值） */
export const initialMinerUConfig: MinerUConfig = {
  apiMode: 'precise',
  apiEndpoint: 'https://mineru.net/api/v4/extract/task',
  apiKey: '',  // 请在系统设置页面配置 MinerU API Key，或通过环境变量注入
  timeout: 1200,
  modelVersion: 'vlm',
  enableOcr: false,
  enableFormula: true,
  enableTable: true,
  language: 'ch',
  maxFileSize: 100 * 1024 * 1024, // MinerU 解析最大 100MB
  maxPages: 500, // 最大 500 页
};

// ==================== 资产详情 ====================

/** 资产详情（初始数据） */
export const initialAssetDetails: Record<number, AssetDetail> = {};
