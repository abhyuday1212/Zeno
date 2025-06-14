import React from "react";
import styled from "styled-components";

const HomeButton = ({ item, func }) => {
  return (
    <StyledWrapper>
      <button className="animated-button" onClick={func}>
        <svg
          viewBox="0 0 24 24"
          className="arr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
        <span className="text">{item}</span>
        <span className="circle" />
        <svg
          viewBox="0 0 24 24"
          className="arr-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated-button {
    position: relative;
    width: 135px;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 9px 36px;
    border: 3px solid;
    border-color: transparent;
    font-size: 16px;
    background-color: inherit;
    border-radius: 12px;
    font-weight: 600;
    color: #4d7c0f;
    box-shadow: 0 0 0 2px #4d7c0f;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button svg {
    position: absolute;
    width: 24px;
    fill: #4d7c0f;
    z-index: 9;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .arr-1 {
    right: 16px;
  }

  .animated-button .arr-2 {
    left: -25%;
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #4d7c0f;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transform: translateX(-10px);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .animated-button:hover {
    // box-shadow: 0 0 0 12px transparent;
    color: #212121;
    background-color: #4d7c0f;
    border-radius: 12px;
  }

  .animated-button:hover .arr-1 {
    right: -25%;
  }

  .animated-button:hover .arr-2 {
    left: 16px;
  }

  .animated-button:hover .text {
    transform: translateX(12px);
  }

  .animated-button:hover svg {
    fill: #212121;
  }

  .animated-button:active {
    box-shadow: 0 0 0 4px #4d7c0f;
  }

  .animated-button:hover .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }
`;

export default HomeButton;
