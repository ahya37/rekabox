import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <>
      <section id="intro">
        <div className="intro-text">
          <h2>Manage your inventory</h2>
          <Link href="/sign-up">
            <a className="btn-get-started scrollto">Mulai</a>
          </Link>
          <Link href="/sign-in">
            <a className="btn-get-started scrollto">Login</a>
          </Link>
        </div>

        <div className="product-screens">
          <div
            className="product-screen-1 wow fadeInUp"
            data-wow-delay="0.4s"
            data-wow-duration="0.6s"
          >
            <Image
              src="/landingpage/img/product-screen-1.png"
              width={300}
              height={500}
            />
          </div>

          <div
            className="product-screen-2 wow fadeInUp"
            data-wow-delay="0.2s"
            data-wow-duration="0.6s"
          >
            <Image
              src="/landingpage/img/product-screen-2.png"
              width={300}
              height={500}
            />
          </div>

          <div
            className="product-screen-3 wow fadeInUp"
            data-wow-duration="0.6s"
          >
            <Image
              src="/landingpage/img/product-screen-3.png"
              width={300}
              height={500}
            />
          </div>
        </div>
      </section>
      <section id="about" className="section-bg">
        <div className="container-fluid">
          <div className="section-header">
            <h3 className="section-title">About Us</h3>
            <span className="section-divider"></span>
            <p className="section-description">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque
              <br />
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
          </div>

          <div className="row">
            <div className="col-lg-6 about-img wow fadeInLeft">
              <Image
                src="/landingpage/img/about-img.jpg"
                width={500}
                height={500}
              />
            </div>

            <div className="col-lg-6 content wow fadeInRight">
              <h2>
                Lorem ipsum dolor sit amet, consectetur adipiscing elite storium
                paralate
              </h2>
              <h3>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <ul>
                <li>
                  <i className="ion-android-checkmark-circle"></i> Ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </li>
                <li>
                  <i className="ion-android-checkmark-circle"></i> Duis aute
                  irure dolor in reprehenderit in voluptate velit.
                </li>
                <li>
                  <i className="ion-android-checkmark-circle"></i> Ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate trideta
                  storacalaperda mastiro dolore eu fugiat nulla pariatur.
                </li>
              </ul>

              <p>
                Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum Libero justo laoreet sit amet cursus
                sit amet dictum sit. Commodo sed egestas egestas fringilla
                phasellus faucibus scelerisque eleifend donec
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
