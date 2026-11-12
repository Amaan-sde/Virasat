'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Palette,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit,
  Save,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Sparkles,
  Upload,
  RotateCcw
} from 'lucide-react';
import { HomepageSection } from '@/types';
import { useToast } from '@/components/ui/ToastContext';

export default function AdminHomepageEditorPage() {
  const { success, error, info } = useToast();

  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  // Form edit state for selected section
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editContent, setEditContent] = useState<any>({});

  const fetchSections = () => {
    setLoading(true);
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (data?.sections) {
          setSections(data.sections);
          if (!selectedSection && data.sections[0]) {
            selectSection(data.sections[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const selectSection = (sec: HomepageSection) => {
    setSelectedSection(sec);
    setEditTitle(sec.title);
    setEditSubtitle(sec.subtitle || '');
    setEditContent(JSON.parse(JSON.stringify(sec.content || {})));
  };

  // Move Section Up
  const moveSection = async (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setSections(newSections);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionIds: newSections.map(s => s.id) })
      });
      if (res.ok) {
        success('Section reordered and published to storefront!');
      }
    } catch {
      error('Failed to save section ordering');
    }
  };

  // Toggle Visibility
  const toggleVisibility = async (sec: HomepageSection) => {
    try {
      const updatedVisible = !sec.isVisible;
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sec.id,
          isVisible: updatedVisible
        })
      });
      if (res.ok) {
        setSections(prev =>
          prev.map(s => (s.id === sec.id ? { ...s, isVisible: updatedVisible } : s))
        );
        success(`Section "${sec.title}" is now ${updatedVisible ? 'Visible' : 'Hidden'} on storefront.`);
      }
    } catch {
      error('Failed to update visibility');
    }
  };

  // Save Edits for Selected Section
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSection.id,
          title: editTitle,
          subtitle: editSubtitle,
          content: editContent
        })
      });

      const data = await res.json();
      if (res.ok) {
        success(`Published updates for "${editTitle}"! Reflecting on live homepage.`);
        setSections(prev =>
          prev.map(s => (s.id === selectedSection.id ? data.section : s))
        );
        setSelectedSection(data.section);
      } else {
        error(data.error || 'Failed to save section');
      }
    } catch {
      error('Server connection error');
    }
    setSaving(false);
  };

  // Upload image inside editor
  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, pathCallback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        pathCallback(data.url);
        success('Uploaded image asset!');
      } else {
        error(data.error || 'Upload failed');
      }
    } catch {
      error('Failed to upload');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Storefront Page Builder</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            Visual Homepage Editor
          </h2>
          <p className="text-xs text-stone-400">
            Reorder sections, update banners & hero headlines, and publish directly without coding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Device Preview Switches */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-1">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded transition ${
                previewDevice === 'desktop' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded transition ${
                previewDevice === 'tablet' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded transition ${
                previewDevice === 'mobile' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 text-xs uppercase tracking-wider font-semibold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Store</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sections Reorder & Visibility List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-amber-200">
              Homepage Section Hierarchy
            </h3>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider">
              Drag / Reorder
            </span>
          </div>

          <div className="space-y-2.5">
            {sections.map((sec, idx) => {
              const isSelected = selectedSection?.id === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => selectSection(sec)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-stone-100">
                        {sec.title}
                      </h4>
                      <p className="text-[10px] text-amber-400/80 uppercase tracking-wider font-mono">
                        {sec.sectionType}
                      </p>
                    </div>
                  </div>

                  {/* Controls: Reorder + Visibility */}
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'UP')}
                      className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveSection(idx, 'DOWN')}
                      className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(sec)}
                      className={`p-1.5 rounded hover:bg-stone-800 transition ${
                        sec.isVisible ? 'text-emerald-400' : 'text-stone-600'
                      }`}
                      title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Section Customizer */}
        <div className="lg:col-span-7">
          {selectedSection ? (
            <form onSubmit={handleSaveSection} className="p-6 sm:p-8 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono">
                    Customizing Section
                  </span>
                  <h3 className="font-serif text-xl font-bold text-amber-100">
                    {selectedSection.title}
                  </h3>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-stone-300 font-medium mb-1.5">
                    Section Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={e => setEditSubtitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Specific Content Type Fields */}
              {selectedSection.sectionType === 'HERO_SLIDER' && (
                <div className="space-y-6 pt-4 border-t border-stone-800 text-xs">
                  <h4 className="font-serif text-base font-bold text-amber-200">
                    Hero Slide 1 Configuration
                  </h4>
                  {editContent.slides?.[0] && (
                    <div className="space-y-4 p-4 rounded-xl bg-stone-950 border border-stone-800">
                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1">
                          Slide Headline
                        </label>
                        <input
                          type="text"
                          value={editContent.slides[0].heading || ''}
                          onChange={e => {
                            const updated = { ...editContent };
                            updated.slides[0].heading = e.target.value;
                            setEditContent(updated);
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1">
                          Slide Subheading Narrative
                        </label>
                        <textarea
                          rows={2}
                          value={editContent.slides[0].subheading || ''}
                          onChange={e => {
                            const updated = { ...editContent };
                            updated.slides[0].subheading = e.target.value;
                            setEditContent(updated);
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-2 text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block uppercase tracking-wider text-stone-300 mb-1">
                          Slide Background Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editContent.slides[0].imageUrl || ''}
                            onChange={e => {
                              const updated = { ...editContent };
                              updated.slides[0].imageUrl = e.target.value;
                              setEditContent(updated);
                            }}
                            className="flex-1 bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                          />
                          <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded cursor-pointer uppercase font-semibold text-[11px] flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e =>
                                handleEditorImageUpload(e, url => {
                                  const updated = { ...editContent };
                                  updated.slides[0].imageUrl = url;
                                  setEditContent(updated);
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block uppercase tracking-wider text-stone-300 mb-1">
                            Primary CTA Text
                          </label>
                          <input
                            type="text"
                            value={editContent.slides[0].primaryBtnText || ''}
                            onChange={e => {
                              const updated = { ...editContent };
                              updated.slides[0].primaryBtnText = e.target.value;
                              setEditContent(updated);
                            }}
                            className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block uppercase tracking-wider text-stone-300 mb-1">
                            Primary CTA Destination
                          </label>
                          <input
                            type="text"
                            value={editContent.slides[0].primaryBtnUrl || ''}
                            onChange={e => {
                              const updated = { ...editContent };
                              updated.slides[0].primaryBtnUrl = e.target.value;
                              setEditContent(updated);
                            }}
                            className="w-full bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedSection.sectionType === 'PROMO_BANNER' && (
                <div className="space-y-4 pt-4 border-t border-stone-800 text-xs">
                  <h4 className="font-serif text-base font-bold text-amber-200">
                    Banner Content
                  </h4>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      value={editContent.heading || ''}
                      onChange={e => setEditContent({ ...editContent, heading: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      Banner Description
                    </label>
                    <textarea
                      rows={3}
                      value={editContent.description || ''}
                      onChange={e => setEditContent({ ...editContent, description: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      Banner Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editContent.imageUrl || ''}
                        onChange={e => setEditContent({ ...editContent, imageUrl: e.target.value })}
                        className="flex-1 bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                      />
                      <label className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded cursor-pointer uppercase font-semibold text-[11px] flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e =>
                            handleEditorImageUpload(e, url => {
                              setEditContent({ ...editContent, imageUrl: url });
                            })
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={editContent.btnText || ''}
                        onChange={e => setEditContent({ ...editContent, btnText: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-stone-300 mb-1">
                        Destination URL
                      </label>
                      <input
                        type="text"
                        value={editContent.btnUrl || ''}
                        onChange={e => setEditContent({ ...editContent, btnUrl: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-1.5 text-stone-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedSection.sectionType === 'BRAND_STORY' && (
                <div className="space-y-4 pt-4 border-t border-stone-800 text-xs">
                  <h4 className="font-serif text-base font-bold text-amber-200">
                    Artisan Story Content
                  </h4>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      Lead Quote / Catchphrase
                    </label>
                    <input
                      type="text"
                      value={editContent.leadText || ''}
                      onChange={e => setEditContent({ ...editContent, leadText: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-stone-300 mb-1">
                      Artisan Narrative Body
                    </label>
                    <textarea
                      rows={4}
                      value={editContent.bodyText || ''}
                      onChange={e => setEditContent({ ...editContent, bodyText: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Stat 1</label>
                      <input
                        type="text"
                        value={editContent.stat1Number || ''}
                        onChange={e => setEditContent({ ...editContent, stat1Number: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Stat 2</label>
                      <input
                        type="text"
                        value={editContent.stat2Number || ''}
                        onChange={e => setEditContent({ ...editContent, stat2Number: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Stat 3</label>
                      <input
                        type="text"
                        value={editContent.stat3Number || ''}
                        onChange={e => setEditContent({ ...editContent, stat3Number: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  Simulated Live Store Preview ({previewDevice})
                </span>
                <div
                  className={`p-4 rounded-lg bg-stone-900/60 border border-stone-800/80 mx-auto transition-all ${
                    previewDevice === 'mobile'
                      ? 'max-w-xs'
                      : previewDevice === 'tablet'
                      ? 'max-w-md'
                      : 'w-full'
                  }`}
                >
                  <p className="font-serif text-lg font-bold text-white truncate">{editTitle}</p>
                  <p className="text-xs text-stone-400 font-light truncate">{editSubtitle || 'No subtitle'}</p>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center border border-dashed border-stone-800 rounded-2xl text-xs text-stone-500">
              Select a section from the hierarchy on the left to edit its visuals and messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

