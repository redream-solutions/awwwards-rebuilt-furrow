import React from 'react';
import styled from 'styled-components';
import containerStyles from '../../styles/shared/container';
import { secondaryFontStyle } from '../../styles/shared/text';

const Wrapper = styled.div`
  ${containerStyles};
  padding-top: 48px;
  padding-bottom: max(120px, calc(env(safe-area-inset-bottom, 0px) + 100px));

  ${({ theme }) => theme.breakpoints.tablet`
    padding-top: 32px;
    padding-bottom: max(100px, calc(env(safe-area-inset-bottom, 0px) + 88px));
  `};
`;

const Line = styled.p`
  margin: 0;
  ${secondaryFontStyle};
  font-size: 0.6875rem;
  line-height: 1.35;
  letter-spacing: 0.16em;
  text-align: center;
  color: ${({ theme }) => theme.colors.red};
`;

const DesignCredit = () => (
  <Wrapper>
    <Line>DESIGNED BY: REDREAM</Line>
  </Wrapper>
);

export default React.memo(DesignCredit);
