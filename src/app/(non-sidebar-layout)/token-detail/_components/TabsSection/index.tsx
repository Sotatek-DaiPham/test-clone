import AppTabs from "@/components/app-tabs";
import TradeHistory from "./TradeHistory";
import HolderDistribute from "./HolderDistribute";

enum ETokenDetalTabs {
  DICUSSION = "DICUSSION",
  HOLDER = "HOLDER",
  TRANSACTION = "TRANSACTION",
}
const TabsSection = () => {
  const tabs = [
    {
      label: "My profile",
      key: ETokenDetalTabs.DICUSSION,
      children: <h1 className="text-white">Discussion Thread</h1>,
    },
    {
      label: "Holder Distribution",
      key: ETokenDetalTabs.HOLDER,
      children: <HolderDistribute />,
    },
    {
      label: "Transaction",
      key: ETokenDetalTabs.TRANSACTION,
      children: <TradeHistory />,
    },
  ];
  return (
    <div className="mt-[26px]">
      <AppTabs items={tabs} destroyInactiveTabPane={true} />
    </div>
  );
};

export default TabsSection;
