import Head from 'next/head';

const SITE_NAME = 'SSBA 久留米 - Shootingstar Baseball Academy';
const BASE_URL  = 'https://www.ssba1223.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/eye-catch-log.png`;

/**
 * 各ページの <Head> SEO タグをまとめるコンポーネント。
 * title / description / keywords / canonical / og / twitter / jsonLd を受け取る。
 */
export default function SeoHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | SSBA 久留米` : SITE_NAME;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords    && <meta name="keywords"    content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url"         content={url} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:locale"      content="ja_JP" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"       content={ogImage} />

      {/* JSON-LD 構造化データ */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
