import styled from 'styled-components';

import { NavLink } from 'react-router-dom';

interface ContainerProps {
  size?: 'small' | 'large';
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;

        & + a {
          margin-left: 32px;
        }

        &:hover {
          opacity: 0.6;
        }
      }
    } */
  }
`;

export const Nav = styled(NavLink).attrs({
  activeStyle: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF872C',
    borderBottomStyle: 'solid',
  },
})`
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: opacity 0.2s;
  border: 0;

  & + a {
    margin-left: 32px;
  }

  &:hover {
    opacity: 0.6;
  }
`;
