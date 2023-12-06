import Header from "../components/Header";

interface Props extends React.PropsWithChildren {
  title: string;
}

const RootLayout: React.FC<Props> = ({ children, title }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/index.css" />
        <title>{title}</title>
        <script
          src="https://unpkg.com/htmx.org@1.9.8"
          integrity="sha384-rgjA7mptc2ETQqXoYC3/zJvkU7K/aP44Y+z7xQuJiVnB/422P/Ak+F/AqFR7E4Wr"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
