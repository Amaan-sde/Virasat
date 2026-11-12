'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  Plus,
  Upload,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import { Category, Collection } from '@/types';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminCategoriesPage() {
  const { success, error, info } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'collections'>('categories');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isVisible, setIsVisible] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/categories?all=true').then(res => res.json()),
      fetch('/api/collections?all=true').then(res => res.json())
    ])
      .then(([catData, colData]) => {
        if (catData?.categories) setCategories(catData.categories);
        if (colData?.collections) setCollections(colData.collections);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setBannerImageUrl('');
    setDisplayOrder('0');
    setIsVisible(true);
    setSeoTitle('');
    setSeoDescription('');
    setModalOpen(true);
  };

  const openEditModal = (item: Category | Collection) => {
    setEditingId(item.id);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description || '');
    setImageUrl(item.image || '');
    setBannerImageUrl((item as Collection).bannerImage || '');
    setDisplayOrder(String(item.displayOrder || 0));
    setIsVisible(item.isVisible);
    setSeoTitle(item.seoTitle || '');
    setSeoDescription(item.seoDescription || '');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBanner = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        if (isBanner) setBannerImageUrl(data.url);
        else setImageUrl(data.url);
        success('Image uploaded!');
      } else {
        error(data.error || 'Failed to upload image');
      }
    } catch {
      error('Network error during file upload');
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const isCat = activeTab === 'categories';
    const endpoint = isCat ? '/api/categories' : '/api/collections';
    const method = editingId ? 'PUT' : 'POST';
    const targetUrl = editingId ? `${endpoint}/${editingId}` : endpoint;

    try {
      const payload: any = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        image: imageUrl.trim(),
        displayOrder: Number(displayOrder || 0),
        isVisible,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };
      if (!isCat) {
        payload.bannerImage = bannerImageUrl.trim();
      }

      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        success(`${isCat ? 'Category' : 'Collection'} saved successfully!`);
        setModalOpen(false);
        fetchData();
      } else {
        error(data.error || 'Failed to save');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const isCat = activeTab === 'categories';
    const endpoint = isCat ? `/api/categories/${id}` : `/api/collections/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        success(`Deleted "${itemName}".`);
        fetchData();
      } else {
        error(data.error || 'Failed to delete');
      }
    } catch {
      error('Server connection error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Categories & Collections
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Organize products by craft traditions, wedding edits, and seasonal curations.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add {activeTab === 'categories' ? 'Category' : 'Collection'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-amber-400 text-amber-200'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Craft Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'collections'
              ? 'border-amber-400 text-amber-200'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Featured Collections ({collections.length})
        </button>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'categories' ? categories : collections).map(item => (
          <div
            key={item.id}
            className="rounded-2xl bg-stone-900/40 border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-amber-900/60 transition shadow-xl"
          >
            <div className="relative aspect-[16/9] w-full bg-stone-900">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="300px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-stone-600">
                  No Image Configured
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                {item.isVisible ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold uppercase">
                    Visible
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800 text-[10px] font-semibold uppercase">
                    Hidden
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-2 flex-1">
              <h3 className="font-serif text-lg font-bold text-stone-100">{item.name}</h3>
              <p className="text-[11px] font-mono text-amber-400/80">/{item.slug}</p>
              {item.description && (
                <p className="text-xs text-stone-400 line-clamp-2 font-light">{item.description}</p>
              )}
              {activeTab === 'categories' && (item as Category).productCount !== undefined && (
                <p className="text-[11px] text-stone-500 pt-1">
                  Assigned Weaves: <strong>{(item as Category).productCount}</strong>
                </p>
              )}
            </div>

            <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between text-xs">
              <Link
                href={activeTab === 'categories' ? `/categories/${item.slug}` : `/collections/${item.slug}`}
                target="_blank"
                className="text-stone-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View Store</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 rounded hover:bg-red-950/40 text-stone-500 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-stone-950 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-amber-100">
                {editingId ? 'Edit' : 'Create'} {activeTab === 'categories' ? 'Category' : 'Collection'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                  Thumbnail Image
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                  />
                  <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded cursor-pointer uppercase font-semibold text-[11px] flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, false)} className="hidden" />
                  </label>
                </div>
              </div>

              {activeTab === 'collections' && (
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Hero Banner Image (Wide 16:9)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bannerImageUrl}
                      onChange={e => setBannerImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                    />
                    <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded cursor-pointer uppercase font-semibold text-[11px] flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, true)} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={e => setDisplayOrder(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={e => setIsVisible(e.target.checked)}
                      className="rounded bg-stone-900 border-stone-800 text-amber-600 focus:ring-0"
                    />
                    <span>Visible on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-800 text-stone-400 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
