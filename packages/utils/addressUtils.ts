// Utility function to shorten addresses
export function shortenAddress(address: string | null, lead = 5, tail = 5): string {
    if (!address || address.length <= lead + tail) {
        return address || ''; // Return as is if it's already short enough or null
    }
    return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}