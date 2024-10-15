import AppTabs from "@/components/app-tabs";

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
      children: <h1 className="text-white">Holder Distribution</h1>,
    },
    {
      label: "Holder Distribution",
      key: ETokenDetalTabs.TRANSACTION,
      children: <h1 className="text-white">Holder Distribution</h1>,
    },
  ];
  return (
    <div className="mt-[26px]">
      <AppTabs items={tabs} />
    </div>
  );
};

export default TabsSection;
