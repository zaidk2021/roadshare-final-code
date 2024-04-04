import RideCard from "@/components/RideCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { Textarea } from "@/components/ui/textarea"
import { AuthContext } from "@/context/AuthContext"
import useFetch from "@/hooks/useFetch"
import axios from "axios"
import { Pencil, Star, Trash } from "lucide-react"
import { Fragment, useContext, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
const apiUri = import.meta.env.VITE_REACT_API_URI

const Profile = () => {
  const {user} = useContext(AuthContext)

  const [rideDeleteMode, setRideDeleteMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const {loading, data, refetch} = useFetch(`users/${user.user._id}`, true)
  

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      bio: "",
    },
  })
  const updateRatingInBackend = async (userId, newRating) => {
    // This URL should point to your backend endpoint for updating ratings
    const url = `http://localhost:8080/api/users/rate/${userId}`;
    try {
      await axios.post(url, { rating: newRating }, { withCredentials: true });
      console.log("Rating updated successfully");
      // After a successful update, you might want to refetch user data to reflect the change
      refetch();
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };
  
  const handleRatingClick = async () => {
    const newRating = prompt("Enter your new rating (1-5):");
    const ratingNumber = parseInt(newRating, 10);
  
    if (!newRating || isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }
  
    try {
      // Assuming the user ID is accessible via `user.user._id` or similar
      await updateRatingInBackend(user.user._id, ratingNumber);
      toast("Rating updated successfully.");
      // Ideally, refetch user data here to reflect the updated rating
      refetch();
    } catch (error) {
      console.error("Failed to update rating:", error);
      toast("Failed to update rating.");
    }
  };
  
  
  
  
  
  const onSubmit = async (newData) => {
    try {
      await axios.patch(`${apiUri}/users/${user.user._id}`, {
        name: newData.name,
        profile: {...data.profile, bio: newData.bio}
      }, {withCredentials:true});
      refetch();
      reset()
      setEditMode(false)
    } catch (error) {
      console.error('Patch error:', error);
    }
  }
  const saveButtonStyle = {
    width: '350px', // Adjust the width as needed
  };
  async function handleDelete(id){
    try {
      await axios.delete(`${apiUri}/rides/${id}`, {withCredentials:true});
      refetch();
      toast("The ride has been Deleted")
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  if(!user) return <Navigate to="/" replace />;
  const buttonStyle = {
    width: '150px', // Set your desired width here
  };

  return (
    <main className="pb-12 md:py-14 px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex flex-col sm:flex-row h-full w-full">
        <div className="w-full sm:w-96 flex p-0 py-6 md:p-6 xl:p-8 flex-col">
          <div className="relative flex w-full space-x-4 my-8">
            {loading?
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              :
              <>
              <Avatar>
                <AvatarImage src={data?.profilePicture} />
                <AvatarFallback className="select-none text-primary text-xl font-bold">{data?.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex justify-center items-start flex-col space-y-2">
  <p className="text-base font-semibold leading-4 text-left">{data?.name}</p>
  <div className="flex items-center text-sm gap-1 text-muted-foreground"  onClick={handleRatingClick}>
    <Star fill="yellow" size={20} className="text-transparent" /> {data?.stars}stars
  </div>
</div>

              </>
            }
          </div>
          {
            !editMode ?
            <>
               <Button style={buttonStyle} variant='outline' onClick={() => setEditMode(true)} >Edit Profile</Button>
              <div className="flex justify-center items-start flex-col space-y-4 mt-8">
                <h3 className="text-base font-semibold leading-4 text-center md:text-left">About</h3>
                <p className="text-sm text-muted-foreground">Bio: {data?.profile.bio}</p>
                <p className="text-sm text-muted-foreground">{data?.age && `${data?.age} y/o`}</p>
                <p className="text-sm text-muted-foreground">{data?.ridesCreated.length} Rides published</p>
                <p className="text-sm text-muted-foreground">Member since {data?.createdAt.substring(0,4)}</p>
              </div>
              <div className="flex justify-center items-start flex-col space-y-4 mt-8">
                <h3 className="text-base font-semibold leading-4 text-center md:text-left">Preferences</h3>
                <p className="text-sm text-muted-foreground">{data?.profile.preferences?.music}</p>
                <p className="text-sm text-muted-foreground">{data?.profile.preferences?.smoking}</p>
                <p className="text-sm text-muted-foreground">{data?.profile.preferences?.petFriendly}</p>
              </div>
            </>
            :
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input required autoComplete="name" placeholder="Full name" id="name" {...field} />}
              />
              <Label htmlFor="bio">Bio</Label>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => <Textarea placeholder="Bio" id="bio" {...field} />}
              />

<Button style={saveButtonStyle} type="submit">Save</Button>
              <Button variant='outline' onClick={(e) => {e.preventDefault(); reset(); setEditMode(false)}}>Cancel</Button>
            </form>
          }
        </div>
      
        <div className="flex flex-col justify-start items-start gap-2 w-full sm:w-2/3">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Published Rides</h1>
            <Pencil className={`cursor-pointer p-1 rounded-lg ${rideDeleteMode && 'bg-primary text-primary-foreground'} `} size={25} onClick={() => setRideDeleteMode(!rideDeleteMode)} />
          </div>
          <ScrollArea className="h-[275px] w-full rounded-md border p-4">
            {data?.ridesCreated.map(ride => 
              <Fragment key={ride._id} >
              <RideCard details={ride} />
              { rideDeleteMode && <Trash className="text-destructive cursor-pointer" onClick={()=> handleDelete(ride._id)} />}
              </Fragment>
            )}
          </ScrollArea>

          <div className="flex mt-5 justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Recently joined rides</h1>
          </div>
          <ScrollArea className="h-[275px] w-full rounded-md border p-4">
            {data?.ridesJoined.length === 0
              ? <h3>No rides</h3>
              :
              data?.ridesJoined.map(ride => 
              <RideCard key={ride._id} details={ride} />
            )}
          </ScrollArea>
        </div>
        
      </div>
      <Toaster />
    </main>
  )
}

export default Profile