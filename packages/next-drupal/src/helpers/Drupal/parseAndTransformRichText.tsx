// @todo: This file might create circular dependencies, so it should be moved to a different location
import { Fragment, ReactElement } from 'react'

import serialize from 'dom-serializer'
import parse, { Element } from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image'

import { DrupalLink } from '@edw/next-drupal/components/ui'
import { EntityEmbed } from '@edw/next-drupal/molecules'

import { textNodesOnly } from '../Html'
import { createBaseURL } from '../Url'

type TransformFunction = (
  domNode: Element | any,
  stripLinks?: boolean,
) => ReactElement | undefined

const _transformElementWithNesting = (domNode: Element, stripLinks = false) => {
  if (!domNode) return null

  if (domNode instanceof Element && transformConfig[domNode.name]) {
    return parseAndTransformRichText(serialize(domNode), stripLinks)
  }

  if (domNode.children && domNode.children.length > 0) {
    const childrenElems = domNode.children.map((child, key) => {
      return (
        <Fragment key={key}>
          {_transformElementWithNesting(child as Element, stripLinks)}
        </Fragment>
      )
    })

    const Tag = domNode.name as React.ElementType
    return <Tag {...domNode.attribs}>{childrenElems}</Tag>
  }

  return parseAndTransformRichText(serialize(domNode), stripLinks)
}

const transformLink: TransformFunction = (domNode, stripLinks) => {
  const { class: className = '', ...otherAttribs } = domNode?.attribs || {
    class: '',
  }

  const childrenElements = domNode?.children?.map((child, key) => {
    return (
      <Fragment key={key}>
        {_transformElementWithNesting(child as Element, stripLinks)}
      </Fragment>
    )
  })

  if (stripLinks) {
    return (
      <span className={className} {...otherAttribs}>
        {childrenElements}
      </span>
    )
  }

  if (domNode?.attribs?.href) {
    return (
      <DrupalLink
        className={className}
        href={domNode.attribs.href}
        {...otherAttribs}
      >
        {childrenElements}
      </DrupalLink>
    )
  }
}

const transformImage: TransformFunction = (domNode) => {
  if (domNode.attribs && domNode.attribs.src) {
    const imgSrc = domNode?.attribs?.src
      ? createBaseURL(domNode.attribs.src)
      : ''
    const width =
      domNode.attribs.width && domNode.attribs.width !== 'auto'
        ? parseInt(domNode.attribs.width, 10)
        : 600
    const height =
      domNode.attribs.height && domNode.attribs.height !== 'auto'
        ? parseInt(domNode.attribs.height, 10)
        : 400
    return (
      <>
        {imgSrc ? (
          <Image
            alt={domNode.attribs.alt || ''}
            height={height}
            src={imgSrc}
            style={{ height: height, width: width }}
            width={width}
            priority
          />
        ) : (
          <p>Image src undefined</p>
        )}
      </>
    )
  }
}

const transformP: TransformFunction = (domNode, stripLinks = false) => {
  const { class: className = undefined, ...otherAttribs } =
    domNode?.attribs || {
      class: '',
    }

  const hasSeparator = className && className?.indexOf('separator') >= 0

  const childrenElements = domNode?.children?.map((child, key) => {
    return (
      <Fragment key={key}>
        {_transformElementWithNesting(child as Element, stripLinks)}
      </Fragment>
    )
  })

  return (
    <p className={className} {...otherAttribs}>
      {childrenElements}
      {hasSeparator && <span className="separator__dots"></span>}
    </p>
  )
}

const transformEntityEmbed: TransformFunction = (domNode) => {
  return <EntityEmbed attributes={domNode.attribs}></EntityEmbed>
}

const transformTable: TransformFunction = (domNode, stripLinks = false) => {
  const { class: className = undefined, ...otherAttribs } =
    domNode?.attribs || {
      class: '',
    }
  const thead =
    domNode?.children[0] instanceof Element &&
    domNode?.children[0]?.name == 'thead'
      ? (domNode?.children[0] as Element)
      : null

  const theadRow = thead?.children[0] as Element
  const headers = thead ? theadRow.children : null

  const columns = headers?.map((th: Element, key) => {
    return {
      key: key,
      title: textNodesOnly(serialize(th?.children)),
    }
  })

  const childrenElements = domNode?.children
    ? domNode.children.map((child: Element, key) => {
        if (!columns || child?.name != 'tbody') {
          return (
            <Fragment key={key}>
              {_transformElementWithNesting(child as Element, stripLinks)}
            </Fragment>
          )
        }

        const rows = child?.children
        return (
          <tbody key={key}>
            {rows?.map((row: Element, rowKey) => {
              const RowTag = row.name as React.ElementType
              return (
                <RowTag {...row.attribs} key={rowKey}>
                  {row.children.map((cell: Element, cellKey) => {
                    const CellTag = cell.name as React.ElementType
                    const cellContent =
                      (cell?.children &&
                        _transformElementWithNesting(
                          cell?.children as unknown as Element,
                        )) ||
                      ''
                    const isNotEmpty =
                      textNodesOnly(cellContent as string).trim().length > 0

                    return (
                      <CellTag {...cell.attribs} key={cellKey}>
                        {isNotEmpty && (
                          <>
                            <div className="responsive-cell__title">
                              {columns[cellKey]?.title}
                            </div>

                            {cellContent}
                          </>
                        )}
                      </CellTag>
                    )
                  }, [])}
                </RowTag>
              )
            })}
          </tbody>
        )
      })
    : null

  return (
    <div className="table-responsive">
      <table className={className} {...otherAttribs}>
        {childrenElements}
      </table>
    </div>
  )
}

const transformText = (domNode) => {
  const cleanHtml = parse(
    DOMPurify.sanitize(serialize(domNode), {
      ADD_TAGS: ['drupal-entity'],
      FORBID_ATTR: ['style'],
    }),
  )

  if (!cleanHtml || cleanHtml === '\u00A0') {
    return <span className="empty">{cleanHtml}</span>
  }

  return <Fragment>{cleanHtml}</Fragment>
}

// configuration
const transformConfig: Record<string, TransformFunction> = {
  a: transformLink,
  'drupal-entity': transformEntityEmbed,
  img: transformImage,
  p: transformP,
  table: transformTable,
  // transformations can be added here
}

const transformConfigByType: Record<string, TransformFunction> = {
  text: transformText,
}

export const parseAndTransformRichText = (
  html: string,
  stripLinks?: boolean,
): ReactElement | ReactElement[] | string => {
  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ['drupal-entity'],
    FORBID_ATTR: ['style'],
  })

  return parse(cleanHtml, {
    replace: (domNode) => {
      if (domNode instanceof Element && transformConfig[domNode.name]) {
        return transformConfig[domNode.name](domNode, stripLinks)
      } else {
        return transformConfigByType[domNode.type]?.(domNode, stripLinks)
      }
    },
  })
}
