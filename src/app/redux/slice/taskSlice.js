import { addTask, deleteTask, getTaskList, updateTaskDoc } from "@/config/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    taskLoading: "idle", // For Collection process
    taskCRUD: "idle", // For Create, Update, Delete process single task
};

export const fetchTasks = createAsyncThunk(
    "tasks/FetchTasks",
    async (payload, { rejectWithValue }) => {
        try {
            const resTask = await getTaskList();
            return resTask;
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

export const deleteTasks = createAsyncThunk(
    "tasks/DeleteTasks",
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload);
            await deleteTask(payload);
            const resTask = await getTaskList();
            return resTask;
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

export const updateTask = createAsyncThunk(
    "tasks/UpdateTasks",
    async (payload, { rejectWithValue }) => {
        try {
            console.log("adadasdsa", payload);
            await updateTaskDoc(payload.id, payload.task);
            const resTask = await getTaskList();
            return resTask;
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

export const addTasks = createAsyncThunk(
    "tasks/AddTasks",
    async (payload, { rejectWithValue }) => {
        try {
            await addTask(payload);
            const resTask = await getTaskList();
            return resTask;
        } catch (error) {
            console.log(error);
            return rejectWithValue(new Error(res.message));
        }
    }
);

const taskSlice = createSlice({
    name: "TASK",
    initialState,
    reducers: {
        pushTasks: (state, action) => {
            state.tasks = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.taskLoading = "loading";
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.taskLoading = "loaded";
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.taskLoading = "failed";
            })
            .addCase(deleteTasks.pending, (state) => {
                state.taskCRUD = "processing";
            })
            .addCase(deleteTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.taskCRUD = "success";
            })
            .addCase(deleteTasks.rejected, (state, action) => {
                state.taskCRUD = "failed";
            })
            .addCase(addTasks.pending, (state) => {
                state.taskCRUD = "processing";
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.taskCRUD = "success";
            })
            .addCase(addTasks.rejected, (state, action) => {
                state.taskCRUD = "failed";
            })
            .addCase(updateTask.pending, (state) => {
                state.taskCRUD = "processing";
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.taskCRUD = "success";
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.taskCRUD = "failed";
            })
    },
});

export const { pushTasks } = taskSlice.actions;
export default taskSlice.reducer;


// let initstate = {
//     tasks: [],
//     task: {},
//     loading: false,
//     error: null,
//     message: "",
//     success: false,
//     taskCount: 0,
//     taskPage: 1,
//     taskLimit: 10,
//     taskPages: 1,
//     taskKeyword: "",
//     taskSort: "",
//     taskOrder: "",
//     taskStatus: "",
//     taskType: "",
//     taskPriority: "",
//     taskAssignee: "",
//     taskReporter: "",
//     taskProject: "",
//     taskProjectList: [],
//     taskUserList: [],
//     taskPriorityList: [],
//     taskStatusList: [],
//     taskTypeList: [],
//     taskAssigneeList: [],
//     taskReporterList: [],
//     taskProjectListLoading: false,
//     taskUserListLoading: false,
//     taskPriorityListLoading: false,
//     taskStatusListLoading: false,
//     taskTypeListLoading: false,
//     taskAssigneeListLoading: false,
//     taskReporterListLoading: false,
//     taskProjectListError: null,
//     taskUserListError: null,
//     taskPriorityListError: null,
//     taskStatusListError: null,
//     taskTypeListError: null,
//     taskAssigneeListError: null,
//     taskReporterListError: null,
//     taskListLoading: false,
//     taskListError: null,
//     taskDetailLoading: false,
//     taskDetailError: null,
//     taskCreateLoading: false,
//     taskCreateError: null,
//     taskUpdateLoading: false,
//     taskUpdateError: null,
//     taskDeleteLoading: false,
//     taskDeleteError: null,
//     taskListByProjectLoading: false,
//     taskListByProjectError: null,
//     taskListByProject: [],
//     taskListByUserLoading: false,
//     taskListByUserError: null,
//     taskListByUser: [],
//     taskListByKeywordLoading: false,
//     taskListByKeywordError: null,
//     taskListByKeyword: [],
//     taskListByFilterLoading: false,
//     taskListByFilterError: null,
//     taskListByFilter: [],
//     taskListByFilterPages: 1,
//     taskListByFilterPage: 1,
//     taskListByFilterLimit: 10,
//     taskListByFilterCount: 0,
//     taskListByFilterKeyword: "",
//     taskListByFilterSort: "",
//     taskListByFilterOrder: "",
//     taskListByFilterStatus: "",
// }