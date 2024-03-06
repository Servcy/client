import Document, { Head, Html, Main, NextScript } from "next/document";

import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  TWITTER_USER_NAME,
} from "@constants/seo-variables";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    const isSessionRecorderEnabled = process.env["NODE_ENV"] === "production";

    return (
      <Html>
        <Head>
          <meta property="og:site_name" content={SITE_NAME} />
          <meta property="og:title" content={SITE_TITLE} />
          <meta property="og:url" content={SITE_URL} />
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta property="og:description" content={SITE_DESCRIPTION} />
          <meta name="keywords" content={SITE_KEYWORDS} />
          <meta name="twitter:site" content={`@${TWITTER_USER_NAME}`} />
          <meta name="theme-color" content="#fff" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest.json" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          {isSessionRecorderEnabled && (
            <Script id="clarity-tracking">
              {`<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "lca3vb6j6d");</script>`}
            </Script>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
          <script defer data-domain="servcy.com" src="https://plausible.io/js/script.js" />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
