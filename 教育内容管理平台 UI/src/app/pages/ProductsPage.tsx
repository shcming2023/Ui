import { Download, Share2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgAsset1 from '../../imports/正式教学成果FinalAssets/7358984ef11474e6febc14e0e8177b98a59011fe.png';
import imgAsset2 from '../../imports/正式教学成果FinalAssets/2e913369cf6dea261492d52ffdf61f33c848554b.png';
import imgAsset3 from '../../imports/正式教学成果FinalAssets/47aea8644c35aab885dd2fbedd33347a96fbac22.png';
import imgAsset4 from '../../imports/正式教学成果FinalAssets/f2c88951b2ea210109aeeb1cde136879b1304f38.png';
import imgAsset5 from '../../imports/正式教学成果FinalAssets/e5ba94a30f787e1adf9abdef85931c7acde6a4d2.png';
import imgAsset6 from '../../imports/正式教学成果FinalAssets/c78106cfe21deaaec7b27bf30c73bdd06b72ec4e.png';

const filters = [
  { name: 'All Resources', active: true },
  { name: 'Interactive Full', active: false },
  { name: 'Video Lessons', active: false },
  { name: 'Source Files', active: false },
  { name: 'Sort by ↓', active: false },
  { name: 'Remote Featured', active: false }
];

const assets = [
  {
    id: 1,
    title: 'Modern UI Systems',
    category: 'INTERACTIVE',
    description: 'A comprehensive 22-page guide covering modern interface systems, component theory, and design tokens.',
    students: 234,
    downloads: 1247,
    image: imgAsset1
  },
  {
    id: 2,
    title: 'Data Privacy & Security Best Practices',
    category: 'VIDEO LESSON',
    description: 'High-definition lesson covers best practices for security documentation, compliance frameworks.',
    students: 156,
    downloads: 892,
    image: imgAsset2
  },
  {
    id: 3,
    title: 'Collaborative Team Frameworks',
    category: 'SOURCE FILES',
    description: 'For use in advanced materials consisting processes and templates supporting learning theory.',
    students: 189,
    downloads: 1054,
    image: imgAsset3
  },
  {
    id: 4,
    title: 'The Complete Design-to-Code Syllabus',
    category: 'INTERACTIVE',
    description: 'This modular curriculum includes 12 modules, 35 video lessons, and over 200 pages of content. Designed for learners building modern web experiences.',
    students: 423,
    downloads: 2341,
    image: imgAsset4,
    featured: true
  },
  {
    id: 5,
    title: 'Technical Architecture',
    category: 'SOURCE FILES',
    description: 'Sample tools for students learning system design concepts through documented project setups.',
    students: 198,
    downloads: 967,
    image: imgAsset5
  },
  {
    id: 6,
    title: 'Creative Writing Deck',
    category: 'VIDEO LESSON',
    description: 'Learn how to captivate your students through narrative design and compelling content strategy.',
    students: 312,
    downloads: 1523,
    image: imgAsset6
  }
];

export function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Student Assets Gallery</h1>
          <p className="text-slate-600 max-w-3xl">
            Curated educational resources verified for immediate student distribution. These assets have passed through rigorous content and technical quality checks.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-3 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.name}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                filter.active
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-3 gap-8">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-shadow ${
                asset.featured ? 'col-span-2 row-span-2 border-blue-200 shadow-lg' : 'border-slate-200'
              }`}
            >
              {/* Image */}
              <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
                {asset.featured && (
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    FEATURED
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`p-6 ${asset.featured ? 'p-8' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold uppercase rounded-full">
                    {asset.category}
                  </span>
                  {asset.featured && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase rounded-full">
                      8 WEEKS AGO
                    </span>
                  )}
                </div>

                <h3 className={`font-bold text-slate-900 mb-3 ${asset.featured ? 'text-2xl' : 'text-lg line-clamp-2'}`}>
                  {asset.title}
                </h3>

                <p className={`text-slate-600 mb-5 ${asset.featured ? 'text-base' : 'text-sm line-clamp-2'}`}>
                  {asset.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{asset.students}</span>
                    </div>
                    {asset.featured && (
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {asset.featured && (
                  <Link
                    to={`/asset/${asset.id}`}
                    className="mt-6 block w-full px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Launch the Syllabus
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
