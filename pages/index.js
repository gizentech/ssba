import Head from 'next/head';
import HeroSection from '@/components/home/HeroSection';
import ProSupportSection from '@/components/home/ProSupportSection';
import OfficialMedia from '@/components/home/OfficialMedia';
import ColumnSection from '@/components/home/ColumnSection';
import ContentsSection from '@/components/home/ContentsSection';
import CourseOverview from '@/components/home/CourseOverview';

export default function Home() {
  return (
    <>
      <Head>
        <title>SSBA - Shootingstar Baseball Academy</title>
      </Head>
      {/* p1: topview */}
      {/* p2: プロが認める指導力で次のステージへ */}
      <HeroSection />
      {/* p3: プロ野球選手サポート実績 */}
      <ProSupportSection />
      {/* p4: オフィシャルメディア */}
      <OfficialMedia />
      {/* p5: コラム */}
      <ColumnSection />
      {/* p6: コンテンツ */}
      <ContentsSection />
      {/* p7: footer (Layout内) */}
    </>
  );
}
