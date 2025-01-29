
export const layout = ( children: string ) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
    <link href="/static/clusterize.min.css" rel="stylesheet" />
    <script src="/static/clusterize.min.js"></script>
    <link rel="stylesheet" href="/static/index.css"  />
    <script type="module" src="/static/index.js"></script>
  </head>
  <body>
    <div id="root" style="display:contents">
      ${children}
    </div>
  </body>
</html>`
}