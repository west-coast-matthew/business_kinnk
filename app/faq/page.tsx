'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { analytics } from '@/lib/analytics/tracker';
import { FAQ } from '@/types';
import '@/styles/pages/faq.scss';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await apiClient.getFAQs();
        if (response.success && response.data) {
          setFaqs(response.data);
        }
      } catch (error) {
        console.error('Failed to load FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();

    analytics.pageView({
      path: '/faq',
      title: 'FAQ',
    });
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filteredFAQs =
    selectedCategory === 'all' ? faqs : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="faq-page">
      <div className="page-header">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our products and services</p>
        </div>
      </div>

      <section className="faq-section">
        <div className="container">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* FAQs List */}
          {isLoading ? (
            <div className="loading">Loading FAQs...</div>
          ) : (
            <div className="faq-list">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      aria-expanded={expandedId === faq.id}
                    >
                      <span className="question-text">{faq.question}</span>
                      <span className="toggle-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>

                    {expandedId === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-results">No FAQs found for this category.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Still have questions?</h2>
            <p>Can't find the answer you're looking for? Our customer service team is here to help.</p>
            <a href="/contact" className="btn btn-primary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
