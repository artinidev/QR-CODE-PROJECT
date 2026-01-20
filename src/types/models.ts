import { ObjectId } from 'mongodb';

export interface UserLimits {
    maxQrCodes: number;
    maxProfiles: number;
}

export interface UserFeatures {
    analytics: boolean;
    customThemes: boolean;
    bulkGeneration: boolean;
    apiAccess: boolean;
}

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string; // Optional for pending users
    role: 'admin' | 'user' | 'sub-admin';
    status: 'active' | 'suspended' | 'pending';
    permissions?: string[]; // For sub-admins

    // SaaS Limits & Features
    limits?: UserLimits;
    features?: UserFeatures;

    // Invitation System
    invitationToken?: string;
    invitationExpires?: Date;

    // Subscription
    subscription?: {
        plan: 'free' | 'pro' | 'enterprise';
        status: 'active' | 'expired' | 'canceled';
        expiresAt: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}

export interface Group {
    _id?: ObjectId;
    userId: ObjectId;
    name: string;
    description?: string;
    profileCount: number;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    _id?: ObjectId;
    userId: ObjectId;
    groupId?: ObjectId | string; // Optional Group Association
    username: string; // Unique username for URL
    fullName: string;
    jobTitle?: string;
    company?: string;
    photo?: string;

    // Contact Information
    email?: string;
    phoneNumbers: string[];

    // Social Links
    linkedIn?: string;
    website?: string;
    twitter?: string;
    instagram?: string;

    // Privacy Settings
    showEmail: boolean;
    showPhone: boolean;

    // QR Code
    qrCodeUrl?: string;

    // Metadata
    status?: 'active' | 'deleted';
    createdAt: Date;
    updatedAt: Date;
}

export interface QRScan {
    _id?: ObjectId;
    profileId: ObjectId;
    userId: ObjectId;
    scannedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    location?: {
        country?: string;
        city?: string;
    };
}

export interface Analytics {
    _id?: ObjectId;
    userId: ObjectId;
    profileId: ObjectId;
    totalScans: number;
    uniqueScans: number;
    lastScannedAt?: Date;
    scansByDate: {
        date: string;
        count: number;
    }[];
}

export interface PlatformSettings {
    _id?: ObjectId;
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    allowedFields: {
        phone: boolean;
        email: boolean;
        socialLinks: boolean;
    };
    updatedAt: Date;
}

export interface Newsletter {
    _id?: ObjectId;
    userId: ObjectId;
    title: string;
    content: any; // JSON structure for widgets
    status: 'draft' | 'published';
    settings: {
        fontFamily?: string;
        primaryColor?: string;
        backgroundColor?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
