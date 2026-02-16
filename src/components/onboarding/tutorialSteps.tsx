import { Step } from 'react-joyride';
import { Sparkles, LayoutDashboard, TrendingUp, Zap, Rocket, QrCode, Palette, Mail, BarChart3, Users, Settings, MousePointer, Download, Edit, Eye, Image as ImageIcon } from 'lucide-react';

// First-time user complete tutorial (comprehensive dashboard walkthrough)
export const firstTimeUserSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Welcome to SCANEX!</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                    Let's take a comprehensive tour of your dashboard. We'll show you how to navigate,
                    understand your analytics, and access your projects quickly.
                </p>
                <div className="text-xs text-slate-400">
                    💡 You can skip this tutorial anytime or restart it from Settings
                </div>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '.dashboard-header',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Navigation Bar</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    Use this navigation to access different sections:
                </p>
                <ul className="space-y-1.5 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Home</strong> - Your dashboard overview
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">QR Studio</strong> - Create new QR codes
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Profiles</strong> - Manage digital business cards
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Analytics</strong> - View detailed statistics
                    </li>
                </ul>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '.analytics-card',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Understanding Your Analytics</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    This card shows your performance at a glance:
                </p>
                <ul className="space-y-1.5 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Total Scans</strong> - How many times your QR codes were scanned
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Trend Arrow</strong> - Shows if scans are increasing or decreasing
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        <strong className="text-slate-300">Chart</strong> - Visual representation of scan activity
                    </li>
                </ul>
                <p className="text-xs text-slate-400 mt-2">
                    💡 Click on this card to see detailed analytics
                </p>
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '.recent-projects-card',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Quick Access to Your Work</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    Your recent projects appear here for quick access:
                </p>
                <ul className="space-y-1.5 text-sm text-slate-400">
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        Click any item to view or edit it
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        See creation date and status at a glance
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        Use "View All" to see your complete project list
                    </li>
                </ul>
            </div>
        ),
        placement: 'left',
    },
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Dashboard Tour Complete!</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                    You now know how to navigate your dashboard. Each page has its own tutorial
                    that will teach you how to use specific features.
                </p>
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
                    <p className="text-sm text-slate-300">
                        <strong className="text-indigo-400">Next:</strong> Visit the QR Studio to learn
                        how to create your first QR code!
                    </p>
                </div>
            </div>
        ),
        placement: 'center',
    },
];

// Dashboard Tutorial Steps (for manual restart)
export const dashboardSteps: Step[] = firstTimeUserSteps;

// QR Code Generator Tutorial Steps - HOW TO CREATE QR CODES
export const qrGeneratorSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">How to Create QR Codes</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                    This tutorial will teach you step-by-step how to create, customize, and download
                    professional QR codes. Let's get started!
                </p>
                <div className="text-xs text-slate-400">
                    💡 Takes about 2 minutes to complete
                </div>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '[data-tutorial="url-input"]',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <MousePointer className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Step 1: Enter Your URL</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Start by entering the destination URL where you want your QR code to redirect users.
                </p>
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20 space-y-2">
                    <p className="text-xs text-slate-300">
                        <strong className="text-indigo-400">Examples:</strong>
                    </p>
                    <ul className="space-y-1 text-xs text-slate-400">
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Website: <code className="text-indigo-300">https://yourwebsite.com</code>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Menu: <code className="text-indigo-300">https://menu.restaurant.com</code>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Social: <code className="text-indigo-300">https://instagram.com/username</code>
                        </li>
                    </ul>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    💡 <strong>Pro Tip:</strong> Enable "Dynamic" mode to change the destination later without reprinting!
                </p>
            </div>
        ),
        placement: 'right',
    },
    {
        target: '[data-tutorial="color-picker"]',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Step 2: Customize Colors</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Click the color picker to choose a color that matches your brand or design.
                </p>
                <div className="space-y-2">
                    <div className="bg-indigo-500/10 rounded-lg p-2 border border-indigo-500/20">
                        <p className="text-xs text-slate-300 mb-1">
                            <strong className="text-indigo-400">Color Tips:</strong>
                        </p>
                        <ul className="space-y-1 text-xs text-slate-400">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-green-400"></span>
                                Use high contrast for better scanning
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-green-400"></span>
                                Avoid very light colors on white backgrounds
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-green-400"></span>
                                Match your brand colors for consistency
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
        placement: 'left',
    },
    {
        target: '[data-tutorial="logo-upload"]',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Step 3: Add Your Logo (Optional)</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Make your QR code stand out by adding your company logo in the center.
                </p>
                <div className="space-y-2">
                    <div className="bg-indigo-500/10 rounded-lg p-2 border border-indigo-500/20">
                        <p className="text-xs text-slate-300 mb-1">
                            <strong className="text-indigo-400">How to add a logo:</strong>
                        </p>
                        <ol className="space-y-1 text-xs text-slate-400 list-decimal list-inside">
                            <li>Click "Upload Logo" button</li>
                            <li>Select your logo image (PNG, JPG, SVG)</li>
                            <li>Adjust the size slider if needed</li>
                        </ol>
                    </div>
                    <p className="text-xs text-slate-400">
                        💡 <strong>Best Practice:</strong> Use square logos for best results. The QR code remains scannable even with a logo!
                    </p>
                </div>
            </div>
        ),
        placement: 'left',
    },
    {
        target: '[data-tutorial="qr-preview"]',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Step 4: Preview Your QR Code</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    This is your live preview! Every change you make updates instantly here.
                </p>
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20 space-y-2">
                    <p className="text-xs text-slate-300">
                        <strong className="text-indigo-400">What you can do:</strong>
                    </p>
                    <ul className="space-y-1 text-xs text-slate-400">
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Test scan it with your phone camera
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Try different patterns from the PATTERN section
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Experiment with colors and logos
                        </li>
                    </ul>
                </div>
            </div>
        ),
        placement: 'top',
    },
    {
        target: '[data-tutorial="download-button"]',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Download className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100">Step 5: Download Your QR Code</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    Choose your preferred format and download your QR code!
                </p>
                <div className="space-y-2">
                    <div className="bg-indigo-500/10 rounded-lg p-2 border border-indigo-500/20">
                        <p className="text-xs text-slate-300 mb-1">
                            <strong className="text-indigo-400">Format Guide:</strong>
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-blue-400 mt-1"></span>
                                <div>
                                    <strong className="text-slate-300">PNG</strong> - Best for digital use (websites, emails, social media)
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-400 mt-1"></span>
                                <div>
                                    <strong className="text-slate-300">SVG</strong> - Best for print (flyers, business cards, banners) - scales infinitely
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        ),
        placement: 'top',
    },
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">You're a QR Code Pro! 🎉</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                    You now know how to create professional QR codes from start to finish!
                </p>
                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20 space-y-2">
                    <p className="text-sm text-slate-300 mb-2">
                        <strong className="text-indigo-400">What's Next?</strong>
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Click "Save to Dashboard" to save your QR code
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Visit the Analytics page to track scans
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                            Try "Bulk" mode to create multiple QR codes at once
                        </li>
                    </ul>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400">
                        💡 <strong>Remember:</strong> Dynamic QR codes let you change the destination URL anytime without reprinting!
                    </p>
                </div>
            </div>
        ),
        placement: 'center',
    },
];

// Analytics Tutorial Steps - HOW TO USE ANALYTICS
export const analyticsSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">How to Use Analytics</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                    Learn how to track your QR code performance, understand your audience, and make data-driven decisions.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
];

// Profile Tutorial Steps - HOW TO CREATE DIGITAL BUSINESS CARDS
export const profileSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Create Your Digital Business Card</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                    Learn how to build a professional digital profile with QR code for easy sharing and networking.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
];

// Themes Tutorial Steps
export const themesSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Customize Your Profile Theme</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                    Learn how to personalize your profile's appearance with themes, colors, and styles.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
];

// Marketing Campaigns Tutorial Steps
export const marketingSteps: Step[] = [
    {
        target: 'body',
        content: (
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-100">Create Marketing Campaigns</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                    Learn how to create, manage, and track marketing campaigns with QR codes.
                </p>
            </div>
        ),
        placement: 'center',
        disableBeacon: true,
    },
];
