import React, { useEffect } from 'react'
import { slideToTop } from '../utils';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';

function LandingPage() {

  // Auto slide to top on first visit of this page
  useEffect(() => {
    slideToTop();
  }, []);

  return (
    <>
      <Hero/>

      {/* For scrolling reference only */}
      <div id="statistics-section"/>

      <Statistics/>
    </>
  )
}

export default LandingPage
