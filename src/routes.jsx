import { createBrowserRouter } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import { Single } from "./pages/Single";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <h1>Not found!</h1>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "single/:theId",
                element: <Single />
            }
        ]
    }
]);

export default router;
