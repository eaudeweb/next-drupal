import Head from 'next/head'

interface Meta {
  content?: string
  name?: string
  property?: string
}

interface Link {
  href: string
  rel: string
  sizes?: string
  type?: string
}

interface Helmet {
  children?: React.ReactNode
  description?: string
  links?: Link[]
  meta?: Meta[]
  title?: string
}

const Helmet: React.FC<Helmet> = ({
  children,
  description = 'Default description',
  links = [],
  meta = [],
  title = 'Default site title',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* meta tags */}
      {meta.map((m, index) => (
        <meta key={index} {...m} />
      ))}

      {/* link tags*/}
      {links.map((link, index) => (
        <link key={index} {...link} />
      ))}

      {/* children */}
      {children}
    </Head>
  )
}

export default Helmet
