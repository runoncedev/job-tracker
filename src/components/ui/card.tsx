type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="flex w-full items-start justify-between gap-2 rounded-md border border-gray-300 sm:w-[240px] dark:border-slate-700">
      {children}
    </div>
  );
}

export default Card;
