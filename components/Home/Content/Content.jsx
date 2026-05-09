import React from 'react';
import AnimateOnScreen from '../../AnimateOnScreen';
import { ContentSection, TextWrapper, Text } from './styles';

const Content = () => {
  return (
    <AnimateOnScreen>
      <ContentSection>
        <TextWrapper>
          <Text>
            The best frame in the sequence is never an accident&mdash;
            <br />
            it&apos;s a decision. We build trailers, promos, and editorial
            campaigns where every cut earns its place and every second moves the
            audience.
          </Text>
        </TextWrapper>
      </ContentSection>
    </AnimateOnScreen>
  );
};

export default Content;
