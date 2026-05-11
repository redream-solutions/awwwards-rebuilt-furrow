import { css } from 'styled-components';
import { breakpoints } from '../media';

export default css`
  max-width: 1234px;
  padding: 0 32px;
  margin: 0 auto;

  @media screen and (max-width: ${breakpoints.tablet}px) {
    padding: 0 20px;
  }
`;
