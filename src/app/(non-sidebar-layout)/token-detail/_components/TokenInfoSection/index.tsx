import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import { envs } from "@/constant/envs";
import { DATE_FORMAT } from "@/constant/format";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import { shortenAddress } from "@/helpers/shorten";
import { ITokenDetailRes } from "@/interfaces/token";
import {
  ArrowExport,
  DiscordLinkIcon,
  TeleLinkIcon,
  TwitterLinkIcon,
  WebsiteLinkIcon,
} from "@public/assets";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

interface ITokenInfoSectionProps {
  tokenDetail: ITokenDetailRes;
}

const TokenInfoSection = ({ tokenDetail }: ITokenInfoSectionProps) => {
  const SocialLink = [
    { label: "Website", image: WebsiteLinkIcon, link: tokenDetail?.website },
    { label: "Twitter", image: TwitterLinkIcon, link: tokenDetail?.twitter },
    { label: "Telegram", image: TeleLinkIcon, link: tokenDetail?.telegram },
    { label: "Discord", image: DiscordLinkIcon, link: tokenDetail?.discord },
  ];
  return (
    <>
      <div className="px-14 md:py-6 py-6 bg-neutral-2 rounded-[16px] shadow-[0px_40px_32px_-24px_rgba(15,15,15,0.12)] mt-6 flex flex-col items-center">
        <div className="md:max-w-[400px] flex flex-col items-center">
          <AppImage
            className="h-auto max-w-[278px] object-cover"
            src={tokenDetail?.avatar}
            alt="token image"
          />
          <div className="text-22px-bold text-white-neutral mt-6">
            {tokenDetail?.name}
          </div>
          <div className="text-12px-normal text-neutral-7 mt-3">
            {tokenDetail?.description}
          </div>

          <div className="w-full">
            <div className="text-14px-medium text-error-3 mt-[30px] mb-[10px]">
              Links
            </div>
            <div className="flex flex-wrap gap-3">
              {SocialLink.map((item) =>
                item?.link ? (
                  <AppButton
                    key={item.label}
                    classChildren="text-14px-bold text-neutral-9"
                    typeButton="secondary"
                    customClass="!w-[135px]"
                    onClick={() =>
                      window.open(
                        item?.link as string,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <div className="flex gap-2">
                      <Image src={item.image} alt={item.label} />
                      <span>{item.label}</span>
                    </div>
                  </AppButton>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">Created on</div>
          <div className="text-16px-medium text-white-neutral">
            {getTimeDDMMMYYYYHHMM(tokenDetail?.kingOfTheHillDate)}
          </div>
        </div>
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">Creator</div>
          <Link
            href={"#"}
            className="py-[2px] px-3 rounded-[16px] bg-[rgba(15,190,90,0.20)] text-[#0FBE5A] text-16px-normal"
          >
            {tokenDetail?.username}
          </Link>
        </div>
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">
            Contract address
          </div>

          <Link
            href={`${envs.SCAN_URL}/address/${tokenDetail?.contractAddress}`}
            target="_blank"
            className="text-16px-medium text-white-neutral flex gap-1"
          >
            <div>
              {shortenAddress(tokenDetail?.contractAddress || "") || "-"}
            </div>
            <Image src={ArrowExport} alt="arrow-export" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TokenInfoSection;
