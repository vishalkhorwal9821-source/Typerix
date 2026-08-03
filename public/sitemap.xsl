<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap — Typrix Platform</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background-color: #020617; color: #f8fafc; padding: 2rem; margin: 0; }
          h1 { color: #22d3ee; margin-bottom: 0.5rem; }
          p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
          table { width: 100%; max-width: 900px; border-collapse: collapse; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; }
          th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #1e293b; }
          th { background: #1e293b; color: #38bdf8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
          a { color: #22d3ee; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>TYPRIX — XML Sitemap</h1>
        <p>This is an XML Sitemap generated for Google Search Console &amp; search engines.</p>
        <table>
          <thead>
            <tr>
              <th>URL Location</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
