import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="button icon-left" onClick={() => navigate(-1)}>
      Back
    </button>
  );
}

export default BackButton;
