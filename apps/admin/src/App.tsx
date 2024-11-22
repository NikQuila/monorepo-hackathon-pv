import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// import RoutesConfig from './routes';
import useAuthState from './hooks/useAuthState';
import { Separator } from "@common/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@common/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@common/components/ui/breadcrumb';
import AuthPage from './pages/auth';
import { Button } from '@common/components/ui/button';

const App = () => {
  const { session, loading } = useAuthState();
  return loading ? null : !session ? (
    <AuthPage />
  ) : (
    <>
      <ToastContainer />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-col gap-12 items-start">
              dasasdsadasasasd
              <Button>Click me</Button>
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default App;
