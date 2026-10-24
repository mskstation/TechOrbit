
import React from 'react';

export default function AlertBanner({
  message,
  onRetry,
  onDismiss,
}) {
  if (!message) return null;

  return (
    <div className="alert-banner" role="alert">
      <div className="alert-banner-content">
        <span className="alert-banner-icon">⚠</span>
        <p>{message}</p>
      </div>

      <div className="alert-banner-actions">
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        )}

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
