import React, { useEffect } from 'react'
import Hero from '../components/Hero';
import { slideToTop } from '../utils';

function LandingPage() {

  // Auto slide to top on first visit of this page
  useEffect(() => {
    slideToTop();
  }, []);

  return (
    <>
      <Hero/>
    </>
  )
}

export default LandingPage
