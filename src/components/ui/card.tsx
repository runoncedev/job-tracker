import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full items-start justify-between gap-2 rounded-md border border-gray-300 bg-gray-100 dark:border-slate-700 dark:bg-slate-950",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
