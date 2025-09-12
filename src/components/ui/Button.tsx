import { cn } from "@/lib/utils";

const variantClasses = {
  filled: "rounded-md bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300",
  outlined:
    "rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300",
  text: "rounded-md px-4 py-2 text-gray-600 hover:bg-gray-300",
} as const;

type ButtonProps = {
  variant?: keyof typeof variantClasses;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, variant = "filled", ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(variantClasses[variant], props.className)}>
      {children}
    </button>
  );
}

export default Button;
