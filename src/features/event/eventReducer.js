import { createReducer } from "../../app/common/util/reducerUtils";
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, FETCH_EVENT } from "./eventConstants";

const initState = [];
//   {
//     id: "1",
//     title: "Trip to Empire State building",
//     eventDate: "2018-03-21",
//     category: "culture",
//     desc:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.",
//     city: "NY, USA",
//     venue: "Empire State Building, 5th Avenue, New York, NY, USA",
//     venueLatLng: {
//       lat: 40.7484405,
//       lng: -73.98566440000002
//     },
//     hoste: "Bob",
//     hostPhotoURL: "https://randomuser.me/api/portraits/men/20.jpg",
//     attendees: [
//       {
//         id: "a",
//         name: "Bob",
//         photoURL: "https://randomuser.me/api/portraits/men/20.jpg"
//       },
//       {
//         id: "b",
//         name: "Tom",
//         photoURL: "https://randomuser.me/api/portraits/men/22.jpg"
//       }
//     ]
//   },
//   {
//     id: "2",
//     title: "Trip to Punch and Judy Pub",
//     eventDate: "2018-03-18",
//     category: "drinks",
//     desc:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.",
//     city: "London, UK",
//     venue: "Punch & Judy, Henrietta Street, London, UK",
//     venueLatLng: {
//       lat: 51.5118074,
//       lng: -0.12300089999996544
//     },
//     host: "Tom",
//     hostPhotoURL: "https://randomuser.me/api/portraits/men/22.jpg",
//     attendees: [
//       {
//         id: "a",
//         name: "Bob",
//         photoURL: "https://randomuser.me/api/portraits/men/20.jpg"
//       },
//       {
//         id: "b",
//         name: "Tom",
//         photoURL: "https://randomuser.me/api/portraits/men/22.jpg"
//       }
//     ]
//   }
// ];

const createEvent = (state, payload) => {
  //state coming from store
  return [...state, payload.event];
};

const updateEvent = (state, payload) => {
  console.log("pay", payload);
  return [...state.filter(e => e.id !== payload.evt.id), payload.evt]; //filtering all existing event and sending updated event
};

const deleteEvent = (state, payload) => {
  return [...state.filter(e => e.id !== payload.eventId)];
};

const fetchEvent = (state, payload) => {
  return payload.events; //new state will update store with new events
};

export default createReducer(initState, {
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [DELETE_EVENT]: deleteEvent,
  [FETCH_EVENT]: fetchEvent
});
