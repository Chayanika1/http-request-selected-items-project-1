export async function fetchAvailablePlaces(){
    const response =  await  fetch('http://localhost:3000/places');
     const resData = await response.json();
     if(!response.ok){
      throw new Error ('failed to fetch')
    }
    return resData.places;

}
export async function fetchUserPlaces(){
    const response =  await  fetch('http://localhost:3000/user-places');
     const resData = await response.json();
     if(!response.ok){
      throw new Error ('failed to fetch user places')
    }
    return resData.places;

}

//updating user places
export async function updatingUserPlaces(places){
  const response = await fetch('http://localhost:3000/user-places',{
    method:'PUT',
    body:JSON.stringify({places:places}),
    headers:{
      'content-type':'application/json'
    }
  })
  const resData = await response.json();
  if(!response.ok){
    throw new Error('failed to update user data')
  }
  return resData.message;//here we use message . because in backend code we use message property for update


}