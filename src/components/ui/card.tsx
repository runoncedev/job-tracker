type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-2 rounded-md border border-gray-300 bg-pink-300">
      {children}
    </div>
  );
}

export default Card;
