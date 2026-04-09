let activeConnections = 0;

export function increment() { activeConnections++; }
export function decrement() { if (activeConnections > 0) activeConnections--; }
export function count() { return activeConnections; }
