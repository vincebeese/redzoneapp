export function formatDistanceToNow(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString();
  } else if (diffDay > 0) {
    return `${diffDay}d ago`;
  } else if (diffHr > 0) {
    return `${diffHr}h ago`;
  } else if (diffMin > 0) {
    return `${diffMin}m ago`;
  } else {
    return 'just now';
  }
}
