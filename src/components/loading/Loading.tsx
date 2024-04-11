import React from 'react';
import './Loading.scss'; // File CSS để tùy chỉnh giao diện loading

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
