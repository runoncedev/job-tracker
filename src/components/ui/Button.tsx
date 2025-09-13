import { cn } from "@/lib/utils";

const variantClasses = {
  filled:
    "rounded-md bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
  outlined:
    "rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700",
  text: "rounded-md px-4 py-2 text-gray-600 hover:bg-gray-300 dark:text-white dark:hover:bg-slate-700",
  icon: "m-2 rounded-sm p-1.5 text-gray-400 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-700",
} as const;

type ButtonProps = {
  variant?: keyof typeof variantClasses;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, variant = "filled", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        variantClasses[variant],
        props.className,
        "transition active:scale-[98%]",
      )}
    >
      {children}
    </button>
  );
}

export default Button;
