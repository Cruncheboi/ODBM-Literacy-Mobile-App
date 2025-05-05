import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to resolve tailwind className collisions
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export default cn;
