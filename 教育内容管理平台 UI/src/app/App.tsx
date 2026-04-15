import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SourceMaterialsPage } from './pages/SourceMaterialsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { ProcessWorkbenchPage } from './pages/ProcessWorkbenchPage';
import { ProductsPage } from './pages/ProductsPage';
import { MetadataManagementPage } from './pages/MetadataManagementPage';
import { TaskCenterPage } from './pages/TaskCenterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/source-materials" element={<SourceMaterialsPage />} />
          <Route path="/asset/:id" element={<AssetDetailPage />} />
          <Route path="/process-workbench" element={<ProcessWorkbenchPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/metadata" element={<MetadataManagementPage />} />
          <Route path="/tasks" element={<TaskCenterPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
