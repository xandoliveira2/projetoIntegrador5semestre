import CustomTopTabs from "@/components/CustomTopTabs";
import Ativo from "./ativo";
import Finalizado from "./finalizado";

export default function FormularioLayout() {
  const tabs = [
    { name: "Ativo", component: Ativo },
    { name: "Finalizado", component: Finalizado },
  ];

  return <CustomTopTabs tabs={tabs} />;
}
