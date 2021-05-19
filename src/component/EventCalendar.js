import React, {Component} from 'react';
import '../App.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';


export default class EventCalendar extends Component{
     render(){
         return(
               <FullCalendar
               defaultView="dayGridMonth"  plugins={[ dayGridPlugin ]}
               events={
                   [
                       {title:'Going to the doctor', date:'29-08-04'},
                       {title:'Birthday',date:'28-04-06'}
                   ]
               }
               />
         )
     }
}

