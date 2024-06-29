import { Result } from './Result';

export function ExceptionHandler() {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign, func-names
    descriptor.value = function (...args: unknown[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        return Result.Error({ code: 'UNKNOWN' });
      }
    };

    return descriptor;
  };
}
