"use client";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';

const DragAndDropCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    id: 1,
    title: 'Today',
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 2,
    title: 'Meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
  {
    id: 3,
    title: 'Conference',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
  },
  {
    id: 4,
    title: 'Party',
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    end: new Date(new Date().setDate(new Date().getDate() + 4)),
  }
]
const adjEvents = myEventsList.map((it, ind) => ({
  ...it,
  isDraggable: ind % 2 === 0,
}))

const formatName = (name, count) => `${name} ID ${count}`

export default function CalendarMain() {
  const [myEvents, setMyEvents] = useState(adjEvents)
  const [draggedEvent, setDraggedEvent] = useState()
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)
  const [counters, setCounters] = useState({ item1: 0, item2: 0 })
  useEffect(() => {
    console.log("hey: ", myEvents)
    return () => {
    }
  }, [])

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isDraggable
        ? { className: 'isDraggable' }
        : { className: 'nonDraggable' }),
    }),
    []
  )
  const handleDragStart = useCallback((event) => setDraggedEvent(event), [])

  const dragFromOutsideItem = useCallback(() => draggedEvent === 'undroppable' ? null : draggedEvent, [draggedEvent])

  const customOnDragOverFromOutside = useCallback(
    (dragEvent) => {
      // check for undroppable is specific to this example
      // and not part of API. This just demonstrates that
      // onDragOver can optionally be passed to conditionally
      // allow draggable items to be dropped on cal, based on
      // whether event.preventDefault is called
      if (draggedEvent !== 'undroppable') {
        console.log('preventDefault')
        dragEvent.preventDefault()
      }
    },
    [draggedEvent]
  )

  const handleDisplayDragItemInCell = useCallback(
    () => setDisplayDragItemInCell((prev) => !prev),
    []
  )

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay }]
      })
    },
    [setMyEvents]
  )

  const newEvent = useCallback(
    async (event) => {
      const title = await prompt("Event Name : ");
      if (!title) return;
      setMyEvents((prev) => {
        const idList = prev.map((item) => item.id)
        const newId = Math.max(...idList) + 1
        console.log([...prev, { ...event, id: newId, title }])
        return [...prev, { ...event, id: newId, title }]
      })
    },
    [setMyEvents]
  )

  const onDropFromOutside = useCallback(
    ({ start, end, allDay: isAllDay }) => {
      if (draggedEvent === 'undroppable') {
        setDraggedEvent(null)
        return
      }

      const { name } = draggedEvent
      const event = {
        title: formatName(name, counters[name]),
        start,
        end,
        isAllDay,
      }
      setDraggedEvent(null)
      setCounters((prev) => {
        const { [name]: count } = prev
        return {
          ...prev,
          [name]: count + 1,
        }
      })
      newEvent(event)
    },
    [draggedEvent, counters, setDraggedEvent, setCounters, newEvent]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  const defaultDate = useMemo(() => new Date(2015, 3, 12), [])

  return (
    <>
      <div className="h-full">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.MONTH}
          dragFromOutsideItem={
            displayDragItemInCell ? dragFromOutsideItem : null
          }
          draggableAccessor="isDraggable"
          eventPropGetter={eventPropGetter}
          events={myEvents}
          localizer={localizer}
          onDropFromOutside={onDropFromOutside}
          onDragOverFromOutside={customOnDragOverFromOutside}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={newEvent}
          onDoubleClickEvent={newEvent}
          resizable
          selectable
        />
      </div>
    </>
  )
}

function Card({ children, className, style }) {
  return (
    <div className={`${className || ''} card`} style={style}>
      {children}
    </div>
  )
}
CalendarMain.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}



const placeHolderEventList = "";


