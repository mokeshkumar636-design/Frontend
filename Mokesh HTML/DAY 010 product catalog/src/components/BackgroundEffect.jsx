import React from 'react';

export default function BackgroundEffect({ theme }) {
  // Render different abstract decorative elements based on active theme
  const renderElements = () => {
    switch (theme) {
      case 'foods':
        return (
          <div className="bg-decor foods-decor">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
        );
      case 'accessories':
        return (
          <div className="bg-decor accessories-decor">
            <div className="star star-1">✧</div>
            <div className="star star-2">✦</div>
            <div className="star star-3">✧</div>
            <div className="star star-4">✦</div>
            <div className="star star-5">✧</div>
          </div>
        );
      case 'sports':
        return (
          <div className="bg-decor sports-decor">
            <div className="grid-lines"></div>
            <div className="speed-line line-1"></div>
            <div className="speed-line line-2"></div>
            <div className="speed-line line-3"></div>
          </div>
        );
      case 'dress':
        return (
          <div className="bg-decor dress-decor">
            <div className="drape drape-1"></div>
            <div className="drape drape-2"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="theme-background-effects-wrapper">{renderElements()}</div>;
}
