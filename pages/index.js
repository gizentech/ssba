import fs from 'fs';
import path from 'path';
import SeoHead from '@/components/common/SeoHead';
import HeroSection from '@/components/home/HeroSection';
import ImportantNewsBanner from '@/components/home/ImportantNewsBanner';
import ProSupportSection from '@/components/home/ProSupportSection';
import OfficialMedia from '@/components/home/OfficialMedia';
import ColumnSection from '@/components/home/ColumnSection';
import ContentsSection from '@/components/home/ContentsSection';
import CourseOverview from '@/components/home/CourseOverview';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: 'SSBA - Shootingstar Baseball Academy',
  alternateName: 'シューティングスター ベースボール アカデミー',
  url: 'https://www.ssba1223.com',
  telephone: '090-1362-7517',
  email: 'ssba1223dn@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '安武町安武本2930-6',
    addressLocality: '久留米市',
    addressRegion: '福岡県',
    postalCode: '830-0072',
    addressCountry: 'JP',
  },
  description: '福岡県久留米市の野球塾。牧原大成選手などプロ野球選手の自主トレにも対応。小学生から社会人まで個人・グループレッスン提供中。',
  sport: '野球',
};

export async function getStaticProps() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'contents.json'), 'utf-8');
  const { contents } = JSON.parse(raw);
  return { props: { contents } };
}

export default function Home({ contents }) {
  return (
    <>
      <SeoHead
        title="プロ野球選手の自主トレ拠点・野球塾【福岡県久留米市】"
        description="福岡県久留米市の野球塾SSBA（シューティングスターベースボールアカデミー）。流大輔代表のもと、牧原大成・本多雄一・川崎宗則などプロ野球選手の自主トレにも対応。屋内練習場完備。久留米フューチャースターズとも連携。小学生から社会人まで個人・グループレッスン提供中。"
        keywords="SSBA,野球塾,久留米,福岡,野球アカデミー,プロ野球選手,自主トレ,牧原大成,本多雄一,川崎宗則,流大輔,個人レッスン,少年野球,野球教室,シューティングスター,久留米フューチャースターズ,Bar Greenlight,BarGreenlight,屋内練習場,室内練習場,久留米 野球"
        canonical="/"
        jsonLd={JSON_LD}
      />
      {/* p1: topview */}
      {/* p2: プロが認める指導力で次のステージへ */}
      <HeroSection />
      {/* 重要お知らせバナー（白背景の直上） */}
      <ImportantNewsBanner />
      {/* p3: プロ野球選手サポート実績 */}
      <ProSupportSection />
      {/* p4: オフィシャルメディア */}
      <OfficialMedia />
      {/* p5: コラム */}
      <ColumnSection />
      {/* p6: コンテンツ */}
      <ContentsSection images={contents} />
      {/* p7: footer (Layout内) */}
    </>
  );
}
