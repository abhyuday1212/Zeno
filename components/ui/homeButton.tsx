"use client";

import { House } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const HomeButton = () => {
  const router = useRouter();

  function goHome() {
    router.push("/");
  }

  return (
    <StyledWrapper>
      <div className="flex items-center justify-center pt-2 w-full px-1">
        <button onClick={goHome}>
          <p>Home</p>
          <House className="icon" size={26} strokeWidth={2} />
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    font-weight: 600;
    line-height: 1;
  }

  button p {
    font-size: 22px;
    font-weight: 600;
    color: #fff;
  }

  button svg {
    color: #fff;
    transition: transform 0.1s ease-out, color 0.1s ease-out;
    vertical-align: middle;
    /* Removed fixed width so size prop controls the dimensions */
  }

  button:hover svg {
    transform: translateX(4px);
    color: #c84747;
  }

  button::after {
    position: absolute;
    content: "";
    width: 0;
    left: 0;
    bottom: -5px;
    background: #c84747;
    height: 2px;
    transition: width 0.1s ease-out;
  }

  button:hover::after {
    width: 100%;
  }
`;

export default HomeButton;
