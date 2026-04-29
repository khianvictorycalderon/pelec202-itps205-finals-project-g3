import React from 'react'
import { useParams } from 'react-router-dom'

function RecordPage() {
  
    const { id } = useParams();
  
    return (
    <div>
      Record Page <br/>
      ID: {id}
    </div>
  )
}

export default RecordPage
