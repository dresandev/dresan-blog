import { notFound } from 'next/navigation'
import { extractHeadings } from 'extract-md-headings'
import getPosts, { getPost } from '@helpers/getPosts'
import { getHeadings } from '@helpers/getHeadings'
import { PostBody } from '@mdx/PostBody'
import { TableOfContents } from '@components/TableOfContents'
import styles from './page.module.css'

interface BlogProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogProps) {
  const post = await getPost(params.slug)

  return {
    title: post?.title
  }
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => (
    {
      params: {
        slug: post?.slug
      }
    } as BlogProps))
}

export default async function Blog({ params }: BlogProps) {
  const post = await getPost(params.slug)

  if (!post) return notFound()
  const headings = extractHeadings(`./src/posts/${params.slug}.mdx`)

  const headings2 = getHeadings(post.body)

  return (
    <>
      <div className={styles.titleWrapper}>
        <div className='container'>
          <div className={styles.spacer}></div>
          <h1 className={styles.title}>{post.title}</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <article className={styles.content}>
          <PostBody>
            {post.body}
          </PostBody>
        </article>
        <aside className={styles.tableOfContents}>
          <TableOfContents headings={headings} />
        </aside>
      </div>
    </>
  )
}
