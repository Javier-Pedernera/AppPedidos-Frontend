import { Outlet, Route } from "react-router-dom"
import { Fragment, LazyExoticComponent, Suspense, lazy } from "react";
import '../scss/components/router.scss';

interface RouteProps {
    path?: string;
    element?: LazyExoticComponent<() => JSX.Element> | null;
    layout?: LazyExoticComponent<(props: { children: React.ReactNode }) => JSX.Element> | null;
    children?: RouteProps[];
    name?: string;
    authorization?: LazyExoticComponent<
        (props: { children: React.ReactNode }) => JSX.Element
    > | null;
}


export const renderRoutes = (routes: RouteProps[]) => {
    return routes.map((route, index) => {
        const Component = route.element || Fragment;
        const Layout = route.layout || Fragment;
        const AuthGuard = route.authorization || Fragment;
        return (
            <Route
                key={index}
                path={route.path}
                element={
                    <Suspense fallback=
                        {
                        <div className="divLoader">
                            <div className="loader"></div>
                            {/* <img className="loader" src={loader}></img> */}
                            </div>
                        }
                    >
                        <AuthGuard>
                            <Layout >
                                {route.children ? <Outlet /> : <Component />}</Layout>
                        </AuthGuard>
                    </Suspense>
                }
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        );
    });
};


export const routes: RouteProps[] = [
    {
        path: "/",
        element: lazy(async () => await import("../Pages/Landing/LandingPage")),
        name: "Landing"
    },
    {
        path: "/login",
        element: lazy(async () => await import("../Pages/Login/LoginPage")),
        name: "Login"
    },
    {
        path: "/register",
        element: lazy(async () => await import("../Pages/Register/Register")),
        name: "Register"
    },

    //layout va a tener navbar, footer y dentro los hijos (rutas protejidas)
    {
        layout: lazy(async () => await import("../Layout/layout")),
        children: [
            {
                path: "/faq",
                element: lazy(async () => await import("../Pages/FAQ/FAQPage")),
                name: "Faq"
            },
            // {
            //     path: "/faq",
            //     element: lazy(async () => await import("../pages/FAQ/Faq")),
            //     name: "Faq"
            // },
            {
                authorization: lazy(async () => await import("../utils/Auth")),
                children: [

                    {
                        path: "/dashboard",
                        element: lazy(async () => await import("../Pages/Dashboard/Dashboard")),
                        name: "Dashboard",
                    },
                    {
                        path: "/userProfile",
                        element: lazy(async () => await import("../Pages/UserProfile/UserProfile")),
                        name: "UserProfile"
                    },
                    {
                        path: "/config_maps",
                        element: lazy(async () => await import("../Pages/MapasConfig/Mapasconfig")),
                        name: "UserProfile"
                    },
                    {
                        path: "/editMap",
                        element: lazy(async () => await import("../Components/EditMap/EditMap")),
                        name: "UserProfile"
                    },
                    {
                        path: "/params",
                        element: lazy(async () => await import("../Pages/Params/Params")),
                        name: "Params"
                    },
                    {
                        path: "/cadetes",
                        element: lazy(async () => await import("../Pages/Cadetes/Cadetes")),
                        name: "UserProfile"
                    },
                    
                ]
            },

        ]
    },

];
