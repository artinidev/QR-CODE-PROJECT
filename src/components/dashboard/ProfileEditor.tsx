'use client';

import React, { useState, useEffect } from 'react';
import { Profile } from '@/types/models';
import { Loader2, Save, User, Mail, Globe, Linkedin, Eye, EyeOff, ArrowLeft, X, Check, RotateCw, ZoomIn } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';

interface ProfileEditorProps {
    profileId: string | null;
    onBack: () => void;
    onSaveSuccess: () => void;
}

export default function ProfileEditor({ profileId, onBack, onSaveSuccess }: ProfileEditorProps) {
    const [profile, setProfile] = useState<Partial<Profile> | null>(null);
    const [loading, setLoading] = useState(!!profileId);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Crop State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        } else {
            // Initialize empty profile for creation
            setProfile({
                fullName: '',
                jobTitle: '',
                company: '',
                email: '',
                phoneNumbers: [],
                showEmail: true,
                showPhone: true,
                website: '',
                linkedIn: ''
            });
            setLoading(false);
        }
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/profiles/${profileId}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else {
                setMessage({ type: 'error', text: 'Failed to load profile.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to load profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const url = profileId ? `/api/profiles/${profileId}` : '/api/profiles';
            const method = profileId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: profileId ? 'Profile updated successfully!' : 'Profile created successfully!' });
                if (!profileId) {
                    // small delay then go back
                    setTimeout(onSaveSuccess, 1000);
                }
            } else {
                const errData = await res.json();
                setMessage({ type: 'error', text: errData.error || 'Failed to save profile.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleToggle = (name: string) => {
        // @ts-ignore
        setProfile(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, phoneNumbers: [e.target.value] }));
    };

    if (loading) return (
        <div className="flex items-center justify-center p-8 bg-card rounded-xl border border-border shadow-sm">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
        </div>
    );

    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-accent/20 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-background transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {profileId ? 'Edit Profile' : 'Create New Profile'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {profileId ? 'Update your personal information and contact details.' : 'Fill in the details for your new digital card.'}
                    </p>
                </div>
            </div>

            {message && (
                <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal Details
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                                {profile?.photo ? (
                                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full text-xs font-medium">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(file);
                                            reader.onload = () => {
                                                setImageSrc(reader.result as string);
                                                setIsCropping(true);
                                                setZoom(1);
                                                setRotation(0);
                                                setCrop({ x: 0, y: 0 });
                                            };
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium">Profile Photo</h4>
                            <p className="text-xs text-muted-foreground">This will be displayed on your public QR profile.</p>
                            {profile?.photo && (
                                <button
                                    type="button"
                                    onClick={() => setProfile(prev => ({ ...prev, photo: '' }))}
                                    className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                                >
                                    Remove Photo
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={profile?.fullName || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <input
                                type="text"
                                value={profile?.username || (profileId ? '' : 'Auto-generated')}
                                disabled
                                className="w-full rounded-lg bg-muted border border-transparent px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={profile?.jobTitle || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={profile?.company || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-background border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border my-6"></div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Email Address</label>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('showEmail')}
                                    className={`text-xs flex items-center gap-1 transition-colors ${profile?.showEmail ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                >
                                    {profile?.showEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {profile?.showEmail ? 'Visible on profile' : 'Hidden from profile'}
                                </button>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={profile?.email || ''}
                                onChange={handleChange}
                                className={`w-full rounded-lg bg-background border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${profile?.showEmail ? 'border-primary/50' : 'border-input'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Phone Number</label>
                                <button
                                    type="button"
                                    onClick={() => handleToggle('showPhone')}
                                    className={`text-xs flex items-center gap-1 transition-colors ${profile?.showPhone ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                                >
                                    {profile?.showPhone ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    {profile?.showPhone ? 'Visible on profile' : 'Hidden from profile'}
                                </button>
                            </div>
                            <input
                                type="tel"
                                value={profile?.phoneNumbers?.[0] || ''}
                                onChange={handlePhoneChange}
                                className={`w-full rounded-lg bg-background border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${profile?.showPhone ? 'border-primary/50' : 'border-input'}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border my-6"></div>

                {/* Social Links */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Social Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website URL</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    name="website"
                                    value={profile?.website || ''}
                                    onChange={handleChange}
                                    placeholder="https://example.com"
                                    className="w-full rounded-lg bg-background border border-input pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="url"
                                    name="linkedIn"
                                    value={profile?.linkedIn || ''}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full rounded-lg bg-background border border-input pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Crop Modal */}
            {
                isCropping && imageSrc && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                                <h3 className="font-bold flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Adjust Profile Photo
                                </h3>
                                <button onClick={() => setIsCropping(false)} className="p-2 hover:bg-muted rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative w-full h-[400px] bg-black">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                />
                            </div>

                            <div className="p-6 space-y-6 bg-white dark:bg-zinc-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <ZoomIn className="w-4 h-4" /> Zoom
                                        </label>
                                        <input
                                            type="range"
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            aria-labelledby="Zoom"
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <RotateCw className="w-4 h-4" /> Rotation
                                        </label>
                                        <input
                                            type="range"
                                            value={rotation}
                                            min={0}
                                            max={360}
                                            step={1}
                                            aria-labelledby="Rotation"
                                            onChange={(e) => setRotation(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <button
                                        onClick={() => setIsCropping(false)}
                                        className="px-6 py-2.5 rounded-xl font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (croppedAreaPixels && imageSrc) {
                                                try {
                                                    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
                                                    setProfile(prev => ({ ...prev, photo: croppedImage }));
                                                    setIsCropping(false);
                                                    setImageSrc(null); // Cleanup
                                                } catch (e) {
                                                    console.error(e);
                                                    alert('Failed to crop image');
                                                }
                                            }
                                        }}
                                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all text-sm flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Apply Photo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// Utility for creating the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

// Returns the new bounding area of a rotated rectangle
function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0);

    // Optimize: Resize to 800x800 max if larger
    const MAX_SIZE = 800;
    if (canvas.width > MAX_SIZE || canvas.height > MAX_SIZE) {
        const tempCanvas = document.createElement('canvas');
        let newWidth = canvas.width;
        let newHeight = canvas.height;

        if (newWidth > newHeight) {
            newHeight *= MAX_SIZE / newWidth;
            newWidth = MAX_SIZE;
        } else {
            newWidth *= MAX_SIZE / newHeight;
            newHeight = MAX_SIZE;
        }

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx?.drawImage(canvas, 0, 0, newWidth, newHeight);

        return tempCanvas.toDataURL('image/jpeg', 0.8);
    }

    // Return compressed JPEG
    return canvas.toDataURL('image/jpeg', 0.8);
}
