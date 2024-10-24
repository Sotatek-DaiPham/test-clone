import AppPagination from "@/components/app-pagination";
import AppTable from "@/components/app-table";
import ShowingPage from "@/components/showing-page";
import { API_PATH } from "@/constant/api-path";
import { envs } from "@/constant/envs";
import { useTokenDetail } from "@/context/TokenDetailContext";
import { nFormatter } from "@/helpers/formatNumber";
import { cleanParamObject, shortenAddress } from "@/helpers/shorten";
import { IMetaData } from "@/interfaces";
import { IGetHolderRes, IGetTradeHistoryParams } from "@/interfaces/token";
import { getAPI } from "@/service";
import { ArrowExport } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { ColumnType } from "antd/es/table";
import { get } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const HolderDistribute = () => {
  const { tokenDetail } = useTokenDetail();
  const [searchParams, setSearchParams] = useState<{
    page: number;
  }>({
    page: 1,
  });
  const { data, refetch, isFetching } = useQuery({
    queryFn: () => {
      return getAPI(API_PATH.TOKEN.HOLDER_DISTRIBUTE, {
        params: cleanParamObject({
          tokenAddress: tokenDetail?.contractAddress,
          page: searchParams.page,
          limit: 100,
        } as IGetTradeHistoryParams),
      });
    },
    select(data) {
      return data;
    },
    queryKey: [API_PATH.TOKEN.HOLDER_DISTRIBUTE],
    enabled: !!tokenDetail?.contractAddress,
  });

  const metadata = get(data, "data.metadata") as IMetaData;

  const listData = get(data, "data.data", []) as IGetHolderRes[];

  const columns: ColumnType<any>[] = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render(value, record, index) {
        return index + 1;
      },
    },
    {
      title: "Address",
      dataIndex: "user_address",
      key: "user_address",
      render(value, record, index) {
        return shortenAddress(value);
      },
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percent",
      key: "percent",
      render(value, record, index) {
        return <div>{nFormatter(value)}</div>;
      },
    },
    {
      title: "VALUE {$}",
      dataIndex: "amount",
      key: "amount",
      render(value, record, index) {
        return <div>{nFormatter(value)}</div>;
      },
    },
    {
      title: "VIEW ON BLOCK EXPLORER",
      dataIndex: "user_address",
      key: "user_address",
      render(value, record, index) {
        return (
          <Link
            href={`${envs.SCAN_URL}/address/${value}`}
            target="_blank"
            className="text-16px-medium text-white-neutral flex gap-1"
          >
            <Image src={ArrowExport} alt="arrow-export" />
          </Link>
        );
      },
    },
  ];

  return (
    <div>
      <AppTable
        scroll={{ x: 900 }}
        columns={columns}
        dataSource={listData}
        loading={isFetching}
        pagination={false}
      />
      <AppPagination
        className="w-full !justify-end !mr-6"
        hideOnSinglePage={true}
        showTotal={(total, range) => (
          <ShowingPage total={total} range={range} />
        )}
        current={searchParams?.page}
        pageSize={100}
        total={metadata?.total}
        onChange={(page, size) => {
          setSearchParams((prev: any) => ({ ...prev, page }));
        }}
      />
    </div>
  );
};

export default HolderDistribute;
