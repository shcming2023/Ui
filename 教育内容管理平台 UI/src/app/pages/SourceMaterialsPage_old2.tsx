import { Search, ChevronDown, Grid, List, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgResource1 from '../../imports/教学资源库SourceLibrary/1cdd58848aff98d26da36e0f5423d651578c5cea.png';
import imgResource2 from '../../imports/教学资源库SourceLibrary/777ed09984f2bbc2694415cc110dbe12d2ead7e0.png';
import imgResource3 from '../../imports/教学资源库SourceLibrary/03552a28e6ff7c0cd7ccc92df86c4b89de7899a6.png';
import imgResource4 from '../../imports/教学资源库SourceLibrary/d11c7053705d71136ff18957d7929f80d47d1930.png';
import imgResource5 from '../../imports/教学资源库SourceLibrary/5c84de4f32b6885f8920ca5139e2652b491b1de5.png';

const materials = [
  {
    id: 1,
    title: 'Advanced Calculus: Winter Theory Series',
    category: 'EDUCATIONAL CONCEPT',
    size: '24.2 MB',
    views: 932,
    image: imgResource1,
    badge: 'NEW'
  },
  {
    id: 2,
    title: 'Molecular Biology: The CRISPR Revolution',
    category: 'VIDEO COURSE',
    size: '89 MB',
    views: 1267,
    image: imgResource2,
    badge: 'NEW'
  },
  {
    id: 3,
    title: 'Foundational Concepts: Final Assessment',
    category: 'ASSESSMENT',
    size: '5.8 MB',
    views: 543,
    image: imgResource3,
    badge: 'NEW'
  },
  {
    id: 4,
    title: 'Comparative Narrative: Reading Materials',
    category: 'READING MATERIALS',
    size: '12 MB',
    views: 789,
    image: imgResource4
  }
];

const recentActivity = [
  { fileName: 'Curriculum_Guidelines_2024.pdf', author: 'Dr. Ava Thomas', status: 'PUBLISHED', statusColor: 'bg-emerald-100 text-emerald-700' },
  { fileName: 'Webinar_Seminar_V2.mp4', author: 'Media Team', status: 'DRAFTING', statusColor: 'bg-blue-100 text-blue-700' }
];

export function SourceMaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Source Library</h1>
          <p className="text-slate-600">
            Access and manage the core educational assets for the Winter 2024 Semester. Curate new additions to enhance the scholar's journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Storage Status */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-blue-100">STORAGE STATUS</p>
            <p className="text-4xl font-bold mb-4">74.2 GB used</p>
            <div className="w-full h-3 bg-blue-800 rounded-full overflow-hidden mb-2">
              <div className="w-[74%] h-full bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-blue-100">Out of 100GB</p>
          </div>

          {/* White Resources */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">WHITE RESOURCES</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900 mb-1">1,204</p>
                <p className="text-sm text-green-600 font-medium">▲ +12 this week</p>
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">PENDING REVIEWS</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900 mb-1">18</p>
                <Link to="/tasks" className="text-sm text-blue-600 font-semibold hover:text-blue-700">
                  View Queue →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6">
            {/* Top Row - Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Bottom Row - Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  CATEGORY: ALL
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  DATE ADDED
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button className="p-2 bg-white rounded shadow-sm">
                    <Grid className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-50 rounded">
                    <List className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  BATCH UPLOAD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Resources Grid - Left */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-6">
              {materials.map((material) => (
                <Link
                  key={material.id}
                  to={`/asset/${material.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    <img
                      src={material.image}
                      alt={material.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {material.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        {material.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      {material.category}
                    </p>
                    <h3 className="font-semibold text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{material.size}</span>
                      <span>{material.views} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity - Right */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <Link to="/tasks" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All History →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900 truncate flex-1 mr-2">
                      {activity.fileName}
                    </p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${activity.statusColor}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">By {activity.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
