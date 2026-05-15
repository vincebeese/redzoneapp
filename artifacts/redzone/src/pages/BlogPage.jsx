import { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/blog/feed')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load posts');
        return r.json();
      })
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">Blog &amp; Newsletter</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            Sales thinking from the field.
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
            Practical perspectives on B2B sales, pipeline discipline, deal strategy, and the mental game. Published on Substack.
          </p>
          <a
            href="https://vbeese.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
          >
            Subscribe on Substack →
          </a>
        </div>
      </section>

      {/* Post List */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">Couldn't load posts right now.</p>
              <a
                href="https://vbeese.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C0392B] font-medium hover:underline"
              >
                Read directly on Substack →
              </a>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No posts found.</p>
              <a
                href="https://vbeese.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C0392B] font-medium hover:underline"
              >
                Visit Substack →
              </a>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="divide-y divide-gray-100">
              {posts.map((post, i) => {
                const excerpt = post.excerpt || stripHtml(post.content || '').slice(0, 220);
                return (
                  <article key={i} className="py-8 first:pt-0 last:pb-0 group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-2">{formatDate(post.pubDate)}</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-[#1A1A1A] mb-3 leading-snug group-hover:text-[#C0392B] transition-colors">
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {post.title}
                          </a>
                        </h2>
                        {excerpt && (
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-[#C0392B] hover:underline"
                        >
                          Read on Substack →
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="bg-[#F9F6F0] py-12 border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-3 text-[#1A1A1A]">
            Get new posts in your inbox.
          </h2>
          <p className="text-gray-600 mb-5 text-sm">
            Sales strategy, deal tactics, and the mental game. Subscribe on Substack and never miss a post.
          </p>
          <a
            href="https://vbeese.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
          >
            Subscribe on Substack →
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
