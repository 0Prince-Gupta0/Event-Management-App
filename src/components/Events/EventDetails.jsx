import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../utils/https.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const params=useParams();
  const navigate=useNavigate();
 const {data,isPending,isError,error}= useQuery({
    queryKey:['events',params.id],
    queryFn:({signal})=>fetchEvent({signal, id:params.id })
  });

const {mutate}=useMutation({
  mutationFn:deleteEvent,
  onSuccess:()=>{
    queryClient.invalidateQueries({queryKey:['events'],refetchType:'none'})
    navigate('/events')
  }
})
  
const deleteHandler=(event)=>{
  mutate({id:params.id});
}
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      
      {isPending && <p>Loading...</p>}
 {isError && (
        <ErrorBlock
          title="Failed to load"
          message="Please try again later."
        />
      )}
      {data && <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={deleteHandler}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`https://backend-tuim.onrender.com/${data.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}{"  "}{data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>}
      
    </>
  );
}
