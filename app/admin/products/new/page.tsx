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
  CheckCircle2,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { Category, Collection, ProductVariant, ProductAttribute } from '@/types';
import { slugify, generateSKU, formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastContext';

export default function AddProductPage() {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [tags, setTags] = useState('Silk Mark, Handloom');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Variants Matrix
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [varTitle, setVarTitle] = useState('');
  const [varSize, setVarSize] = useState('Free Size');
  const [varColor, setVarColor] = useState('Royal Crimson');
  const [varHex, setVarHex] = useState('#6B1724');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('5');

  // Attributes
  const [attributes, setAttributes] = useState<ProductAttribute[]>([
    { name: 'Fabric', value: '100% Pure Mulberry Silk' },
    { name: 'Weave Technique', value: 'Traditional Korvai Handloom' },
    { name: 'Care Instructions', value: 'Dry Clean Only' }
  ]);

  useEffect(() => {
    fetch('/api/categories?all=true')
      .then(res => res.json())
      .then(data => {
        if (data?.categories) {
          setCategories(data.categories);
          if (data.categories[0]) setCategoryId(data.categories[0].id);
        }
      });

    fetch('/api/collections?all=true')
      .then(res => res.json())
      .then(data => {
        if (data?.collections) setCollections(data.collections);
      });
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
    if (!sku) {
      setSku(generateSKU('SAR', val));
    }
    if (!seoTitle) {
      setSeoTitle(`${val} | Handcrafted Pure Silk | Virasat`);
    }
  };

  // Image Upload via API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setImages(prev => [...prev, data.url]);
        success('Image uploaded successfully!');
      } else {
        error(data.error || 'Failed to upload image');
      }
    } catch {
      error('Network error during file upload');
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

  // Variant handler
  const addVariant = () => {
    if (!varTitle.trim()) {
      error('Variant title is required');
      return;
    }
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: `${sku || 'SKU'}-${slugify(varSize || varColor)}`,
      title: varTitle.trim(),
      size: varSize || undefined,
      color: varColor || undefined,
      colorHex: varHex || undefined,
      price: varPrice ? Number(varPrice) : Number(price) || 0,
      stock: varStock ? Number(varStock) : 5
    };
    setVariants(prev => [...prev, newVariant]);
    setVarTitle('');
    info('Variant added');
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      error('Product title and selling price are mandatory');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        sku: sku.trim() || `SKU-${Date.now()}`,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        stock: Number(stock || 0),
        categoryId: categoryId || categories[0]?.id || 'cat-1',
        collectionIds: selectedCollections,
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        variants,
        attributes,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isFeatured,
        isPublished,
        isArchived: false,
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim()
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'Failed to create product');
        setLoading(false);
        return;
      }

      success(`Product "${name}" added to catalogue!`);
      router.push('/admin/products');
      router.refresh();
    } catch {
      error('Server connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-2xl font-bold text-amber-100">Add New Heritage Creation</h2>
            <p className="text-xs text-stone-400">Configure catalogue attributes, variants, imagery, and SEO.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Save & Publish'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Imperial Kanjeevaram Pure Mulberry Silk Saree"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Master SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Category *
              </label>
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
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Silk Mark, Handloom, Bridal"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Short Highlight
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                placeholder="Brief one-line summary for product card & search snippets"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Complete Description & Heritage Details
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe weave technique, zari metal content, artisan hours, history, and styling advice..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Pricing & Inventory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="18499"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Compare-At Price (₹)
              </label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={e => setCompareAtPrice(e.target.value)}
                placeholder="24999"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Cost Price (₹, Internal)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                placeholder="11000"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                Total Stock Units *
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="10"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: High-Res Imagery */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Product Photography Gallery
          </h3>

          <div className="space-y-4">
            {/* File Upload Trigger */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 p-6 border-2 border-dashed border-stone-800 hover:border-amber-600/80 rounded-xl bg-stone-950 cursor-pointer text-center space-y-2 transition">
                <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                <span className="text-xs font-semibold text-stone-200 block">
                  {uploadingImage ? 'Uploading Image...' : 'Upload Image from Computer or Phone'}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Supports JPEG, PNG, WebP up to 5MB (Saved to server storage)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              {/* Or Add Image URL */}
              <div className="flex-1 p-6 border border-stone-800 rounded-xl bg-stone-950 flex flex-col justify-between space-y-3">
                <span className="text-xs font-semibold text-stone-300 block">Or Add Image URL</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded uppercase font-semibold"
                  >
                    Add
                  </button>
                </div>
                <span className="text-[10px] text-stone-500">Unsplash, Pexels, or external CDN</span>
              </div>
            </div>

            {/* Thumbnail Gallery Preview */}
            {images.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-stone-400 mb-2">
                  Gallery Assets ({images.length}) - Primary image is first:
                </p>
                <div className="flex flex-wrap gap-4">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-32 rounded-lg overflow-hidden border border-stone-700 bg-stone-900 group"
                    >
                      <Image src={img} alt={`Preview ${i}`} fill className="object-cover" sizes="96px" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-950/80 text-red-200 hover:bg-red-900 transition"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
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
            )}
          </div>
        </div>

        {/* Section 4: Variants Matrix */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Variants (Sizes & Colors)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs items-end">
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-stone-400 mb-1">Variant Title *</label>
              <input
                type="text"
                value={varTitle}
                onChange={e => setVarTitle(e.target.value)}
                placeholder="e.g. S / Crimson Red"
                className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Size</label>
              <input
                type="text"
                value={varSize}
                onChange={e => setVarSize(e.target.value)}
                placeholder="S, M, L, Free Size"
                className="w-full bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">Color Name</label>
              <input
                type="text"
                value={varColor}
                onChange={e => setVarColor(e.target.value)}
                placeholder="Royal Crimson"
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
            <div>
              <button
                type="button"
                onClick={addVariant}
                className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded uppercase tracking-wider text-xs"
              >
                + Add Variant
              </button>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="divide-y divide-stone-800 text-xs">
              {variants.map(v => (
                <div key={v.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {v.colorHex && (
                      <span className="w-3 h-3 rounded-full border border-stone-600" style={{ backgroundColor: v.colorHex }} />
                    )}
                    <span className="font-medium text-stone-200">{v.title}</span>
                    <span className="text-stone-500 font-mono text-[11px]">({v.sku})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-amber-300">{formatCurrency(v.price)}</span>
                    <span className="text-stone-400">{v.stock} in stock</span>
                    <button
                      type="button"
                      onClick={() => removeVariant(v.id)}
                      className="text-stone-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Search Engine Optimization (SEO) */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-amber-200 border-b border-stone-800 pb-2">
            Search Engine Optimization (SEO)
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="uppercase tracking-wider text-stone-300 font-medium">Meta Title</label>
                <span className={`text-[11px] ${seoTitle.length > 60 ? 'text-amber-400' : 'text-stone-500'}`}>
                  {seoTitle.length} / 60 characters
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="uppercase tracking-wider text-stone-300 font-medium">Meta Description</label>
                <span className={`text-[11px] ${seoDescription.length > 160 ? 'text-amber-400' : 'text-stone-500'}`}>
                  {seoDescription.length} / 160 characters
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
                placeholder="High-intent description for Google search snippet results..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Visibility & Status */}
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-base font-bold text-stone-100">Publication & Featuring</h3>
            <p className="text-xs text-stone-400">Control immediate visibility on the live customer storefront.</p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
              />
              <span>Mark as Featured Edit</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-0"
              />
              <span>Publish Immediately</span>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-4 pt-4 border-t border-stone-800">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-lg border border-stone-800 hover:bg-stone-900 text-stone-300 text-xs uppercase tracking-wider font-semibold"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-xl disabled:opacity-50"
          >
            {loading ? 'Creating Piece...' : 'Publish Product to Live Store'}
          </button>
        </div>
      </form>
    </div>
  );
}
