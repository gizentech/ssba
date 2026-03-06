import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, isHome }) {
  return (
    <>
      <Header isHome={isHome} />
      <main className={isHome ? undefined : 'secondary-page'}>{children}</main>
      <Footer />
    </>
  );
}
