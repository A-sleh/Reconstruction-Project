import { useCallback, useEffect, useRef, useState } from "react";

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface UseGeoLocationResult {
  coords: GeoLocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  permissionState: PermissionState | "unsupported";
  getLocation: () => void;
}

const defaultCoords: GeoLocationCoordinates | null = null;

const defaultError: string | null = null;

const defaultPermissionState: PermissionState | "unsupported" = "unsupported";

export const useGeoLocation = (): UseGeoLocationResult => {
  const [coords, setCoords] = useState<GeoLocationCoordinates | null>(defaultCoords);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(defaultError);
  const [permissionState, setPermissionState] = useState<PermissionState | "unsupported">(
    defaultPermissionState
  );
  const isMountedRef = useRef(true);

  const updatePermissionState = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.permissions) {
      setPermissionState("unsupported");
      return;
    }

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      if (!isMountedRef.current) return;
      setPermissionState(status.state);
      status.onchange = () => {
        if (!isMountedRef.current) return;
        setPermissionState(status.state);
      };
    } catch {
      setPermissionState("unsupported");
    }
  }, []);

  const handleSuccess = useCallback(
    (position: GeolocationPosition) => {
      if (!isMountedRef.current) {
        return;
      }

      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      });
      setError(null);
      setIsLoading(false);
    },
    []
  );

  const handleError = useCallback((positionError: GeolocationPositionError) => {
    if (!isMountedRef.current) {
      return;
    }

    setError(positionError.message || "Unable to retrieve location.");
    setIsLoading(false);
  }, []);

  const getLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setPermissionState("unsupported");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  }, [handleError, handleSuccess]);

  useEffect(() => {
    isMountedRef.current = true;
    updatePermissionState();

    return () => {
      isMountedRef.current = false;
    };
  }, [updatePermissionState]);

  return {
    coords,
    isLoading,
    error,
    permissionState,
    getLocation,
  };
};

export default useGeoLocation;
