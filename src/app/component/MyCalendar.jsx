"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateTask } from './TaskContainer';
import { Modal, Paper } from '@mui/material';
import { updateTask } from '../redux/slice/taskSlice';
import { TaskCrudDrawerContext } from './AddTask';

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
  const [myEvents, setMyEvents] = useState([])
  const [draggedEvent, setDraggedEvent] = useState()
  const [displayDragItemInCell, setDisplayDragItemInCell] = useState(true)
  const [counters, setCounters] = useState({ item1: 0, item2: 0 })
  const tasks = useSelector(state => state.TASK.tasks)
  const { task: newTask, toggleDrawer, drawerState, setTask: setNewTask, addTaskWithPreTime } = useContext(TaskCrudDrawerContext);
  const [task, setTask] = useState({})
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      console.log(tasks)
      const updatedTasks = tasks.map((task) => {
        let start = new Date(task.startTime.seconds * 1000),
          end = new Date(task.endTime.seconds * 1000);
        return {
          ...task,
          start,
          end,
          isDraggable: true,
          allDay: start.getHours() === 0 && start.getMinutes() === 0 && end.getHours() === 0 && end.getMinutes() === 0,
        }
      })
      setMyEvents(updatedTasks)
      console.log(updatedTasks)
    })();
  }, [tasks])

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event.isDraggable
        ? { className: 'isDraggable' }
        : { className: 'nonDraggable' }),
    }),
    []
  )

  const handleDragStart = useCallback((event) => {
    setDraggedEvent(event)
    console.log(event)
  }, [])

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
        const updatedEvent = [...filtered, { ...existing, start, end, allDay }]
        console.log(updatedEvent)
        dispatch(updateTask({ id: event.id, task: { ...existing, id: event.id, startTime: start, endTime: end } }))
        return updatedEvent;
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

  const handleSelectEvent = useCallback(
    (event) => {
      console.log(event)
      setTask(event)
      handleEditModalOpen(event)
    },
    []
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
        const updatedEvent = [...filtered, { ...existing, start, end }]
        console.log(updatedEvent)
        dispatch(updateTask({ id: event.id, task: { ...existing, id: event.id, startTime: start, endTime: end } }))
        return updatedEvent
      })
    },
    [setMyEvents]
  )
  const handleSlotSelect = useCallback(async (event) => {
    console.log(event)
    await addTaskWithPreTime({ startTime: event.start, endTime: event.end })
    toggleDrawer(true)
    // setNewTask({ ...newTask, startTime: event.start, endTime: event.end })
  }, [])

  const defaultDate = useMemo(() => new Date(), [])

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModalOpen = () => setOpenEditModal(true);
  const handleEditModalClose = () => setOpenEditModal(false);
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
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSlotSelect}
          onDoubleClickEvent={newEvent}
          resizable
          selectable
          popup
          titleAccessor={(event) => event?.icon ? event.icon + " " + event.title : event.title + event.title}
        />
      </div>
      <Modal
        anchor={"bottom"}
        open={openEditModal}
        onClose={handleEditModalClose}
        // onOpen={handleEditModalOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: "700px",
            minWidth: "300px",
            marginInline: "auto",
          },
          "& .MuiDrawer-modal": {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          zIndex: (theme) => theme.zIndex.modal,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: "80vh",
            p: "1rem",
            marginInline: "auto",
            maxWidth: "700px",
          }}
        >
          <UpdateTask task={task} openEditModal={openEditModal} handleEditModalOpen={handleEditModalOpen} handleEditModalClose={handleEditModalClose} />
        </Paper>
      </Modal>
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


