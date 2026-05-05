import { BrowserRouter, StaticRouter } from "react-router-dom";
import App from "./App.tsx";

export default ({ pathname }: { pathname: string }) => (
    import.meta.env.SSR
        ? <StaticRouter location={pathname}><App/></StaticRouter>
        : <BrowserRouter><App/></BrowserRouter>
)
