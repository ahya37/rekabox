import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }
  render() {
    return (
      <Html>
        <Head>
          <link href="/css/bootstrap.min.css" rel="stylesheet" />
          <link href="/css/typography.css" rel="stylesheet" />
          <link href="/css/style.css" rel="stylesheet" />
          <link href="/css/signin.css" rel="stylesheet" />
          <link href="/css/responsive.css" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
            rel="stylesheet"
          />

          <link href="/landingpage/css/style.css" rel="stylesheet" />
          <title>Rekabox</title>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/jquery.min.js"></script>
          <script src="/js/popper.min.js"></script>
          <script src="/js/bootstrap.min.js"></script>
          <script src="/js/jquery.appear.js"></script>
          <script src="/js/countdown.min.js"></script>
          <script src="/js/waypoints.min.js"></script>
          <script src="/js/jquery.counterup.min.js"></script>
          <script src="/js/wow.min.js"></script>
          <script src="/js/apexcharts.js"></script>
          <script src="/js/slick.min.js"></script>
          <script src="/js/select2.min.js"></script>
          <script src="/js/owl.carousel.min.js"></script>
          <script src="/js/jquery.magnific-popup.min.js"></script>
          <script src="/js/smooth-scrollbar.js"></script>
          <script src="/js/lottie.js"></script>
          <script src="/js/core.js"></script>
          <script src="/js/charts.js"></script>
          <script src="/js/animated.js"></script>
          <script src="/js/kelly.js"></script>
          <script src="/js/flatpickr.js"></script>
          <script src="/js/chart-custom.js"></script>
          <script src="/js/custom.js"></script>
          <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"></script>

          {/* select2 */}
          <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
          <script src="/js/select2.init.js"></script>

          {/* app */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
