import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { slideToTop } from '../utils';

function RecordPage() {
  
    const { id } = useParams();

    // Auto slide to top on first visit of this page
    useEffect(() => {
      slideToTop();
    }, []);
  
    return (
    <div>
      Record Page <br/>
      ID: {id}
    </div>
  )
}

export default RecordPage
