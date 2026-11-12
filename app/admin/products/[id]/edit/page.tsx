'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { Product, Category, Collection, ProductVariant } from '@/types';
import { formatCurrency, slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Product Form State
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Quick variant add form
  const [varTitle, setVarTitle] = useState('');
  const [varSize, setVarSize] = useState('Free Size');
  const [varColor, setVarColor] = useState('Gold');
  const [varHex, setVarHex] = useState('#C5A059');
  const [varStock, setVarStock] = useState('5');

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then(res => res.json())
      .then(data => {
        if (data?.categories) setCategories(data.categories);
      });

    fetch(`/api/products/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(p => {
        setProduct(p);
        setName(p.name);
        setSlug(p.slug);
        setSku(p.sku);
        setPrice(String(p.price));
        setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : '');
        setCostPrice(p.costPrice ? String(p.costPrice) : '');
        setStock(String(p.stock));
        setCategoryId(p.categoryId);
        setDescription(p.description);
        setShortDescription(p.shortDescription || '');
        setImages(p.images || []);
        setTags((p.tags || []).join(', '));
        setIsFeatured(p.isFeatured);
        setIsPublished(p.isPublished);
        setSeoTitle(p.seoTitle || '');
        setSeoDescription(p.seoDescription || '');
        setVariants(p.variants || []);
        setLoading(false);
      })
      .catch(() => {
        error('Product not found');
        router.push('/admin/products');
      });
  }, [params.id, router, error]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setImages(prev => [...prev, data.url]);
        success('Image uploaded!');
      } else {
        error(data.error || 'Upload failed');
      }
    } catch {
      error('Network error uploading image');
    }
    setUploadingImage(false);
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const addVariant = () => {
    if (!varTitle.trim()) return;
    const newV: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: `${sku}-${slugify(varSize || varColor)}`,
      title: varTitle.trim(),
      size: varSize,
      color: varColor,
      colorHex: varHex,
      price: Number(price) || 0,
      stock: Number(varStock) || 5
    };
    setVariants(prev => [...prev, newV]);
    setVarTitle('');
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        sku: sku.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        stock: Number(stock),
        categoryId,
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        images,
        variants,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured,
        isPublished,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        success('Product modifications saved successfully!');
        router.push('/admin/products');
        router.refresh();
      } else {
        error(data.error || 'Failed to update product');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  if (loading || !product) {
    return (
      <div className="py-20 text-center text-xs text-stone-400 uppercase tracking-widest animate-pulse font-mono">
        Loading Product Specifications...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl font-bold text-amber-100">Edit & Update Piece</h2>
            <p className="text-xs text-stone-400">Modifying: {product.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs uppercase font-medium flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront View</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Short Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Complete Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Pricing & Stock Count
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Compare-At Price (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={e => setCompareAtPrice(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Cost (₹)</label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">Stock Units *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Photography Gallery
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex-1 p-5 border-2 border-dashed border-stone-800 hover:border-amber-600 rounded-xl bg-stone-950 cursor-pointer text-center space-y-1 transition">
              <Upload className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-xs font-semibold text-stone-200 block">
                {uploadingImage ? 'Uploading...' : 'Upload Image from Computer/Phone'}
              </span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="flex-1 p-5 border border-stone-800 rounded-xl bg-stone-950 flex flex-col justify-between space-y-2">
              <span className="text-xs font-semibold text-stone-300">Add Image URL</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-100"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded uppercase font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-32 rounded-lg overflow-hidden border border-stone-700 bg-stone-900 group">
                <Image src={img} alt={`Asset ${i}`} fill className="object-cover" sizes="96px" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-950/80 text-red-200"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-600 text-stone-950 text-[9px] font-bold uppercase">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Variants ({variants.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs items-end">
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-stone-400 mb-1">Variant Name</label>
              <input
                type="text"
                value={varTitle}
                onChange={e => setVarTitle(e.target.value)}
                placeholder="e.g. Size M / Crimson"
                className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Size</label>
              <input
                type="text"
                value={varSize}
                onChange={e => setVarSize(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Stock</label>
              <input
                type="number"
                value={varStock}
                onChange={e => setVarStock(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded uppercase text-xs"
            >
              + Add
            </button>
          </div>

          <div className="divide-y divide-stone-800 text-xs">
            {variants.map(v => (
              <div key={v.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-200">{v.title}</span>
                  <span className="text-stone-500 font-mono text-[11px] ml-2">({v.sku})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-amber-300">{formatCurrency(v.price)}</span>
                  <span className="text-stone-400">{v.stock} in stock</span>
                  <button type="button" onClick={() => removeVariant(v.id)} className="text-stone-500 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Status */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            SEO & Publication Controls
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">SEO Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">SEO Meta Description</label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
                />
                <span>Featured Edit</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
                />
                <span>Published on Storefront</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4 pt-4 border-t border-stone-800">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-lg border border-stone-800 hover:bg-stone-900 text-stone-300 text-xs uppercase tracking-wider font-semibold"
          >
            Back
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-xl disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Update Piece'}
          </button>
        </div>
      </form>
    </div>
  );
}

