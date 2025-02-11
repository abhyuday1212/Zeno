import Image from "next/image";

const Avatar = ({ src, firstLetter }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt={firstLetter}
        className="rounded-full"
        height={40}
        width={40}
      />
    );
  }

  return (
    <div className="text-muted-text bg-bg-color w-[40px] h-[40px] rounded-full flex items-center justify-center">
      <h1 className="text-2xl">{firstLetter}</h1>
    </div>
  );
};

export default Avatar;
