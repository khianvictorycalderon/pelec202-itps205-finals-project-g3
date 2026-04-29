import React, { useEffect } from 'react'
import { slideToTop } from '../utils';

function ErrorPage() {

  // Auto slide to top on first visit of this page
  useEffect(() => {
    slideToTop();
  }, []);

  return (
    <div>
      Error Page
    </div>
  )
}

export default ErrorPage
