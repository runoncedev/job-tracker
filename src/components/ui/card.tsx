type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="border border-gray-300 rounded-md flex justify-between items-start gap-2 min-w-0 bg-pink-300">
      {children}
    </div>
  );
}

export default Card;
