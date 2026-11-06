import { useQuery } from "@tanstack/react-query";
import { getWeatherByCity } from "./api";
import DailyForecast from "./components/cards/DailyForecast";
import HourlyForecast from "./components/cards/HourlyForecast";
import "./index.css";
import CurrentWeather from "./components/cards/CurrentWeather";
import AdditionalInfo from "./components/cards/AdditionalInfo";
import Map from "./components/map";
import type { Coords } from "./types";
import { Suspense, useState } from "react";
import LocationDropdown from "./components/dropdowns/LocationDropdown";
import MapTypeDropdown from "./components/dropdowns/MapTypeDropdown";
import MapLegend from "./components/MapLegend";
import CurrentSkeleton from "./components/skeletons/CurrentSkeleton";
import HourlySkeleton from "./components/skeletons/HourlySkeleton";
import AdditionalInfoSkeleton from "./components/skeletons/AdditionalInfoSkeleton";
import DailySkeleton from "./components/skeletons/DailySkeleton";
import SidePannel from "./components/sidePannel";
import Hamburger from "/src/assets/hamburger.svg?react";
import MobileHeader from "./components/MobileHeader";
import LightDarkToggle from "./components/LightDarkToggle";

function App() {
  const [coordinates, setCoords] = useState<Coords>({ lat: 50, lon: 45 });
  const [city, setCity] = useState<string>("");
  const [mapType, setMapType] = useState<string>("clouds_new");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const onMapClick = (lat: number, lon: number) => {
    setCoords({ lat, lon });
    setCity("custom");
  };
  const { data } = useQuery({
    queryKey: ["cities", city],
    queryFn: () => getWeatherByCity(city),
    enabled: city.trim().length >= 2 && city !== "custom",
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
  const coords: Coords =
    city !== "custom" && data ? { lat: data.lat, lon: data.lon } : coordinates;

  return (
    <>
      <MobileHeader setIsSidePanelOpen={setIsSidePanelOpen} />
      <div className="flex flex-col gap-8 pt-4 p-8 xs:pt-8 lg:w-[calc(100dvw-var(--sidebar-width))] 2xl:h-screen 2xl:min-h-280">
        <div className="flex flex-col gap-4 xs:flex-row xs:gap-8">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <h1 className="text-2xl font-semibold">Location: </h1>
            <LocationDropdown city="city" setCity={setCity} />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <h1 className="text-2xl font-semibold whitespace-nowrap">
              Map Type:{" "}
            </h1>
            <MapTypeDropdown mapType={mapType} setMapType={setMapType} />
          </div>
          <div className="ml-auto flex gap-4 items-center">
            <div className="hidden xs:block">
              <LightDarkToggle />
            </div>
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="hidden xs:block"
            >
              <Hamburger className="size-6 lg:hidden" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 2xl:flex-1 2xl:min-h-0 md:grid-cols-2 2xl:grid-cols-4 2xl:grid-rows-4 gap-4">
          <div className="relative h-120 2xl:h-auto col-span-1 md:col-span-2 2xl:col-span-4 2xl:row-span-2 order-1">
            <Map coords={coords} onMapClick={onMapClick} mapType={mapType} />
            <MapLegend mapType={mapType} />
          </div>
          <div className="col-span-1 2xl:row-span-2 order-2">
            <Suspense fallback={<CurrentSkeleton />}>
              <CurrentWeather coords={coords} />
            </Suspense>
          </div>
          <div className="col-span-1 order-3 2xl:order-4 2xl:row-span-2">
            <Suspense fallback={<DailySkeleton />}>
              <DailyForecast coords={coords} />
            </Suspense>
          </div>
          <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-4 2xl:order-3">
            <Suspense fallback={<HourlySkeleton />}>
              <HourlyForecast coords={coords} />
            </Suspense>
          </div>
          <div className="col-span-1 md:col-span-2 2xl:row-span-1 order-5">
            <Suspense fallback={<AdditionalInfoSkeleton />}>
              <AdditionalInfo coords={coords} />
            </Suspense>
          </div>
        </div>
      </div>
      <SidePannel
        coords={coords}
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
      />
    </>
  );
}

export default App;
