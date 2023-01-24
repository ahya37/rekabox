export default function MoreFeature() {
  return (
    <section id="more-features" className="section-bg">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">Fitur</h3>
          <span className="section-divider"></span>
          <p className="section-description">
            Dengan fitur yang dihadirkan dalam aplikasi
          </p>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="box wow fadeInLeft">
              <div className="icon">
                <i className="ion-ios-stopwatch-outline"></i>
              </div>
              <h4 className="title">
                <a href="">Mengelola Item</a>
              </h4>
              <p className="description">
                Mengelola item dengan mudah berdasarkan lokasi maupun dalam satu cabang.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="box wow fadeInRight">
              <div className="icon">
                <i className="ion-ios-bookmarks-outline"></i>
              </div>
              <h4 className="title">
                <a href="">Mengelola Stok Masuk & Keluar</a>
              </h4>
              <p className="description">
                Mengelola stok masuk dan keluar item, dan bisa melakukan audit stok sebenarnya didalam inventori.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="box wow fadeInLeft">
              <div className="icon">
                <i className="ion-ios-location-outline"></i>
              </div>
              <h4 className="title">
                <a href="">Mengelola Item Berbasis Lokasi & Dasar</a>
              </h4>
              <p className="description">
                Mengelola item berdasarkan banyak lokasi maupun satu lokasi saja.
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="box wow fadeInRight">
              <div className="icon">
                <i className="ion-ios-analytics-outline"></i>
              </div>
              <h4 className="title">
                <a href="">Mengelola Item Penjualan & Pembelian</a>
              </h4>
              <p className="description">
                Mengelola penjualan dan pembelian stok item dalam inventori.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
