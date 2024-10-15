import AppButton from "@/components/app-button";
import {
  ArrowExport,
  DiscordLinkIcon,
  Memeicon,
  TeleLinkIcon,
  TwitterLinkIcon,
  WebsiteLinkIcon,
} from "@public/assets";
import Image from "next/image";
import Link from "next/link";

const SocialLink = [
  { label: "Website", image: WebsiteLinkIcon },
  { label: "Twitter", image: TwitterLinkIcon },
  { label: "Telegram", image: TeleLinkIcon },
  { label: "Discord", image: DiscordLinkIcon },
];

const TokenInfoSection = () => {
  return (
    <>
      <div className="px-14 md:py-6 py-6 bg-neutral-2 rounded-[16px] shadow-[0px_40px_32px_-24px_rgba(15,15,15,0.12)] mt-6 flex flex-col items-center">
        <div className="md:max-w-[400px] flex flex-col items-center">
          <Image
            className="h-auto max-w-[278px] object-cover"
            src={Memeicon}
            alt="token image"
          />
          <div className="text-22px-bold text-white-neutral mt-6">
            Doraemon (DREM)
          </div>
          <div className="text-12px-normal text-neutral-7 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore ... Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore ...
          </div>

          <div className="w-full">
            <div className="text-14px-medium text-error-3 mt-[30px] mb-[10px]">
              Links
            </div>
            <div className="flex flex-wrap gap-3">
              {SocialLink.map((link) => (
                <AppButton
                  key={link.label}
                  classChildren="text-14px-bold text-neutral-9"
                  typeButton="secondary"
                  customClass="!w-[135px]"
                >
                  <div className="flex gap-2">
                    <Image src={link.image} alt={link.label} />
                    <span>{link.label}</span>
                  </div>
                </AppButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">Created on</div>
          <div className="text-16px-medium text-white-neutral">7/10/2024</div>
        </div>
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">Creator</div>
          <Link
            href={"#"}
            className="py-[2px] px-3 rounded-[16px] bg-[rgba(15,190,90,0.20)] text-[#0FBE5A] text-16px-normal"
          >
            ABC XYZ
          </Link>
        </div>
        <div className="primary-box flex justify-between">
          <div className="text-16px-normal text-neutral-7">
            Contract address
          </div>
          <Link
            href="#"
            className="text-16px-medium text-white-neutral flex gap-1"
          >
            <div>0x0000...0000</div>
            <Image src={ArrowExport} alt="arrow-export" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TokenInfoSection;
