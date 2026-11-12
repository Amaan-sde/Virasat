'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Check
} from 'lucide-react';
import { Product, Category } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminProductsPage() {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // CSV Import Modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ all: 'true', limit: '100' });
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data?.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then(res => res.json())
      .then(data => {
        if (data?.categories) setCategories(data.categories);
      })
      .catch(() => {});

    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Select / Deselect All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'DELETE') => {
    if (selectedProducts.length === 0) return;
    if (action === 'DELETE' && !confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productIds: selectedProducts })
      });
      const data = await res.json();
      if (res.ok) {
        success(`Applied ${action} to ${data.count} products.`);
        setSelectedProducts([]);
        fetchProducts();
      } else {
        error(data.error || 'Bulk action failed');
      }
    } catch {
      error('Server error during bulk operation');
    }
  };

  // Duplicate Product
  const handleDuplicate = async (prod: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prod,
          id: undefined,
          name: `${prod.name} (Copy)`,
          sku: `${prod.sku}-COPY-${Math.floor(Math.random() * 100)}`,
          slug: `${prod.slug}-copy-${Date.now()}`
        })
      });
      if (res.ok) {
        success(`Duplicated "${prod.name}" successfully.`);
        fetchProducts();
      } else {
        error('Failed to duplicate product');
      }
    } catch {
      error('Server error during duplicate');
    }
  };

  // Delete single product
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        success(`Deleted "${name}".`);
        fetchProducts();
      } else {
        error('Failed to delete product');
      }
    } catch {
      error('Server error during delete');
    }
  };

  // CSV Import
  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setImporting(true);
    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvText })
      });
      const data = await res.json();
      if (res.ok) {
        success(`Import complete! Created ${data.createdCount} products.`);
        if (data.errors && data.errors.length > 0) {
          info(`Notice: ${data.errors.join('; ')}`);
        }
        setImportModalOpen(false);
        setCsvText('');
        fetchProducts();
      } else {
        error(data.error || 'Import failed');
      }
    } catch {
      error('Server error importing CSV');
    }
    setImporting(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Product Catalogue & Inventory
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage pricing, stock counts, variants, and publication visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* CSV Export */}
          <a
            href="/api/admin/products/export"
            download
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </a>

          {/* CSV Import */}
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Import CSV</span>
          </button>

          {/* Add Product Button */}
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, SKU, or tags..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 pr-9"
          />
          <button type="submit" className="absolute right-2.5 top-2.5 text-stone-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
            title="Refresh catalogue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80 flex items-center justify-between text-xs text-amber-200 animate-slide-down">
          <span>
            Selected <strong>{selectedProducts.length}</strong> creations
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('PUBLISH')}
              className="px-3 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('UNPUBLISH')}
              className="px-3 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700"
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('ARCHIVE')}
              className="px-3 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="px-3 py-1 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length === products.length && products.length > 0}
                    className="rounded bg-stone-900 border-stone-800 text-amber-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-4">Piece & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {products.map(prod => {
                const isSelected = selectedProducts.includes(prod.id);
                const primaryImage = prod.images[0];
                return (
                  <tr
                    key={prod.id}
                    className={`hover:bg-stone-900/60 transition ${
                      isSelected ? 'bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProduct(prod.id)}
                        className="rounded bg-stone-900 border-stone-800 text-amber-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-950 shrink-0 border border-stone-800">
                          {primaryImage && (
                            <Image
                              src={primaryImage}
                              alt={prod.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="font-serif text-sm font-semibold text-stone-100 hover:text-amber-300 transition line-clamp-1"
                          >
                            {prod.name}
                          </Link>
                          <span className="font-mono text-[10px] text-stone-500 block">
                            SKU: {prod.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-stone-400">
                      {prod.categoryName || 'Sarees'}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white">
                        {formatCurrency(prod.price)}
                      </span>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <span className="text-[10px] text-stone-500 line-through block">
                          {formatCurrency(prod.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {prod.stock === 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800">
                          0 (Out of stock)
                        </span>
                      ) : prod.stock <= 3 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                          {prod.stock} units (Low)
                        </span>
                      ) : (
                        <span className="text-stone-300 font-medium">
                          {prod.stock} units
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {prod.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 font-medium text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Draft / Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                          title="View on live storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-amber-300"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                          title="Duplicate product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-stone-500 hover:text-red-400"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setImportModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-stone-950 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-amber-100">
              Bulk CSV Product Import
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Paste standard CSV rows below. Must include at least <strong>name, price</strong> columns. Optional columns: <strong>sku, stock, categoryId, compareAtPrice, isPublished, tags</strong>.
            </p>

            <form onSubmit={handleImportCSV} className="space-y-4">
              <textarea
                required
                rows={8}
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={`name,price,sku,stock,categoryId\n"Pure Kanjeevaram Saree",18499,"SAR-KAN-99",5,"cat-1"\n"Temple Gold Kada",4499,"JEW-KAD-01",10,"cat-4"`}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-800 text-stone-400 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing || !csvText.trim()}
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition"
                >
                  {importing ? 'Importing Weaves...' : 'Execute Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

