import type { ClassValue } from '../../types';

export function mergeClasses(...classes: ClassValue[]) {
  const arr = classes.filter(Boolean) as NonNullable<ClassValue>[];

  const stringResult: string[] = [];
  const others: ClassValue[] = [];

  arr.forEach(cls => {
    if (typeof cls === 'string') {
      stringResult.push(cls);
    } else {
      others.push(cls);
    }
  });

  const repeatedClasses = new Set(stringResult.join(' ').split(/\s+/g).filter(Boolean));

  return [...repeatedClasses, ...others].join(' ');
}
