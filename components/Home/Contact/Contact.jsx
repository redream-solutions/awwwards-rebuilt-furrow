import React from 'react';
import useCursorStyle from '../../../hooks/useCursorStyle';
import AnimateOnScreen from '../../AnimateOnScreen';
import SocialMedia from '../../SocialMedia';
import { ContactSection } from './styles';

const Contact = () => {
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  return (
    <AnimateOnScreen>
      <ContactSection>
        <div className="column">
          <a
            className="contact-text"
            href="tel:+1.310.555.0194"
            onMouseEnter={addCursorBorder}
            onMouseLeave={removeCursorBorder}
          >
            +1.310.555.0194
          </a>
          <br />
          <a
            className="contact-text"
            href="mailto:hello@cutaway.studio"
            onMouseEnter={addCursorBorder}
            onMouseLeave={removeCursorBorder}
          >
            hello@cutaway.studio
          </a>
        </div>
        <address className="column contact-text">
          1200 Cahuenga Blvd Suite 4<br /> Los Angeles, CA 90038
        </address>
        <SocialMedia className="column" />
      </ContactSection>
    </AnimateOnScreen>
  );
};

export default React.memo(Contact);
