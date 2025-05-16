import React from 'react'
import ContentAquisitionPage from './content-aquisition'
import FileRegistrationUploader from './file-registration-upload'

const index = () => {
  return (
    <div className="container mx-auto py-8">
      <ContentAquisitionPage/>
      <FileRegistrationUploader/>
    </div>
  )
}

export default index