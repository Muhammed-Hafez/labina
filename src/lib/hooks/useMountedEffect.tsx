import { useEffect, useRef } from "react";

function useMountedEffect(effect: () => any, deps: any[]) {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return effect();

    mountedRef.current = true;
  }, deps);
}

export default useMountedEffect;
