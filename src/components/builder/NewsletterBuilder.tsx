'use client';

import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useHistory } from '@/hooks/useHistory';
import { SidebarItem } from './SidebarItem';
import { CanvasItem } from './CanvasItem';
import { nanoid } from 'nanoid';

// Define available widget types
export type WidgetType = 'text' | 'image' | 'button' | 'divider';

export interface Widget {
    id: string;
    type: WidgetType;
    content: any;
}

export default function NewsletterBuilder() {
    const {
        state: widgets,
        setState: setWidgets,
        undo,
        redo,
        canUndo,
        canRedo
    } = useHistory<Widget[]>([]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<WidgetType | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [settings, setSettings] = useState({
        backgroundColor: '#ffffff',
        primaryColor: '#2563eb',
        textColor: '#1f2937',
        fontFamily: 'sans-serif',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        // If dragging from sidebar, active.data.current.type should be set
        if (active.data.current?.type) {
            setActiveType(active.data.current.type);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // For now, simpler implementation: we handle insertion in DragEnd
        // Real-time preview implementation would go here
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setActiveType(null);
            return;
        }

        // If dropping a sidebar item onto the canvas
        if (active.data.current?.sortable?.containerId !== 'canvas' && active.data.current?.isSidebar) {
            const type = active.data.current.type as WidgetType;
            const newWidget: Widget = {
                id: nanoid(),
                type,
                content: {}, // Default content
            };

            setWidgets((items) => [...items, newWidget]);
        } else if (active.id !== over.id) {
            // Reordering existing items
            setWidgets((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
        setActiveType(null);
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800">Newsletter Builder</h1>
                    <div className="flex items-center rounded-md border bg-gray-50 p-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`rounded px-3 py-1 text-sm ${viewMode === 'desktop' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Desktop
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`rounded px-3 py-1 text-sm ${viewMode === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Mobile
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-2 mr-4 border-r pr-4">
                        <button disabled={!canUndo} onClick={undo} className="rounded p-2 hover:bg-gray-100 disabled:opacity-50">
                            Undo
                        </button>
                        <button disabled={!canRedo} onClick={redo} className="rounded p-2 hover:bg-gray-100 disabled:opacity-50">
                            Redo
                        </button>
                    </div>
                    <button className="rounded px-4 py-2 hover:bg-gray-100">Preview</button>
                    <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
                </div>
            </header>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 border-r bg-white p-4 overflow-y-auto">
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">Widgets</h2>
                        <div className="space-y-2">
                            <SidebarItem type="text" label="Text Block" />
                            <SidebarItem type="image" label="Image" />
                            <SidebarItem type="button" label="Button" />
                            <SidebarItem type="divider" label="Divider" />
                        </div>
                    </aside>

                    {/* Canvas */}
                    <main className="flex-1 overflow-y-auto bg-gray-100 p-8 transition-all">
                        <div
                            className={`mx-auto min-h-[800px] shadow-lg p-8 transition-all duration-300 ${viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-2xl'
                                }`}
                            style={{
                                backgroundColor: settings.backgroundColor,
                                fontFamily: settings.fontFamily,
                                color: settings.textColor,
                            }}
                        >
                            <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
                                {widgets.length === 0 && (
                                    <div className="text-center text-gray-400 border-2 border-dashed border-gray-200 rounded p-12">
                                        Drag and drop widgets here
                                    </div>
                                )}
                                {widgets.map((widget) => (
                                    <CanvasItem key={widget.id} widget={widget} />
                                ))}
                            </SortableContext>
                        </div>
                    </main>

                    {/* Right Sidebar - Properties */}
                    <aside className="w-72 border-l bg-white p-4 overflow-y-auto">
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
                            {activeId ? 'Widget Properties' : 'Global Styles'}
                        </h2>
                        {activeId ? (
                            <div className="text-sm text-gray-400">Select an element to edit properties</div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Background Color</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="color"
                                            value={settings.backgroundColor}
                                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                            className="h-8 w-8 rounded border p-0 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-500">{settings.backgroundColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Text Color</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="color"
                                            value={settings.textColor}
                                            onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                                            className="h-8 w-8 rounded border p-0 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-500">{settings.textColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            className="h-8 w-8 rounded border p-0 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-500">{settings.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Font Family</label>
                                    <select
                                        value={settings.fontFamily}
                                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm border"
                                    >
                                        <option value="sans-serif">Sans Serif</option>
                                        <option value="serif">Serif</option>
                                        <option value="monospace">Monospace</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="rounded border bg-white p-3 shadow-lg opacity-80 w-64">
                            {/* Simplified overlay */}
                            {activeType === 'text' && 'Text Block'}
                            {activeType === 'image' && 'Image'}
                            {activeType === 'button' && 'Button'}
                            {activeType === 'divider' && 'Divider'}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
