import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetterOfEachWord = (sentence: string) => {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return "";
  }

  const words = sentence.split(" ");

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
};

export const compareStringArrays = (arr1: Array<string>, arr2: Array<string>) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

export const arraySwap = <T>(array: Array<T>, from: number, to: number): Array<T> => {
  const copy = [...array];

  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length) {
    return copy;
  }

  const temp = copy[from];
  copy[from] = copy[to];
  copy[to] = temp;

  return copy;
};

export const arrayMove = <T>(array: T[], from: number, to: number) => {
  const copy = [...array];

  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length) {
    return array;
  }

  const [movedElement] = copy.splice(from, 1);

  copy.splice(to, 0, movedElement);

  return copy;
};
