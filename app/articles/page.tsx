'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { Article } from '@/types';
import '@/styles/pages/articles.scss';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await apiClient.getArticles();
        if (response.success && response.data) {
          setArticles(response.data);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();

    analytics.pageView({
      path: '/articles',
      title: 'Articles',
    });
  }, []);

  return (
    <div className="articles-page">
      <div className="page-header">
        <div className="container">
          <h1>Stories & Insights</h1>
          <p>Explore our collection of articles and inspiration</p>
        </div>
      </div>

      <section className="articles-section">
        <div className="container">
          {isLoading ? (
            <div className="articles-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="article-card"
                >
                  <div className="article-image-wrapper">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="article-image"
                    />
                    <div className="article-overlay"></div>
                  </div>

                  <div className="article-content">
                    <div className="article-meta">
                      <span className="author">{article.author}</span>
                      <span className="date">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3>{article.title}</h3>
                    <p className="excerpt">{article.excerpt}</p>

                    <div className="article-tags">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="read-more">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
