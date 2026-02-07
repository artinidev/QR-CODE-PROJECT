
// Helper to parse user agent
export function parseUserAgent(ua: string) {
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);

    let device = 'Desktop';
    if (isTablet) device = 'Tablet';
    else if (isMobile) device = 'Mobile';

    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    return { device, browser, os };
}

// Helper to get location from IP (using free ipapi.co service)
export async function getLocationFromIP(ip: string) {
    try {
        // Skip for localhost/private IPs
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return { country: 'Local', city: 'Local', ip };
        }

        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: { 'User-Agent': 'PDI-Platform/1.0' },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            return { country: 'Unknown', city: 'Unknown', ip };
        }

        const data = await response.json();
        return {
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown',
            ip
        };
    } catch (error) {
        console.error('Error fetching location:', error);
        return { country: 'Unknown', city: 'Unknown', ip };
    }
}
