'use client';

import React, { useEffect, useRef, useState } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import {
    DotType,
} from 'qr-code-styling';
import { Download, Upload, Palette, Grid, Image as ImageIcon, ChevronDown, ChevronUp, Save, Layers, List, Copy, Check } from 'lucide-react';

interface AdvancedQRGeneratorProps {
    initialUrl?: string;
    onSave?: (qrData: { url: string; name: string; color: string; image: string | Blob; isDynamic?: boolean; targetUrl?: string }) => void;
}

interface QRPreset {
    id: string;
    name: string;
    config: {
        color: string;
        bgColor: string;
        dotType: DotType;
        logo: string;
        logoSize: number;
    }
}

export default function AdvancedQRGenerator({ initialUrl = '', onSave }: AdvancedQRGeneratorProps) {
    // Mode State
    const [mode, setMode] = useState<'single' | 'bulk'>('single');
    const [bulkInput, setBulkInput] = useState('');

    // QR Configuration State
    const [url, setUrl] = useState(initialUrl);
    const [name, setName] = useState('My QR Code');
    const [isDynamic, setIsDynamic] = useState(false);
    const [targetUrl, setTargetUrl] = useState(initialUrl);
    const [virtualShortUrl, setVirtualShortUrl] = useState('');

    // Auto-generate mock short URL for UI display when dynamic is enabled
    useEffect(() => {
        if (isDynamic) {
            const shortId = Math.random().toString(36).substring(2, 8);
            // Use current origin if available, else placeholder
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pdi.link';
            setVirtualShortUrl(`${origin}/q/${shortId}`);
        } else {
            setVirtualShortUrl('');
        }
    }, [isDynamic]);

    // Ensure state sync
    useEffect(() => {
        if (!isDynamic) {
            setUrl(targetUrl);
        }
    }, [targetUrl, isDynamic]);


    const [color, setColor] = useState('#2563eb');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [dotType, setDotType] = useState<DotType>('square');
    const [logo, setLogo] = useState<string>('');
    const [logoSize, setLogoSize] = useState<number>(0.4);

    // UI State
    const [activeSection, setActiveSection] = useState<string>('pattern');
    const [presets, setPresets] = useState<QRPreset[]>([
        { id: 'p1', name: 'Blue Professional', config: { color: '#2563eb', bgColor: '#ffffff', dotType: 'square', logo: '', logoSize: 0.4 } },
        { id: 'p2', name: 'Soft Purple', config: { color: '#9333ea', bgColor: '#f3e8ff', dotType: 'rounded', logo: '', logoSize: 0.4 } }
    ]);

    const ref = useRef<HTMLDivElement>(null);
    // We store the instance in a ref to persist it across renders
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        // Dynamically import QRCodeStyling to ensure it runs only on client
        import('qr-code-styling').then((QRCodeStylingModule) => {
            const QRCodeStyling = QRCodeStylingModule.default;
            qrCode.current = new QRCodeStyling({
                width: 300,
                height: 300,
                image: '',
                dotsOptions: {
                    color: '#000000',
                    type: 'square'
                },
                imageOptions: {
                    crossOrigin: 'anonymous',
                    margin: 20,
                    imageSize: logoSize
                }
            });
            if (ref.current) {
                ref.current.innerHTML = '';
                qrCode.current.append(ref.current);
            }
            // Initial update - Show destination in preview (we don't have real short URL until save)
            const activeUrl = isDynamic ? targetUrl : url;
            qrCode.current.update({
                data: activeUrl || 'https://example.com',
                dotsOptions: { color, type: dotType as DotType },
                backgroundOptions: { color: bgColor },
                image: logo,
                imageOptions: { imageSize: logoSize, margin: 10 }
            });
        });
    }, []); // Run once on mount

    useEffect(() => {
        if (!qrCode.current) return;
        // Show destination in preview (we don't have real short URL until save)
        const activeUrl = isDynamic ? targetUrl : url;
        qrCode.current.update({
            data: activeUrl || 'https://example.com',
            dotsOptions: {
                color: color,
                type: dotType as DotType
            },
            backgroundOptions: {
                color: bgColor,
            },
            image: logo,
            imageOptions: {
                imageSize: logoSize,
                margin: 10
            }
        });
    }, [url, targetUrl, isDynamic, color, bgColor, dotType, logo, logoSize]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const download = async (extension: 'png' | 'jpeg' | 'svg') => {
        if (qrCode.current) {
            const cleanName = (name || 'qr-code').trim().replace(/[\/\\:*?"<>|]/g, '-');
            const blob = await qrCode.current.getRawData(extension);
            if (blob) {
                const url = URL.createObjectURL(blob as Blob);
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = `${cleanName}.${extension}`;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(url);
            }
        }
    };

    const handleSave = async () => {
        if (mode === 'bulk') {
            // Bulk Save Logic
            const lines = bulkInput.split('\n');
            for (const line of lines) {
                const [lineUrl, lineName] = line.split(',');
                if (lineUrl && onSave && qrCode.current) {
                    // Temporarily update QR to generate blob for this url
                    qrCode.current.update({ data: lineUrl.trim() });
                    const blob = await qrCode.current.getRawData('png');
                    onSave({
                        url: lineUrl.trim(),
                        name: lineName ? lineName.trim() : 'Bulk QR',
                        color,
                        image: blob as Blob,
                        isDynamic: false
                    });
                }
            }
            // Reset QR to main url - use short URL for dynamic
            const activeUrl = isDynamic ? (virtualShortUrl || targetUrl) : url;
            if (qrCode.current) qrCode.current.update({ data: activeUrl || 'https://example.com' });
        } else {
            // Single Save Logic
            if (onSave && qrCode.current) {
                const blob = await qrCode.current.getRawData('png');
                if (blob) {
                    onSave({
                        url: isDynamic ? targetUrl : url, // Save the REAL destination
                        name,
                        color,
                        image: blob as Blob,
                        isDynamic,
                        // Save the virtual one for UI display
                        targetUrl: isDynamic ? virtualShortUrl : undefined
                    });
                }
            }
        }
    };

    const savePreset = () => {
        const newPreset: QRPreset = {
            id: Date.now().toString(),
            name: `Preset ${presets.length + 1}`,
            config: { color, bgColor, dotType, logo, logoSize }
        };
        setPresets([...presets, newPreset]);
    };

    const applyPreset = (preset: QRPreset) => {
        setColor(preset.config.color);
        setBgColor(preset.config.bgColor);
        setDotType(preset.config.dotType);
        setLogo(preset.config.logo);
        setLogoSize(preset.config.logoSize);
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? '' : section);
    };

    const dotTypes: { type: DotType; label: string, icon: any }[] = [
        { type: 'square', label: 'Square', icon: <div className="w-5 h-5 bg-current" /> },
        { type: 'dots', label: 'Dots', icon: <div className="w-5 h-5 bg-current rounded-full" /> },
        { type: 'rounded', label: 'Rounded', icon: <div className="w-5 h-5 bg-current rounded-md" /> },
        { type: 'extra-rounded', label: 'Extra', icon: <div className="w-5 h-5 bg-current rounded-lg" /> },
        { type: 'classy', label: 'Classy', icon: <div className="w-5 h-5 border-2 border-current rounded-tl-lg rounded-br-lg" /> },
        { type: 'classy-rounded', label: 'Soft', icon: <div className="w-5 h-5 border-2 border-current rounded-full" /> },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-4 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

                {/* Column 1: Configuration & Inputs (3/12) */}
                <div className="lg:col-span-3 flex flex-col gap-4 border-r border-gray-100 dark:border-white/5 pr-0 lg:pr-4">
                    {/* Mode Switcher */}
                    <div className="bg-gray-100 dark:bg-zinc-950 p-1 rounded-full inline-flex self-start">
                        <button
                            onClick={() => setMode('single')}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${mode === 'single' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}
                        >
                            Single
                        </button>
                        <button
                            onClick={() => setMode('bulk')}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${mode === 'bulk' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}
                        >
                            Bulk
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        {mode === 'single' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Destination</label>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">Dynamic</span>
                                        <button
                                            onClick={() => setIsDynamic(!isDynamic)}
                                            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDynamic ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-700'}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform ${isDynamic ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={targetUrl}
                                        onChange={(e) => setTargetUrl(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                                        placeholder="https://example.com"
                                        data-tutorial="url-input"
                                    />
                                    {isDynamic && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded border border-green-100 dark:border-green-500/20">
                                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                <p className="text-[9px] text-green-700 dark:text-green-400 font-medium truncate">
                                                    via: {virtualShortUrl}
                                                </p>
                                            </div>
                                            {/* Test Button - Only active if we have a real short URL, but for UI demo we just show it */}
                                            <button
                                                onClick={() => window.open(virtualShortUrl, '_blank')}
                                                className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-[9px] font-bold rounded border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                                                title="Test Redirect"
                                            >
                                                Test
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                                        placeholder="QR Name"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Bulk CSV</label>
                                <textarea
                                    value={bulkInput}
                                    onChange={(e) => setBulkInput(e.target.value)}
                                    className="flex-1 w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-gray-900 dark:text-white"
                                    placeholder="url, name..."
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: The Stage / Preview (5/12) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-zinc-950/50 rounded-2xl border border-gray-100/50 dark:border-white/5 p-6 relative group" data-tutorial="qr-preview">
                    <div ref={ref} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 dark:border-none transform transition-transform group-hover:scale-105 duration-300" />
                    {isDynamic && (
                        <div className="mt-4 max-w-xs text-center">
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-900/40">
                                <strong>Preview Only:</strong> This shows your destination URL. After saving, the actual QR will encode a short URL that redirects here.
                            </p>
                        </div>
                    )}
                    <p className="absolute bottom-2 text-[9px] font-bold text-gray-300 dark:text-gray-500 uppercase tracking-widest pointer-events-none">Live Preview</p>
                </div>

                {/* Column 3: Styles & Actions (4/12) */}
                <div className="lg:col-span-4 flex flex-col gap-4 border-l border-gray-100 dark:border-white/5 pl-0 lg:pl-4">
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px] scrollbar-thin">
                        {/* Templates */}
                        <div className="border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden">
                            <button onClick={() => toggleSection('templates')} className="w-full flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-[10px] text-gray-600 dark:text-gray-300"><Layers className="w-3 h-3 text-blue-500" /> TEMPLATES</div>
                                {activeSection === 'templates' ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </button>
                            {activeSection === 'templates' && (
                                <div className="p-2 grid grid-cols-2 gap-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5">
                                    {presets.map(p => (
                                        <button key={p.id} onClick={() => applyPreset(p)} className="text-left p-2 rounded border border-gray-100 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                                            <div className="text-[9px] font-bold text-gray-700 dark:text-gray-200">{p.name}</div>
                                            <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: p.config.color }} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pattern */}
                        <div className="border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden">
                            <button onClick={() => toggleSection('pattern')} className="w-full flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-[10px] text-gray-600 dark:text-gray-300"><Grid className="w-3 h-3 text-blue-500" /> PATTERN</div>
                                {activeSection === 'pattern' ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </button>
                            {activeSection === 'pattern' && (
                                <div className="p-2 grid grid-cols-3 gap-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5">
                                    {dotTypes.map(dt => (
                                        <button key={dt.type} onClick={() => setDotType(dt.type)} className={`p-2 rounded border flex justify-center ${dotType === dt.type ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-500' : 'border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-600'}`}>
                                            {dt.icon}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Color */}
                        <div className="border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden">
                            <button onClick={() => toggleSection('color')} className="w-full flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-[10px] text-gray-600 dark:text-gray-300"><Palette className="w-3 h-3 text-blue-500" /> COLOR</div>
                                {activeSection === 'color' ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </button>
                            {activeSection === 'color' && (
                                <div className="p-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex items-center justify-between" data-tutorial="color-picker">
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase">{color}</span>
                                </div>
                            )}
                        </div>

                        {/* Logo - NEW SECTION */}
                        <div className="border border-gray-100 dark:border-white/10 rounded-lg overflow-hidden">
                            <button onClick={() => toggleSection('logo')} className="w-full flex items-center justify-between p-2.5 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center gap-2 font-bold text-[10px] text-gray-600 dark:text-gray-300"><ImageIcon className="w-3 h-3 text-blue-500" /> LOGO</div>
                                {activeSection === 'logo' ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </button>
                            {activeSection === 'logo' && (
                                <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 space-y-3" data-tutorial="logo-upload">
                                    <div className="flex items-center gap-2">
                                        <label className="flex-1 cursor-pointer bg-gray-50 dark:bg-zinc-950 border border-dashed border-gray-200 dark:border-white/10 rounded-lg p-2 text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="flex flex-col items-center gap-1">
                                                <Upload className="w-4 h-4 text-gray-400" />
                                                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">Upload Logo</span>
                                            </div>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                        </label>
                                        {logo && (
                                            <div className="w-10 h-10 border border-gray-100 rounded-lg p-1 bg-white flex items-center justify-center relative group">
                                                <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                                <button onClick={() => setLogo('')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-2 h-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {logo && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[9px] font-bold text-gray-500">
                                                <span>Size</span>
                                                <span>{(logoSize * 100).toFixed(0)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="0.5"
                                                step="0.05"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-2">
                        <div className="flex gap-2" data-tutorial="download-button">
                            {['PNG', 'SVG'].map((fmt) => (
                                <button key={fmt} onClick={() => download(fmt.toLowerCase() as any)} className="flex-1 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded text-[9px] font-bold border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-700">
                                    {fmt}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleSave} className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center gap-2 font-bold shadow-md text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
                            <Save className="w-3.5 h-3.5" />
                            {mode === 'single' ? 'Save to Dashboard' : 'Generate Batch'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
