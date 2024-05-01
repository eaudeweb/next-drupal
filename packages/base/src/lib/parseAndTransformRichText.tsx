import { Fragment, ReactElement } from 'react'

import serialize from 'dom-serializer'
import parse, { Element } from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image'

import { DrupalLink, EntityEmbed, createBaseUrl } from '@edw/base'

type TransformFunction = (
  domNode: Element,
  stripLinks?: boolean,
) => ReactElement | undefined

const transformElementWithNesting = (domNode: Element, stripLinks = false) => {
  if (!domNode) return null

  if (domNode instanceof Element && transformConfig[domNode.name]) {
    return parseAndTransformRichText(serialize(domNode), stripLinks)
  }

  if (domNode.children && domNode.children.length > 0) {
    const childrenElems = domNode.children.map((child, key) => {
      return (
        <Fragment key={key}>
          {transformElementWithNesting(child as Element, stripLinks)}
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
        {transformElementWithNesting(child as Element, stripLinks)}
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
      ? createBaseUrl(domNode.attribs.src)
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
        {transformElementWithNesting(child as Element, stripLinks)}
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

  const childrenElements = domNode.children
    ? domNode.children.map((child, key) => {
        return (
          <Fragment key={key}>
            {transformElementWithNesting(child as Element, stripLinks)}
          </Fragment>
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

// configuration
const transformConfig: Record<string, TransformFunction> = {
  a: transformLink,
  'drupal-entity': transformEntityEmbed,
  img: transformImage,
  p: transformP,
  table: transformTable,
  // transformations can be added here
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
      }
    },
  })
}
