import * as React from "react";
import { extendTheme, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import PersonIcon from "@mui/icons-material/Person";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Course from "../Course/Course";
import Details from "../../pages/Details";
import Form from "../../pages/Form";
import { getUserValue } from "../UserType";
import User from "../Users/User";
import UserEdits from "../UserEdits";

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
  },
  {
    segment: "users",
    title: "Users",
    path: "/users",
    icon: <PersonIcon />,
  },
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

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function Sidebar(props) {
  const userData = getUserValue();
  // console.log(userData);

  const { window } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("UseParams", id);
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [session, setSession] = React.useState(null);
  const [pathname, setPathname] = React.useState(
    localStorage.getItem("current")
  );

  function useDemoRouter() {
    const router = React.useMemo(() => {
      return {
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(String(path)),
      };
    }, [pathname]);

    return router;
  }

  const authentication = React.useMemo(() => {
    // signIn = () => {
    setSession({
      user: {
        name: userData.role,
        email: userData.email,
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

  localStorage.setItem("current", pathname);
  const demoRoute = localStorage.getItem("current");
  const router = useDemoRouter(demoRoute);

  const location = useLocation();
  // console.log("PathName", pathname);
  console.log(selectedCourse);

  const currentRoutes = () => {
    setPathname("/courses");
    router.navigate("/courses");
  };

  const renderContent = () => {
    const path = router.pathname;
    const url = location.pathname;

    if (path.startsWith("/courses/details")) {
      return (
        <>
          <div className="flex items-center space-x-1 ">
            <span>
              <strong
                className="cursor-pointer hover:underline"
                onClick={currentRoutes}
              >
                Courses
              </strong>
            </span>
            <span>/ Details</span>
          </div>
          <div className="mt-10">
            <Details course={selectedCourse} />
          </div>
        </>
      );
    }

    if (path.includes("/courses/addCourse")) {
      return (
        <>
          <div className="flex items-center space-x-1 w-">
            <span>
              <strong
                className="cursor-pointer hover:underline"
                onClick={currentRoutes}
              >
                Courses
              </strong>
            </span>
            <span>/ AddCourses</span>
          </div>
          <Form />
        </>
      );
    }
    if (path.includes("/users/edit")) {
      return (
        <>
          <div className="flex items-center space-x-1 w-">
            <span>
              <strong
                className="cursor-pointer hover:underline"
                onClick={currentRoutes}
              >
                Users
              </strong>
            </span>
            <span>/ Edit</span>
          </div>
          <UserEdits />
        </>
      );
    }

    switch (path) {
      case "/Home":
        return <h1>Welcome to the Home Page</h1>;
      case "/courses":
        return (
          <Course
            navigate={router.navigate}
            current={{ setPathname }}
            datas={{ selectedCourse, setSelectedCourse }}
          />
        );
      case "/users":
        return <User navigate={router.navigate} current={{ setPathname }} />;

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
