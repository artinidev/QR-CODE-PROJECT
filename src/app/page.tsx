import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold">PDI Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/auth/signin" className="text-sm font-medium hover:text-blue-600">
              Sign In
            </Link>
            <Link
              href="/builder"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Build Professional Digital Identities <br />
              <span className="text-blue-600">Without Coding</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              Create stunning newsletters, digital business cards, and landing pages with our drag-and-drop builder.
              Engage your audience with professional tools designed for growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/builder"
                className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                Launch Builder
              </Link>
              <Link href="#" className="text-sm font-semibold leading-6 flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Drag & Drop Builder</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Intuitive interface lets you construct newsletters and pages in minutes. No technical skills required.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-block rounded-lg bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Smart QR Codes</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Generate dynamic QR codes for your digital assets. Track scans and engagement in real-time.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Deep insights into how your newsletters and pages are performing. Optimize for better conversion.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} PDI Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
