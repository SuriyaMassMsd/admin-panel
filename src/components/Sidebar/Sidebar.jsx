import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { Account } from "@toolpad/core/Account";
import { Logout } from "@mui/icons-material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Course from "../Course/Course";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "Home",
    title: "Home",
    icon: <HomeIcon />,
    path: "/Home",
  },
  {
    segment: "courses",
    title: "Courses",
    path: "/courses",
    icon: <DashboardIcon />,
    //   children: [
    //     {
    //       segment: "chapter",
    //       title: "Chapter",
    //       path: "/courses/chapter",
    //     },
    //     {
    //       segment: "lesson",
    //       title: "Lessons",
    //       path: "/courses/lesson",
    //     },
    //     {
    //       segment: "quiz",
    //       title: "Quiz",
    //       path: "/courses/quiz",
    //     },
    //     {
    //       segment: "assignment",
    //       title: "Assignment",
    //       path: "/courses/assignment",
    //     },
    //   ],
  },
  // {
  //   segment: "orders",
  //   title: "Orders",
  //   icon: <PeopleAltIcon />,
  // children: [
  //   {
  //     segment: "find-by",
  //     title: "Find By",
  //     path: "/orders/find",
  //   },
  //   {
  //     segment: "create",
  //     title: "Create",
  //     path: "/orders/create",
  //   },
  //   {
  //     segment: "delete",
  //     title: "Delete",
  //     path: "/orders/delete",
  //   },
  // ],
  // },
  // {
  //   segment: "tickets",
  //   title: "Tickets",
  //   icon: <ConfirmationNumberIcon />,
  //   path: "/tickets",
  // },
  // {
  //   segment: "notify",
  //   title: "Notify",
  //   icon: <NotificationsActiveIcon />,
  //   path: "/notify",
  // },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function Sidebar(props) {
  const { window } = props;
  const navigate = useNavigate();

  const [session, setSession] = React.useState(null);

  const authentication = React.useMemo(() => {
    // signIn = () => {
    setSession({
      user: {
        name: "Admin",
        email: "gravitus.abishake@gmail.com",
        image: "https://mcmart.live/account/images/profile-icon.png",
      },
    });
    return {
      signOut: () => {
        setSession(null);
        navigate("/sign-in");
      },
    };
  }, []);

  const router = useDemoRouter("/Home");

  const renderContent = () => {
    const path = router.pathname;

    // if (path.startsWith("/courses")) {
    //   switch (true) {
    //     case path.includes("/courses"):
    //       return <h1>Courses</h1>;
    //     case path.includes("/chapter"):
    //       return <h1>Chapter Page</h1>;
    //     case path.includes("/lesson"):
    //       return <h1>Lessons Page</h1>;
    //     case path.includes("/quiz"):
    //       return <h1>Quiz Page</h1>;
    //     case path.includes("/assignment"):
    //       return <h1>Assignment Page</h1>;
    //     default:
    //       return <h1>All Courses</h1>;
    //   }
    // }

    // if (path.startsWith("/orders")) {
    //   switch (true) {
    //     case path.includes("/find"):
    //       return <h1>Find By</h1>;

    //     case path.includes("/create"):
    //       return <h1>Create</h1>;

    //     case path.includes("/delete"):
    //       return <h1>Delete</h1>;
    //   }
    // }
    switch (path) {
      case "/Home":
        return <h1>Welcome to the Home Page</h1>;
      case "/courses":
        return <Course />;
      case "/orders":
        return <h1>Manage Orders</h1>;
      case "/signin":
        return <h1>Please Sign In</h1>;
      case "/tickets":
        return <h1>Tickets</h1>;
      case "/notify":
        return <h1>Notify</h1>;
      default:
        return <h1>404 - Not Found</h1>;
    }
  };

  // Remove this const when copying and pasting into your project.
  const demoWindow = typeof window !== "undefined" ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      authentication={authentication}
      session={session}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: (
          <img
            className="w-[140px] h-[40px] rounded-full bg-cover"
            src="https://gravitus.io/static/media/gravituslogo.d101ec067ab314ba6c5f8c14bfc019c6.svg"
            alt="gravitus logo"
          />
        ),
        title: "",
      }}
    >
      <DashboardLayout>
        <PageContainer>{renderContent()}</PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
