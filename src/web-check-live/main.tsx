import { BrowserRouter } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.tsx";

export default ({ pathname }: { pathname: string }) => (
    import.meta.env.SSR
        ? <StaticRouter location={pathname}><App/></StaticRouter>
        : <BrowserRouter><App/></BrowserRouter>
)
