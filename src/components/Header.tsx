import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <div id="title">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Image
          src="/assets/images/lmgnc-cartouche-logo-200x14_med_hr.jpeg"
          alt="LMGNC logo"
          width={200}
          height={14}
          priority
          style={{ display: 'inline-block', margin: '0 auto' }}
        />
        <h1>
          <span aria-hidden="true">⚛ </span>
          Leuren Moret: Global Nuclear Coverup
          <span aria-hidden="true"> ⚛</span>
        </h1>
      </Link>
      <p>
        Assembled works of Leuren Moret, BS, MS, PhD ABD &mdash; geoscientist &amp; nuclear whistleblower
      </p>
    </div>
  )
}
