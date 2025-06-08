import Image from "next/image";

const Avatar = ({ src, firstLetter }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={firstLetter}
        className="rounded-full"
        height={48}
        width={48}
      />
    );
  }

  return (
    <div className="dark:text-muted-text dark:bg-bg-color w-[48px] h-[48px] rounded-full flex items-center justify-center text-black bg-white border border-black">
      <h1 className="text-2xl">{firstLetter}</h1>
    </div>
  );
};

export default Avatar;
