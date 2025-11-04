import CustomTopTabs from "@/components/CustomTopTabs";
import Respondidos from "./respondidos";
import ParaResponder from "./paraResponder";

export default function UserLayout() {
  const tabs = [   
    { name: "Para Responder", component: ParaResponder },
    { name: "Respondidos", component: Respondidos },
 
  ];

  return <CustomTopTabs tabs={tabs} />;
}
