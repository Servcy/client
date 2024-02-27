export interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;

  setOpenOnSmallScreens: (isOpen: boolean) => void;
  setIsPageWithSidebar: (isPageWithSidebar: boolean) => void;
}
