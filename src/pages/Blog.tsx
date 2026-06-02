import React from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime?: string; // Optional nice-to-have field
}

const Blog: React.FC = () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with AttendEase',
      excerpt: 'Learn how to set up and use AttendEase for seamless attendance management.',
      date: '2024-01-15',
      author: 'John Doe',
      readTime: '3 min read'
    },
    {
      id: 2,
      title: 'Best Practices for Attendance Tracking',
      excerpt: 'Tips and tricks to optimize your team\'s attendance tracking workflow.',
      date: '2024-01-10',
      author: 'Jane Smith',
      readTime: '5 min read'
    },
    {
      id: 3,
      title: 'New Features Released',
      excerpt: 'Discover the latest automated reporting features added to AttendEase.',
      date: '2024-01-05',
      author: 'Mike Johnson',
      readTime: '2 min read'
    }
  ];

  // Helper function to turn "2024-01-15" into "Jan 15, 2024"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3 sm:text-5xl">
            Blog
          </h1>
          <p className="text-lg text-zinc-600">
            Latest updates, guides, and insights about AttendEase.
          </p>
        </header>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-x-3 text-xs text-zinc-500 mb-3">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                <span className="text-zinc-300">•</span>
                <span>By {post.author}</span>
                {post.readTime && (
                  <>
                    <span className="text-zinc-300">•</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors mb-3">
                <a href={`/blog/${post.id}`}>
                  {post.title}
                </a>
              </h2>
              
              <p className="text-zinc-600 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="mt-4">
                <a 
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1"
                >
                  Read More 
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;