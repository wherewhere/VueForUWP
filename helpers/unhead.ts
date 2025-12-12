import { useScript } from "unhead";
import type { Unhead, UseScriptInput, UseScriptOptions } from "unhead/types";

export function useScriptAsync<T extends Record<symbol | string, any> = Record<symbol | string, any>>(head: Unhead<any>, _input: UseScriptInput, _options?: UseScriptOptions<T>) {
    const { onError, onLoaded } = useScript<T>(head, _input, _options);
    return new Promise<void>((resolve, reject) => {
        onLoaded(() => resolve());
        onError((err) => reject(err));
    });
}