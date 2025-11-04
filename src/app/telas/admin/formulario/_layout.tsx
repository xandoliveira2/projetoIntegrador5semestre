import CustomTopTabs from "@/components/CustomTopTabs";
import Ativo from "./ativo";
import Finalizado from "./finalizado";
import Criar from "./criar";

export default function FormularioLayout() {
  const tabs = [
    { name: "Ativo", component: Ativo },
    { name: "Finalizado", component: Finalizado },
    { name: "Criar", component: Criar },
  ];

  return <CustomTopTabs tabs={tabs} />;
}
