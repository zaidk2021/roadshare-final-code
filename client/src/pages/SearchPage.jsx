import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import MapTilerDisplay from '@/components/MapTilerDisplay';
import RideCard from '@/components/RideCard';
import Search from '@/components/Search';
import Sidebar from '@/components/Sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { MoveRight, SlidersHorizontal } from 'lucide-react';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));
  const [from, setFrom] = useState(queryParams.from || '');
  const [to, setTo] = useState(queryParams.to || '');
  const date = queryParams.date;
  const seat = queryParams.seat;
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetching unique locations and rides based on query parameters
  useEffect(() => {
    const fetchRidesAndLocations = async () => {
      setLoading(true);
      try {
        // Fetch unique locations
        const locationRes = await axios.get("https://roadshare-final-code.onrender.com/api/rides/getUniqueLocations");
        const fromMatch = locationRes.data.find(item => item.toLowerCase().includes(queryParams.from.toLowerCase()));
        const toMatch = locationRes.data.find(item => item.toLowerCase().includes(queryParams.to.toLowerCase()));
        
        // Update from and to if matches are found
        if (fromMatch) setFrom(fromMatch);
        if (toMatch) setTo(toMatch);

        // Fetch rides based on the updated from and to values
        const ridesRes = await axios.get(`https://roadshare-final-code.onrender.com/api/rides/find?from=${encodeURIComponent(fromMatch || queryParams.from)}&to=${encodeURIComponent(toMatch || queryParams.to)}&seat=${encodeURIComponent(seat)}&date=${encodeURIComponent(date)}`);
        setRides(ridesRes.data.rides);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRidesAndLocations();
  }, [location.search]); // Re-run when search parameters change

  return (
    <main>
      <div id="map" style={{ width: '50%', margin: '0 auto' }}>
        <MapTilerDisplay from={from} to={to} />
      </div>
      <div id="text" style={{ fontSize: '12px' }}>
        Hard Reload after search (Ctrl+Shift+R) required due to free API being used
      </div>
      <div className="z-10 flex justify-center items-center border-b bg-background p-8">
        <Search />
        <Dialog>
          <DialogTrigger className="md:hidden border border-lg p-2 bg-background absolute right-0">
            <SlidersHorizontal />
          </DialogTrigger>
          <DialogContent>
            <Sidebar />
          </DialogContent>
        </Dialog>
      </div>
      <div className="container p-0 max-w-screen-xl grid md:grid-cols-5">
        <div className="hidden md:block">
          <Sidebar /> {/* Presumed intention as it wasn't specified where Sidebar should be */}
        </div>
        <div className="col-span-3 py-6 md:col-span-4 lg:border-l">
          <div className="container">
            {loading ? (
              <>
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
              </>
            ) : (
              <>
                <h3>
                  {from} <MoveRight className="inline-block" /> {to}
                </h3>
                <h3>{rides.length} rides available</h3>
                {rides.length === 0 ? (
                  <h3 className="text-xl font-semibold">No rides available based on your search criteria.</h3>
                ) : (
                  rides.map((ride) => (
                    <Link key={ride._id} to={`/ride/${ride._id}`}>
                      <RideCard details={ride} />
                    </Link>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
