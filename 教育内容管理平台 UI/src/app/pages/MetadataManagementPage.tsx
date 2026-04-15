import { Search, Filter, ChevronRight, Download, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import imgPreview from '../../imports/元数据管理Metadata/389f8e98b6bd271e505b240a8deeb3d2923056f0.png';

const assets = [
  {
    id: 1,
    title: 'Advanced Quantum Mechanics: Particle Duality',
    type: 'VIDEO',
    description: 'Comprehensive introduction on quantum field theory experiments and mathematical modeling for senior...',
    addedDate: '03-25-22'
  },
  {
    id: 2,
    title: 'Microeconomics 101: Supply Curves',
    type: 'WHITEBOARD',
    description: 'Interactive economics breakdown with current market specifications',
    addedDate: '03-24-22'
  },
  {
    id: 3,
    title: 'World History: The Silk Road Map',
    type: 'READING',
    description: 'Interactive historical data with current and future specifications',
    addedDate: '03-20-22'
  },
  {
    id: 4,
    title: 'Python for Data Science: Arrays',
    type: 'VIDEO',
    description: 'At a glance overview and logical integration supporting familiarity integration',
    addedDate: '03-18-22'
  }
];

const selectedAsset = {
  title: 'Quantum Mechanics: Particle Duality',
  description: 'Describing what the student or observer would gain from the quantum mechanical perspective-dualistic, conceptual...',
  classification: {
    subject: 'Physics',
    grade: 'Year 2',
    topic: 'N/P'
  },
  governance: {
    publicAccess: true,
    downloadable: false
  },
  copyright: {
    version: '3.0',
    creativeCommons: 'CC BY-SA'
  },
  physicalInfo: {
    dualNature: 'Quantum',
    question: '*',
    andMore: '+ADD NEW'
  }
};

export function MetadataManagementPage() {
  const [activeAssetId, setActiveAssetId] = useState(1);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50/30 overflow-hidden">
      {/* Left Sidebar - Assets List */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">FOR EDUCATIONAL ASSETS</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              FILTER
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setActiveAssetId(asset.id)}
              className={`w-full p-5 border-b border-slate-100 text-left transition-colors ${
                activeAssetId === asset.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  asset.type === 'VIDEO' ? 'bg-blue-100 text-blue-700' :
                  asset.type === 'WHITEBOARD' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {asset.type}
                </span>
                <span className="text-xs text-slate-500">Added {asset.addedDate}</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-1 line-clamp-1">{asset.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{asset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Asset Details */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
            <span>METADATA LIBRARY</span>
            <ChevronRight className="w-4 h-4" />
            <span>DASHBOARD</span>
            <ChevronRight className="w-4 h-4" />
            <span>COURSES</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">LIBRARY</span>
          </div>

          {/* Title and Actions */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{selectedAsset.title}</h1>
              <p className="text-slate-600 max-w-2xl">{selectedAsset.description}</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              CURATED PUBLISH
            </button>
          </div>

          {/* Metadata Sections */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Classification */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">CLASSIFICATION</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                    SUBJECT
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedAsset.classification.subject}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
                    />
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                    GRADE LEVEL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedAsset.classification.grade}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
                    />
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                    TOPIC/THEME
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedAsset.classification.topic}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
                    />
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Governance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">GOVERNANCE</h2>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Public Access</p>
                    <p className="text-xs text-slate-600">Available to all viewers</p>
                  </div>
                  <ToggleRight className="w-12 h-6 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Downloadable</p>
                    <p className="text-xs text-slate-600">Allow local saves</p>
                  </div>
                  <ToggleLeft className="w-12 h-6 text-slate-300" />
                </div>
              </div>
            </div>

            {/* Copyright License */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">COPYRIGHT LICENSE</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                    LICENSE VERSION
                  </label>
                  <input
                    type="text"
                    value={selectedAsset.copyright.version}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                    CREATIVE COMMONS
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedAsset.copyright.creativeCommons}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900"
                    />
                    <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags & Taxonomy */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">TABLE & TAXONOMY</h2>
              </div>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 text-left flex items-center justify-between transition-colors">
                  <span>Dual Nature</span>
                  <span className="text-xs text-slate-500">Quantum</span>
                </button>
                <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 text-left flex items-center justify-between transition-colors">
                  <span>Question</span>
                  <span className="text-xs text-slate-500">*</span>
                </button>
                <button className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-semibold text-blue-700 text-center transition-colors">
                  + ADD NEW
                </button>
              </div>
            </div>
          </div>

          {/* Asset Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">ASSET PREVIEW</h2>
            </div>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
              <img
                src={imgPreview}
                alt="Asset Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                  <svg className="w-6 h-6 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 text-center">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">4K Resolution</span> • 16:9 Aspect Ratio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
