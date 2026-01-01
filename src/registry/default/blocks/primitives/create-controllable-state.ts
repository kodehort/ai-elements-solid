import { type Accessor, createSignal, type Setter } from "solid-js";

export interface CreateControllableStateParams<T> {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}

/**
 * Manages state that can be either controlled or uncontrolled.
 * Solid.js port of @radix-ui/react-use-controllable-state
 */
export function createControllableState<T>(
  params: CreateControllableStateParams<T>
): [Accessor<T | undefined>, Setter<T | undefined>] {
  const { prop, defaultProp, onChange } = params;

  const [uncontrolledValue, setUncontrolledValue] = createSignal<T | undefined>(
    defaultProp
  );

  const isControlled = () => prop !== undefined;
  const value = () => (isControlled() ? prop : uncontrolledValue());

  const setValue: Setter<T | undefined> = ((
    nextValue: T | undefined | ((prev: T | undefined) => T | undefined)
  ) => {
    const newValue =
      typeof nextValue === "function"
        ? (nextValue as (prev: T | undefined) => T | undefined)(value())
        : nextValue;

    if (!isControlled()) {
      setUncontrolledValue(() => newValue);
    }

    onChange?.(newValue as T);
    return newValue;
  }) as Setter<T | undefined>;

  return [value, setValue];
}
