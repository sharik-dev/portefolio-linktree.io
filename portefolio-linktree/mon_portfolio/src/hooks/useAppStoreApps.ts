import { useCallback, useEffect, useState } from 'react';
import { fetchAppStoreApps, snapshotApps, type PortfolioApp } from '../data/appstoreApps';

/**
 * Apps publiées sur l'App Store par le compte développeur.
 *
 * Rend d'abord le snapshot embarqué au build (affichage instantané, zéro flash),
 * puis remplace par la donnée fraîche d'Apple dès qu'elle arrive. Toute app
 * ajoutée sur l'App Store apparaît donc sans redéploiement.
 */
export function useAppStoreApps() {
  const [apps, setApps] = useState<PortfolioApp[]>(() => snapshotApps());
  const [refreshing, setRefreshing] = useState(true);

  const refresh = useCallback(async (force = false) => {
    setRefreshing(true);
    const fresh = await fetchAppStoreApps(force);
    if (fresh.length) setApps(fresh);
    setRefreshing(false);
    return fresh;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const fresh = await fetchAppStoreApps();
      if (!alive) return;
      if (fresh.length) setApps(fresh);
      setRefreshing(false);
    })();
    return () => { alive = false; };
  }, []);

  return { apps, refreshing, refresh };
}
