import type { Paragraph } from '@edw/next-drupal/@types'

import { useAntdBreakpoints } from '@edw/next-drupal/hooks'
import { RenderParagraph } from '@edw/next-drupal/molecules'

import FactsFiguresColumns from './fact-figures--columns.svg'
import FactsFiguresRowsMobile from './fact-figures--rows--mobile.svg'
import FactsFiguresRows from './fact-figures--rows.svg'

import './FactFigures.scss'

type Props = {
  paragraph?: {
    field_facts_figures_variations: 'variation1' | 'variation2'
  } & Paragraph
}

const field_variations_mapping = {
  default: 'columns',
  variation1: 'rows',
  variation2: 'columns',
}

const FactFigures: React.FC<Props> = ({ paragraph }) => {
  const paragraphs = paragraph?.field_paragraphs
  const breakpoints = useAntdBreakpoints()
  return (
    <div
      className={`facts-figures facts-figures--${
        field_variations_mapping[
          paragraph?.field_facts_figures_variations || 'default'
        ]
      }`}
    >
      <div>
        {paragraphs &&
          paragraphs.length > 0 &&
          paragraphs.map((item: any, index: number) => (
            <div key={index}>
              {paragraph?.field_facts_figures_variations == 'variation2' ? (
                <FactsFiguresColumns className="visual" />
              ) : null}
              <RenderParagraph paragraph={item} />
            </div>
          ))}
      </div>
      {paragraph?.field_facts_figures_variations == 'variation1' ? (
        !breakpoints.md ? (
          <FactsFiguresRowsMobile className="visual" />
        ) : (
          <FactsFiguresRows className="visual" />
        )
      ) : null}
    </div>
  )
}
export default FactFigures
