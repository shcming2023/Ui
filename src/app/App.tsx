import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from '../store/appContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SourceMaterialsPage } from './pages/SourceMaterialsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { ProcessWorkbenchPage } from './pages/ProcessWorkbenchPage';
import { ProductsPage } from './pages/ProductsPage';
import { MetadataManagementPage } from './pages/MetadataManagementPage';
import { TaskCenterPage } from './pages/TaskCenterPage';
import { SettingsPage } from './pages/SettingsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProjectBackupPage } from './pages/backup/ProjectBackupPage';
import { DatabaseBackupPage } from './pages/backup/DatabaseBackupPage';
import { LatexToolPage } from './pages/backup/LatexToolPage';
import { FilesBrowserPage } from './pages/backup/FilesBrowserPage';
import { SchedulerPage } from './pages/backup/SchedulerPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <ErrorBoundary>
              <Routes>
                {/* ========== EduAsset CMS 路由 ========== */}
                <Route path="/" element={<Dashboard />} /> {/* 完成 */}
                <Route path="/source-materials" element={<SourceMaterialsPage />} /> {/* 完成 */}
                <Route path="/asset/:id" element={<AssetDetailPage />} /> {/* 完成 */}
                <Route path="/process-workbench" element={<ProcessWorkbenchPage />} /> {/* 完成 */}
                <Route path="/products" element={<ProductsPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/metadata" element={<MetadataManagementPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/tasks" element={<TaskCenterPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/settings" element={<SettingsPage />} /> {/* 完成 */}
                {/* ========== Overleaf 备份系统路由 ========== */}
                <Route path="/backup" element={<ProjectBackupPage />} /> {/* 已接入后端 */}
                <Route path="/backup/database" element={<DatabaseBackupPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/backup/latex" element={<LatexToolPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/backup/files" element={<FilesBrowserPage />} /> {/* Mock 数据，未接入真实 API */}
                <Route path="/backup/scheduler" element={<SchedulerPage />} /> {/* Mock 数据，未接入真实 API */}
              </Routes>
            </ErrorBoundary>
          </Layout>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
