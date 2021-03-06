import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="sticky flex flex-wrap px-3 mt-4 text-sm leading-7 lg:px-0 top-20">
      <span className="pr-3 font-bold text-gray-500 dark:text-gray-300">
        © Lenster
      </span>
      <span className="pr-3">
        <Link href="/about" passHref>
          About
        </Link>
      </span>
      <span className="pr-3">
        <Link href="/terms" passHref>
          Terms
        </Link>
      </span>
      <span className="pr-3">
        <Link href="/privacy" passHref>
          Privacy
        </Link>
      </span>
      <a
        className="pr-3"
        href="https://gitlab.com/lenster/lenster"
        target="_blank"
        rel="noreferrer"
      >
        Status
      </a>
      <span className="pr-3">
        <Link href="/thanks" passHref>
          Thanks
        </Link>
      </span>
      <a
        className="pr-3"
        href="https://gitlab.com/lenster/lenster"
        target="_blank"
        rel="noreferrer"
      >
        GitLab
      </a>
      <a
        className="pr-3 hover:font-bold"
        href="https://vercel.com/?utm_source=Lenster&utm_campaign=oss"
        target="_blank"
        rel="noreferrer"
      >
        ▲ Powered by Vercel
      </a>
    </footer>
  )
}

export default Footer
