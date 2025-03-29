import Link from "next/link";

interface ButtonNavWrapperProps {
  href: string;
  title: string;
}

export const ButtonNavWrapper = ({ href, title }: ButtonNavWrapperProps) => {
  return (
    <Link
      href={href}
      className="flex flex-1 items-center justify-center bg-slate-200 p-3 rounded-md hover:bg-slate-300 transition-all"
    >
      {title}
    </Link>
  );
};
