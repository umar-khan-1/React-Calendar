import React, {Component} from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import uuid from 'uuid/v4';
import EventTitle from "./EventTitle";

import 'react-big-calendar/lib/less/styles.less';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less';

const DragAndDropCalendar = withDragAndDrop(BigCalendar);
const localize = BigCalendar.momentLocalizer(moment);


class Calendar extends Component {
    constructor(props) {
        this.state = {
            events: [],
            slotStep: 1
        };
    }

    

    checkAvailability = (newEvent) => {
        const oldEvents = this.state.events;
        const sameDayEvents = oldEvents.filter(event => moment(event.start).format("YYYY/MM/DD") === moment(newEvent.start).format("YYYY/MM/DD"));
        const timeComparison = sameDayEvents.filter(event => ((newEvent.end > event.start && newEvent.start < event.end) && event.oldEvent));

        timeComparison.length > 0 ? newEvent.slotAvailable = false : newEvent.slotAvailable = true;
        return newEvent;
    };

    handleCloseClick = (eventId) => {
        const {events} = this.state;
        const leftOvers = events.filter(existingEvent => {
            return existingEvent.id !== eventId
        });

        this.setState({
            events: leftOvers,
        });
    };

    Event = ({event}) => {
        return (
            <EventTitle
                slotAvailable={event.slotAvailable}
                title={event.title}
                oldEvent={event.oldEvent}
                eventId={event.id}
                onClick={this.handleCloseClick}
            />
        )
    };


    newEvent = (event) => {
        if (moment(event.start).isBefore(moment().toDate())) {
            alert(constants.Past_DAY_ERROR);
            return;
        }

        let newId = uuid();
        let hour = {
            id: newId,
            title: 'New Event',
            start: event.start,
            end: event.end,
            oldEvent: false,
        };
        const result = this.checkAvailability(hour);

        this.setState({
            events: this.state.events.concat([result]),
        });
    };

    moveEvent = ({event, start, end, isAllDay: droppedOnAllDaySlot}) => {
        const {events} = this.state;
        const idx = events.indexOf(event);
        let allDay = event.allDay;

        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false
        }

        const updatedEvent = {...event, start, end, allDay};
        const result = this.checkAvailability(updatedEvent);

        if (moment(result.start).isBefore(moment().toDate())) {
            alert(constants.Past_DAY_ERROR);
            return;
        }
        const nextEvents = [...events];

        nextEvents.splice(idx, 1, result);
        this.setState({
            events: nextEvents,
        });
    };

    resizeEvent = ({event, start, end}) => {
        const {events} = this.state;
        const nextEvents = events.map(existingEvent => {
            return existingEvent.id === event.id
                ? this.checkAvailability({...existingEvent, start, end})
                : existingEvent
        });

        this.setState({
            events: nextEvents,
        });
    };

    render() {
        return (
           
                    <DragAndDropCalendar
                        selectable
                        resizable
                        events={this.state.events}
                        step={parseInt(this.state.slotStep) * 15}
                        timeslots={4}
                        localizer={localize}
                        defaultView='week'
                        views={['week']}
                        defaultDate={moment().toDate()}
                        onEventDrop={this.moveEvent}
                        onEventResize={this.resizeEvent}
                        onSelectSlot={this.newEvent}
                        components={{
                            event: this.Event
                        }}
                    />
               
        );
    }
}


export default Calendar
