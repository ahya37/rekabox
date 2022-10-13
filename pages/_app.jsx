import Router from "next/router";
import NProgress from "nprogress";
import { Fragment, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { wrapper } from "../redux/store";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done();
    setLoading(false);
  });

  return (
      <Fragment>
        <Component {...pageProps} />
        <ToastContainer />
      </Fragment>
  );
}

export default wrapper.withRedux(MyApp);
