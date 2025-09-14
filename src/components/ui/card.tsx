type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="flex w-full items-start justify-between gap-2 rounded-md border border-gray-300 bg-gray-100 sm:w-[260px] dark:border-slate-700 dark:bg-slate-950">
      {children}
    </div>
  );
}

export default Card;
