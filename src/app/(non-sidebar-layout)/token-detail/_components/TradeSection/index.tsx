import { Tabs, TabsProps } from "antd";
import TradeTab from "./TradeTab";
import "./styles.scss";

export enum TabKey {
  BUY = "buy",
  SELL = "sell",
}

const TradeSection = () => {
  const items: TabsProps["items"] = [
    {
      key: TabKey.BUY,
      label: "Buy",
      children: <TradeTab tabKey={TabKey.BUY} />,
    },
    {
      key: TabKey.SELL,
      label: "Sell",
      children: <TradeTab tabKey={TabKey.SELL} />,
    },
  ];

  return (
    <div className="trade-section">
      <Tabs defaultActiveKey="buy" items={items} />
    </div>
  );
};

export default TradeSection;
