'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from './NewsletterBuilder';

interface CanvasItemProps {
    widget: Widget;
}

export function CanvasItem({ widget }: CanvasItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: widget.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderContent = () => {
        switch (widget.type) {
            case 'text':
                return <div className="p-4 text-gray-800">This is a text block. Click to edit.</div>;
            case 'image':
                return (
                    <div className="flex h-32 items-center justify-center bg-gray-200 text-gray-500">
                        Image Placeholder
                    </div>
                );
            case 'button':
                return (
                    <div className="flex justify-center p-4">
                        <button className="rounded bg-blue-600 px-6 py-2 text-white">Button</button>
                    </div>
                );
            case 'divider':
                return <hr className="my-4 border-gray-300" />;
            default:
                return <div>Unknown Widget</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative mb-2 rounded border border-transparent hover:border-blue-500 hover:shadow-sm"
        >
            {/* Handle for dragging - only show on hover */}
            <div
                {...attributes}
                {...listeners}
                className="absolute right-2 top-2 hidden cursor-grab rounded bg-white p-1 shadow group-hover:block"
            >
                ⋮⋮
            </div>

            {renderContent()}
        </div>
    );
}
