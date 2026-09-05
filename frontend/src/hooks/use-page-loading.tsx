// Instantaneous page loading - avoids artificial delay/skeleton flashes on navigation
export function usePageLoading(_delay: number = 0) {
  return false;
}