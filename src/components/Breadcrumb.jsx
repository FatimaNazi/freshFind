import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVisitorCount, incrementVisitorCount } from '../utils/storage';

export default function Breadcrumb({ items = [] }) {
  const [visitorCount, setVisitorCount] = useState(getVisitorCount());
  const [clockText, setClockText] = useState({ time: '', date: '' });

  useEffect(() => {
    // Increment visit once per session load
    const count = incrementVisitorCount();
    setVisitorCount(count);

    const updateClock = () => {
      const now = new Date();
      setClockText({
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      });
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav aria-label="breadcrumb" className="ff-breadcrumb-nav">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <ol className="breadcrumb mb-0 py-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            if (isLast) {
              return (
                <li key={index} className="breadcrumb-item active" aria-current="page">
                  {item.label}
                </li>
              );
            }
            return (
              <li key={index} className="breadcrumb-item">
                <Link to={item.path || '/'}>
                  {index === 0 && <i className="bi bi-house-door me-1"></i>}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="ff-subnav-meta d-flex align-items-center gap-3 py-1 ms-auto">
          <span className="subnav-visitor-badge" title="Total Website Visits">
            <i className="bi bi-people-fill text-success me-1"></i>
            <span className="visitor-count-value">{visitorCount.toLocaleString()}</span> visits
          </span>
          <span className="subnav-clock small" title="Current Time &amp; Date">
            <i className="bi bi-clock-fill text-warning me-1"></i>
            <span>
              <strong>{clockText.time}</strong> &middot; {clockText.date}
            </span>
          </span>
        </div>
      </div>
    </nav>
  );
}
