import { useEffect, useState, useCallback } from "react";
import { Image } from "expo-image";

export function useDataSaverCache(
  items: string[],
  isDataSaverEnabled: boolean,
) {
  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [isReady, setIsReady] = useState(!isDataSaverEnabled);

  useEffect(() => {
    let isMounted = true;

    if (!isDataSaverEnabled) {
      setIsReady(true);
      return;
    }

    const checkAllCaches = async () => {
      const cached = new Set<string>();
      await Promise.all(
        items.map(async (item) => {
          try {
            const path = await Image.getCachePathAsync(item);
            if (path) cached.add(item);
          } catch {}
        }),
      );

      if (isMounted) {
        setUnlockedKeys((prev) => new Set([...prev, ...cached]));
        // await Image.prefetch([...cached], { cachePolicy: "memory-disk" });
        setIsReady(true);
      }
    };

    checkAllCaches();

    return () => {
      isMounted = false;
    };
  }, [items, isDataSaverEnabled]);

  const unlockKey = useCallback((cacheKey: string) => {
    setUnlockedKeys((prev) => {
      if (prev.has(cacheKey)) return prev;
      const next = new Set(prev);
      next.add(cacheKey);
      return next;
    });
  }, []);

  return { unlockedKeys, unlockKey, isReady };
}
