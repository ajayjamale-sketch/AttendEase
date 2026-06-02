import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BlogPostData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime?: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Sample blog posts data - in a real app, this would come from an API or database
  const blogPosts: BlogPostData[] = [
    {
      id: 1,
      title: 'Getting Started with AttendEase',
      excerpt: 'Learn how to set up and use AttendEase for seamless attendance management.',
      content: `AttendEase is a powerful attendance management system designed to simplify tracking and reporting. 
      
In this guide, we'll walk you through the basic setup process and show you how to get the most out of the platform.

## Installation

Simply navigate to the dashboard and follow the onboarding steps. The setup process takes less than 5 minutes.

## Key Features

- Real-time attendance tracking
- Automated reporting
- Employee management
- Customizable work schedules
- Integration with popular HR tools

## Getting Started

Once you've set up your account, start by adding your employees to the system. You can upload a CSV file or add them manually.

Then, configure your work hours and attendance rules. AttendEase will automatically track attendance based on your settings.

## Tips for Success

1. Set up geofencing for accurate location-based tracking
2. Enable notifications for late arrivals
3. Regular reports help identify patterns and issues
4. Use the dashboard to monitor attendance trends

Start using AttendEase today and streamline your attendance management!`,
      date: '2024-01-15',
      author: 'John Doe',
      readTime: '3 min read'
    },
    {
      id: 2,
      title: 'Best Practices for Attendance Tracking',
      excerpt: 'Tips and tricks to optimize your team\'s attendance tracking workflow.',
      content: `Effective attendance tracking is crucial for maintaining productivity and ensuring fair treatment of all employees.
      
Here are some best practices to help you get the most out of AttendEase.

## Establish Clear Policies

Before implementing any attendance system, ensure your team understands the policies. Clear communication prevents confusion and disputes.

## Use Automation

Leverage AttendEase's automation features to reduce manual work:
- Automatic clock-in/out for fixed schedules
- Automated alerts for absences
- Scheduled reports

## Regular Monitoring

Don't just set it and forget it. Regularly review attendance data to identify patterns and address issues early.

## Employee Self-Service

Allow employees to:
- View their attendance records
- Request time off
- Correct mistakes

## Data Security

Ensure sensitive attendance data is protected with proper access controls and regular backups.

## Continuous Improvement

Gather feedback from both managers and employees, and adjust your processes accordingly.

By following these practices, you'll create a fair and efficient attendance tracking system.`,
      date: '2024-01-10',
      author: 'Jane Smith',
      readTime: '5 min read'
    },
    {
      id: 3,
      title: 'New Features Released',
      excerpt: 'Discover the latest automated reporting features added to AttendEase.',
      content: `We're excited to announce our latest feature release! Here's what's new in AttendEase 2.1.

## Automated Reporting Engine

The new automated reporting engine allows you to:
- Generate custom reports with a few clicks
- Schedule reports to be sent automatically
- Export data in multiple formats (PDF, Excel, CSV)
- Create interactive dashboards

## Advanced Analytics

Gain deeper insights with:
- Attendance trends analysis
- Predictive analytics for absence patterns
- Department-level performance metrics
- Custom KPI tracking

## Mobile App Improvements

- Faster check-in/out process
- Offline mode support
- Push notifications for approvals
- Improved user interface

## Integration Enhancements

We've expanded our integrations to include:
- Slack notifications
- Google Workspace sync
- Microsoft Teams integration
- Payroll system connections

## Performance Improvements

We've optimized the platform for better performance:
- 40% faster load times
- Improved mobile responsiveness
- Better handling of large datasets

## Availability

These features are available now for all plans. Check your account to start using them today!

Thank you for being part of the AttendEase community!`,
      date: '2024-01-05',
      author: 'Mike Johnson',
      readTime: '2 min read'
    }
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || '0'));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50/50 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-lg text-zinc-600 mb-8">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-8 gap-1"
        >
          <span className="inline-block transition-transform">←</span>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-x-3 text-sm text-zinc-500 mb-4">
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

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4 sm:text-5xl">
            {post.title}
          </h1>

          <p className="text-xl text-zinc-600 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-zinc max-w-none bg-white rounded-xl border border-zinc-200/80 p-8 shadow-sm">
          <div className="whitespace-pre-wrap text-zinc-700 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => {
              // Handle headings
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-zinc-900 mt-8 pt-4 border-t border-zinc-200">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              // Handle list items
              if (paragraph.startsWith('-')) {
                const items = paragraph.split('\n').filter(item => item.startsWith('-'));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 text-zinc-700">
                    {items.map((item, idx) => (
                      <li key={idx} className="ml-2">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Handle numbered lists
              if (paragraph.match(/^\d\./)) {
                const items = paragraph.split('\n').filter(item => item.match(/^\d\./));
                return (
                  <ol key={index} className="list-decimal list-inside space-y-2 text-zinc-700">
                    {items.map((item, idx) => (
                      <li key={idx} className="ml-2">
                        {item.replace(/^\d\.\s/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              // Regular paragraph
              return (
                <p key={index} className="text-zinc-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">More from the Blog</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map(relatedPost => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.id}`}
                  className="group bg-white rounded-lg border border-zinc-200/80 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-xs text-zinc-500 mb-2">
                    {formatDate(relatedPost.date)}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
