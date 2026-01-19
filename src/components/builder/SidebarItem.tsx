'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { WidgetType } from './NewsletterBuilder';

interface SidebarItemProps {
    type: WidgetType;
    label: string;
}

export function SidebarItem({ type, label }: SidebarItemProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebar: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-move rounded border bg-gray-50 p-3 hover:border-blue-500 hover:shadow-sm"
        >
            {label}
        </div>
    );
}
