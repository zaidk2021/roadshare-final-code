import RideCard from '@/components/RideCard';
import Search from '@/components/Search';
import Sidebar from '@/components/Sidebar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useFetch from '@/hooks/useFetch';
import { MoveRight, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import MapTilerDisplay from '@/components/MapTilerDisplay';
const SearchPage = () => {
  const { search } = useLocation();
  const queryParams = Object.fromEntries(new URLSearchParams(search));
  const [from, setFrom] = useState(queryParams.from || '');
  const [to, setTo] = useState(queryParams.to || '');
  const date = queryParams.date;
  const seat=queryParams.seat;

  useEffect(() => {
    const getUniqueLocations = async () => {
      try {
        const { data } = await axios.get("https://roadshare-final-code.onrender.com/api/rides/getUniqueLocations");
        
        const fromMatch = data.find(item => item.includes(from));
        const toMatch = data.find(item => item.includes(to));
        
        if (fromMatch) setFrom(fromMatch);
        if (toMatch) setTo(toMatch);
      } catch (error) {
        console.error("Error fetching unique locations:", error);
      }
    };

    getUniqueLocations();
  }, [from, to]);

  // Assuming useFetch dynamically fetches data based on provided URL parameters
  const { loading, data } = useFetch(`rides/find?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&seat=${encodeURIComponent(seat)}&date=${encodeURIComponent(date)}`);



  return (
    <main>
      <div id="map" style={{ width: '50%', margin: '0 auto' }}>
        <MapTilerDisplay from={from} to={to} />
      </div>
      <div id="text" style={{ fontSize: '12px' }}>
        Hard Reload after search(Cntrl+Shift+R)required due to free api being used
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
          <div className="sticky top-16"></div>
        </div>
        <div className="col-span-3 py-6 md:col-span-4 lg:border-l">
          <div className="container">
            {loading && (
              <>
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
                <Skeleton className="h-[200px] w-full my-3 p-4 rounded-xl" />
              </>
            )}
            {data && (
              <>
                <h3>
                  {from} <MoveRight className="inline-block" /> {to}
                </h3>
                <h3>{data?.rides.length} rides available</h3>
                {data.rides.length === 0 ? (
                  <h3 className="text-xl font-semibold">
                    No rides available based on your search criteria.
                  </h3>
                ) : (
                  data.rides.map((ride) => (
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
