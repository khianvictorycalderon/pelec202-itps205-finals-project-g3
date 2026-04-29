import React, { useEffect } from 'react'
import { slideToTop } from '../utils';

function BrowsePage() {

  // Auto slide to top on first visit of this page
  useEffect(() => {
    slideToTop();
  }, []);

  return (
    <div>
      Browse Page
    </div>
  )
}

export default BrowsePage
