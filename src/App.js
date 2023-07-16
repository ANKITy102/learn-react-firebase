import React, { useEffect, useState } from 'react'
import { Auth } from './components/auth'
import { auth, db, storage } from './config/firebase';
import { getDocs, collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

const App = () => {
  const moviesCollectionRef = collection(db, "movies");
  const userMoviesRef = collection(db,"userMovies");
  
  //New movie states
  const [movieList, setMovieList] = useState([]);
  const [userMovieList, setUserMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newRelease, setRelease] = useState(0);
  const [isOscar, setOscar] = useState(false);
  const [updateTitle, setUpTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const getMovieList = async () => {
    //Read the data
    // set the movie list
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setMovieList(filteredData);
    }
    catch (err) {
      console.log(err);
    }
  }
  const getUserMovie =async ()=>{
    const userId = auth?.currentUser?.uid;
    if(!userId){
      return alert("not login");
    }
   const movieslist = await userMoviesRef.doc(userId).get();
   setUserMovieList(movieslist.data());
  }


  const onMovieSubmit = async()=>{
    try {
      
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newRelease,
        receivedAnOscar: isOscar,
        userId: auth?.currentUser?.uid 
      })
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteMove = async (id)=>{
    const movieDoc = doc(db,"movies", id); 
    await deleteDoc(movieDoc)
    getMovieList();
  }

  const updateti = async(id)=>{
    const moviedoc = doc(db,"movies", id);
    await updateDoc(moviedoc,{title:updateTitle});;
    await getMovieList()
  }
  // const setUserMovies =async ()=>{
  //   try {
  //     const userId = auth?.currentUser?.uid;
  //     if(!userId){
  //       return alert("not login ");
  //     }
  //     await userMoviesRef.doc(userId).set({

  //       title: newMovieTitle,
  //       releaseDate: newRelease,
  //       isOcar: isOscar,
  //     }
  //     )
  //     getMovieList();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const uploadFile = async()=>{
    if(!fileUpload) return ; 
    try {
      
      const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

      const uploadimage= await uploadBytes(filesFolderRef, fileUpload);
      // console.log(uploadimage.metadata.fullPath);
      // let storageRef= ref(storage, `${uploadimage.metadata.fullPath}`);
      // console.log(await storageRef.getDownloadUrl());
      

    } catch (error) {
     console.log(error); 
    }
  }

  useEffect(() => {
    getMovieList();
    // getUserMovie()
   
  }, [])
  return (
    <div>
      <Auth />
      <input
        type="text"
        placeholder='movie title...'
        onChange={(e)=> setNewMovieTitle(e.target.value)}
        value={newMovieTitle}
      />
      <input
        type="number"
        placeholder='release date.. '
        onChange={(e)=> setRelease(e.target.value)}
        value={newRelease}
      />
      <input
        id="oscar"
        type="checkbox"
        onChange={(e)=> setOscar(e.target.checked)}
        
        checked={isOscar}
      />
      <label htmlFor="oscar">Received an Oscar</label>
      <button onClick={onMovieSubmit}>Submit Movie</button>
      {/* <button onClick={setUserMovies}>Set user movie</button> */}




      <div>
        {movieList.map((movie) => {
          return (
            <div>
              <h1>{movie.title}</h1>
              <p> Data: {movie.releaseDate} </p>
              <button onClick={()=> deleteMove(movie.id)}>Delete movie</button>
              <input type="text" onChange={(e)=> setUpTitle(e.target.value)} value={updateTitle} placeholder='update title' />
              <button onClick={()=>updateti(movie.id)}>Update title</button>
            </div>
          )
        })}
      </div>
      

      <div>
        <input type="file" onChange={(e)=> setFileUpload(e.target.files[0])}/>
        <button onClick={uploadFile}>Upload file</button>
        {/* <img src="" alt="image" width={"300px"} /> */}
      </div>
    </div>
  )
}

export default App
