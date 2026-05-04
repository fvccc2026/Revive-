import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { OrderManagement } from './pages/OrderManagement';
import { CampaignManagement } from './pages/CampaignManagement';
import { MediaGallery } from './pages/MediaGallery';
import { ProductCatalog } from './pages/ProductCatalog';
import { ProductCostingForm } from './pages/ProductCostingForm';
import { SalesManagement } from './pages/SalesManagement';
import { CustomerManagement } from './pages/CustomerManagement';
import { Product } from './types/product';
import { Order } from './types/order';
import { InventoryMovement, RawMaterial } from './types/inventory';

export type Page = 'inventario' | 'ventas' | 'pedidos' | 'clientes' | 'campanas' | 'medios' | 'parametrizacion' | 'costeo';

const initialProducts: Product[] = [
  { id: 1, name: 'Granola Artesanal 200g', sku: 'REV-GRA-200', category: 'Granolas', cost: 6000, price: 12000, margin: 50.0, image: '/Granola 200g 12K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 6000 }], initialStock: 100 },
  { id: 2, name: 'Granola Artesanal 400g', sku: 'REV-GRA-400', category: 'Granolas', cost: 12000, price: 24000, margin: 50.0, image: '/Granola 400g 24K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12000 }], initialStock: 100 },
  { id: 3, name: 'Mantequilla Artesanal Ajo & Finas Hierbas', sku: 'REV-MAN-AJO', category: 'Mantequillas', cost: 12000, price: 24000, margin: 50.0, image: '/Mantequilla 230g 24K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12000 }], initialStock: 100 },
  { id: 4, name: 'Mermelada artesanal de Fresa', sku: 'REV-MER-FRE', category: 'Mermeladas', cost: 10000, price: 20000, margin: 50.0, image: '/Mermelada de Fresa $20K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 5, name: 'Mermelada artesanal de Frutos Amarillos', sku: 'REV-MER-AMA', category: 'Mermeladas', cost: 10000, price: 20000, margin: 50.0, image: '/Mermelada de Frutos Amarillos 20K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 6, name: 'Mermelada artesanal de Frutos Rojos', sku: 'REV-MER-ROJ', category: 'Mermeladas', cost: 10000, price: 20000, margin: 50.0, image: '/Mermelada de Frutos Rojos $ 20K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 7, name: 'Pan MM Arandanos', sku: 'REV-PAN-ARA', category: 'Panes', cost: 11000, price: 22000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 11000 }], initialStock: 100 },
  { id: 8, name: 'Pan MM Arandanos y Nueces', sku: 'REV-PAN-ARN', category: 'Panes', cost: 12000, price: 24000, margin: 50.0, image: '/Nueces 24K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12000 }], initialStock: 100 },
  { id: 9, name: 'Pan MM Avena miel', sku: 'REV-PAN-AVE', category: 'Panes', cost: 10000, price: 20000, margin: 50.0, image: '/Avena Miel 22K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 10, name: 'Pan MM Chocolate', sku: 'REV-PAN-CHO', category: 'Panes', cost: 11000, price: 22000, margin: 50.0, image: '/Chocolate 22K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 11000 }], initialStock: 100 },
  { id: 11, name: 'Pan MM Mantequilla de Maní', sku: 'REV-PAN-MAN', category: 'Panes', cost: 11000, price: 22000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 11000 }], initialStock: 100 },
  { id: 12, name: 'Pan MM Nueces', sku: 'REV-PAN-NUE', category: 'Panes', cost: 12000, price: 24000, margin: 50.0, image: '/Nueces 24K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12000 }], initialStock: 100 },
  { id: 13, name: 'Pan MM Tradicional', sku: 'REV-PAN-TRA', category: 'Panes', cost: 10000, price: 20000, margin: 50.0, image: '/Tradicional 20K.HEIC', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 14, name: 'Parfait 150ml', sku: 'REV-PAR-150', category: 'Parfaits', cost: 4000, price: 8000, margin: 50.0, image: '/Parfait de 150ml  $8K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 4000 }], initialStock: 100 },
  { id: 15, name: 'Parfait 250ml', sku: 'REV-PAR-250', category: 'Parfaits', cost: 7500, price: 15000, margin: 50.0, image: '/Parfait  de 250ml 15K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 7500 }], initialStock: 100 },
  { id: 16, name: 'Parfait 750ml', sku: 'REV-PAR-750', category: 'Parfaits', cost: 24500, price: 49000, margin: 50.0, image: '/Parfait.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 24500 }], initialStock: 100 },
  { id: 17, name: 'Pudin de Chia y Proteina 250ml', sku: 'REV-PUD-250', category: 'Pudines', cost: 10000, price: 20000, margin: 50.0, image: '/Pudin de Chia y Proteina  250ml 20K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 10000 }], initialStock: 100 },
  { id: 18, name: 'Pudin de Chia y Proteina 500ml', sku: 'REV-PUD-500', category: 'Pudines', cost: 15000, price: 30000, margin: 50.0, image: '/Pudin de Chia y Proteina 500ml $30K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 15000 }], initialStock: 100 },
  { id: 19, name: 'Yogur griego Bebible Mango 1L', sku: 'REV-YOB-MAN', category: 'Yogures', cost: 13500, price: 27000, margin: 50.0, image: '/Yogurt Bebible x 1L 27K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 13500 }], initialStock: 100 },
  { id: 20, name: 'Yogur griego Bebible Maracuya 1L', sku: 'REV-YOB-MAR', category: 'Yogures', cost: 13500, price: 27000, margin: 50.0, image: '/Yogurt Bebible x 1L 27K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 13500 }], initialStock: 100 },
  { id: 21, name: 'Yogur Griego Coco 250ml', sku: 'REV-YOG-COC-250', category: 'Yogures', cost: 9000, price: 18000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 9000 }], initialStock: 100 },
  { id: 22, name: 'Yogur Griego Coco 1L', sku: 'REV-YOG-COC-1000', category: 'Yogures', cost: 26000, price: 52000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 26000 }], initialStock: 100 },
  { id: 23, name: 'Yogur Griego Coco 500ml', sku: 'REV-YOG-COC-500', category: 'Yogures', cost: 14000, price: 28000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 14000 }], initialStock: 100 },
  { id: 24, name: 'Yogur Griego Natural 1L', sku: 'REV-YOG-NAT-1000', category: 'Yogures', cost: 24500, price: 49000, margin: 50.0, image: '/Yogur Griego x 1000ml $49K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 24500 }], initialStock: 100 },
  { id: 25, name: 'Yogur Griego Natural 250ml', sku: 'REV-YOG-NAT-250', category: 'Yogures', cost: 7500, price: 15000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 7500 }], initialStock: 100 },
  { id: 26, name: 'Yogur Griego Natural 500ml', sku: 'REV-YOG-NAT-500', category: 'Yogures', cost: 12500, price: 25000, margin: 50.0, image: '/yogurt revive 500ml $25K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12500 }], initialStock: 100 },
  { id: 27, name: 'Yogur Griego Vainilla 1L', sku: 'REV-YOG-VAI-1000', category: 'Yogures', cost: 24500, price: 49000, margin: 50.0, image: '/Yogur Griego x 1000ml $49K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 24500 }], initialStock: 100 },
  { id: 28, name: 'Yogur Griego Vainilla 250ml', sku: 'REV-YOG-VAI-250', category: 'Yogures', cost: 7500, price: 15000, margin: 50.0, image: '/placeholder.png', costBreakdown: [{ id: '1', label: 'Costo Base', value: 7500 }], initialStock: 100 },
  { id: 29, name: 'Yogur Griego Vainilla 500ml', sku: 'REV-YOG-VAI-500', category: 'Yogures', cost: 12500, price: 25000, margin: 50.0, image: '/yogurt revive 500ml $25K.PNG', costBreakdown: [{ id: '1', label: 'Costo Base', value: 12500 }], initialStock: 100 },
];

export default function App() {
  const [page, setPage] = useState<Page>('inventario');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  
  useEffect(() => {
    import('./lib/api').then(async api => {
      const dbProducts = await api.fetchProducts();
      const dbOrders = await api.fetchOrders();
      const dbMovements = await api.fetchMovements();
      const dbRawMaterials = await api.fetchRawMaterials();

      // Migrate from localStorage if Supabase is empty
      const localProducts = JSON.parse(localStorage.getItem('revive_products') || '[]');
      const localOrders = JSON.parse(localStorage.getItem('revive_orders') || '[]');
      const localMovements = JSON.parse(localStorage.getItem('revive_movements') || '[]');
      const localRawMaterials = JSON.parse(localStorage.getItem('revive_rawMaterials') || '[]');

      let migrated = false;

      if (dbProducts.length === 0 && localProducts.length > 0) {
        for (const p of localProducts) await api.createProduct(p);
        migrated = true;
      }
      if (dbOrders.length === 0 && localOrders.length > 0) {
        for (const o of localOrders) await api.createOrder(o);
        migrated = true;
      }
      if (dbMovements.length === 0 && localMovements.length > 0) {
        await api.createMovementsBatch(localMovements);
        migrated = true;
      }
      if (dbRawMaterials.length === 0 && localRawMaterials.length > 0) {
        for (const rm of localRawMaterials) await api.createRawMaterial(rm);
        migrated = true;
      }

      if (migrated) {
        // Refetch after migration
        setProducts(await api.fetchProducts());
        setOrders(await api.fetchOrders());
        setMovements(await api.fetchMovements());
        setRawMaterials(await api.fetchRawMaterials());
      } else {
        setProducts(dbProducts.length > 0 ? dbProducts : initialProducts);
        setOrders(dbOrders);
        setMovements(dbMovements);
        setRawMaterials(dbRawMaterials);
      }
    });
  }, []);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const handleEditProduct = (id: number | null) => {
    setEditingProductId(id);
    setPage('costeo');
  };

  const handleSaveProduct = async (product: Product) => {
    const api = await import('./lib/api');
    if (editingProductId) {
      await api.updateProduct(product);
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      const { id, ...prodWithoutId } = product;
      const newProd = await api.createProduct(prodWithoutId as any); // Let DB generate ID
      if (newProd) setProducts([...products, newProd]);
      else setProducts([...products, product]);
    }
    setPage('inventario');
    setEditingProductId(null);
  };

  const handleCancelEdit = () => {
    setPage('inventario');
    setEditingProductId(null);
  };

  const handleDeleteProduct = async (id: number) => {
    const api = await import('./lib/api');
    await api.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const currentProduct = editingProductId ? products.find(p => p.id === editingProductId) : null;

  return (
    <Layout page={page} setPage={setPage}>
      {(page === 'inventario' || page === 'parametrizacion') && (
        <ProductCatalog 
          products={products}
          movements={movements}
          setMovements={setMovements}
          rawMaterials={rawMaterials}
          setRawMaterials={setRawMaterials}
          onNewProduct={() => handleEditProduct(null)}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
      {page === 'ventas' && <SalesManagement />}
      {page === 'pedidos' && <OrderManagement products={products} orders={orders} setOrders={setOrders} movements={movements} setMovements={setMovements} />}
      {page === 'clientes' && <CustomerManagement orders={orders} />}
      {page === 'campanas' && <CampaignManagement onOpenGallery={() => setPage('medios')} />}
      {page === 'medios' && <MediaGallery products={products} />}
      {page === 'costeo' && (
        <ProductCostingForm 
          product={currentProduct}
          categories={Array.from(new Set(products.map(p => p.category)))}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit} 
        />
      )}
    </Layout>
  );
}
