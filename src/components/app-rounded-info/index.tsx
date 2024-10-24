import React from 'react';

interface AppRoundedInfoProps {
  text: string;
  onClick?: () => void;
  customClassName?: string;
}

const AppRoundedInfo: React.FC<AppRoundedInfoProps> = ({ text, onClick, customClassName }) => {
  return (
    <div
      className={`
        px-[10px]
        py-3
        w-full
        text-14px-bold
        text-white-neutral
        rounded-[256px] 
        bg-neutral-3 
        flex justify-center
        shadow-[inset_0px_-2px_0px_0px_rgba(191,195,184,0.15)] 
        backdrop-blur-[59.4px]
        ${customClassName || ''}
        `}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default AppRoundedInfo;
