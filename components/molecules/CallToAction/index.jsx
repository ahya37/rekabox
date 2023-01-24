import Link from "next/link";

export default function CallToAction() {
  return (
    <section id="call-to-action">
      <div className="container">
        <div className="row">
          <div className="col-lg-9 text-center text-lg-left">
            <h3 className="cta-title">Aplikasi Manajemen Inventori</h3>
            <p className="cta-text">
              {/* Aplikasi manajement inventori yang mudah digunakan */}
            </p>
          </div>
          <div className="col-lg-3 cta-btn-container text-center">
            <Link href="/sign-in">
              <a className="cta-btn align-middle">Masuk / Daftar</a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
