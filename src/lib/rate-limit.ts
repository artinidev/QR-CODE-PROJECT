type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export default function rateLimit(options?: Options) {
    const tokenCache = new Map();
    let lastClearTime = Date.now();

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const now = Date.now();

                // Clear cache every interval to prevent memory leaks in long-running processes
                if (now - lastClearTime > (options?.interval || 60000)) {
                    tokenCache.clear();
                    lastClearTime = now;
                }

                const tokenCount = tokenCache.get(token) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                // Reset token count after interval (basic window approach)
                // Note: For production, a sliding window or Redis is better.
                // This is a "Pro Minimal" in-memory Start.
                if (currentUsage === 1) {
                    setTimeout(() => {
                        tokenCount[0] = 0;
                        tokenCache.delete(token);
                    }, options?.interval || 60000);
                }

                isRateLimited ? reject() : resolve();
            }),
    };
}
