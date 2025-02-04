import { deleteTask, getTaskList } from "@/config/firebase";
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

export const DeleteTasks = createAsyncThunk(
    "tasks/DeleteTasks",
    async (payload, { rejectWithValue }) => {
        try {
            console.log(payload)
            await deleteTask(payload);
            const resTask = await getTaskList();
            return resTask;
        } catch (error) {
            return rejectWithValue(new Error(res.message));
        }
    }
);

const taskSlice = createSlice({
    name: "TASK",
    initialState,
    reducers: {},
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
            .addCase(DeleteTasks.pending, (state) => {
                state.taskCRUD = "processing";
            })
            .addCase(DeleteTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.taskCRUD = "success";
            })
            .addCase(DeleteTasks.rejected, (state, action) => {
                state.taskCRUD = "failed";
            });
    },
});

export const { } = taskSlice.actions;
export default taskSlice.reducer;


