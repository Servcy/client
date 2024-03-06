import { ReactElement } from "react";

import DefaultLayout from "@layouts/default-layout";

import { SignInView } from "@components/page-views";
// type
import { NextPageWithLayout } from "@/types/types";

const HomePage: NextPageWithLayout = () => <SignInView />;

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default HomePage;
