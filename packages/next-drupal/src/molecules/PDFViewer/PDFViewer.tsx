import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import packageJson from '@edw/next-drupal/package.json'

const pdfjsVersion = packageJson.dependencies['pdfjs-dist'].replace(/[~^]/g, '')

import { withClientOnly } from '@edw/next-drupal/hocs'

import './PDFViewer.scss'

type PDFViewerProps = {
  url: string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div className="pdf-viewer">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.js`}
      >
        <div className="pdf-viewer-inner">
          <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
        </div>
      </Worker>
    </div>
  )
}
export default withClientOnly(PDFViewer)
