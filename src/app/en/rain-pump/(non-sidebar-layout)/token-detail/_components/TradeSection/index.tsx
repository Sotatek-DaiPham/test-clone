import { Tabs, TabsProps } from "antd";
import TradeTab from "./TradeTab";
import "./styles.scss";
import { useTokenDetail } from "@/context/TokenDetailContext";
import TradeTabAfterListed from "./TradeTabAfterListed";

export enum TabKey {
  BUY = "buy",
  SELL = "sell",
}

const TradeSection = () => {
  const { tokenDetail } = useTokenDetail();
  const items: TabsProps["items"] = [
    {
      key: TabKey.BUY,
      label: "Buy",
      children: tokenDetail?.pairListDex ? (
        <TradeTabAfterListed tabKey={TabKey.BUY} />
      ) : (
        <TradeTab tabKey={TabKey.BUY} />
      ),
    },
    {
      key: TabKey.SELL,
      label: "Sell",
      children: tokenDetail?.pairListDex ? (
        <TradeTabAfterListed tabKey={TabKey.SELL} />
      ) : (
        <TradeTab tabKey={TabKey.SELL} />
      ),
    },
  ];

  return (
    <div className="trade-section">
      <Tabs defaultActiveKey="buy" items={items} />
    </div>
  );
};

export default TradeSection;
