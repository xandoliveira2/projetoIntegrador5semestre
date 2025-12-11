import CustomTopTabs from "@/components/CustomTopTabs";
import ParaResponder from "./paraResponder";
import Respondidos from "./respondidos";

import { FontSizeProvider } from "@/components/FontSizeProvider";

export default function UserLayout() {
  const tabs = [
    { name: "Para Responder", component: ParaResponder },
    { name: "Respondidos", component: Respondidos },
  ];

  return (
    <FontSizeProvider>
      <CustomTopTabs tabs={tabs} fontSize={21} />
    </FontSizeProvider>
  );
}
