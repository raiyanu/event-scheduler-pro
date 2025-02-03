import { getTaskList } from "@/config/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    taskLoading: "idle",
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
                console.log(action.payload);
                state.taskLoading = "loaded";
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.taskLoading = "failed";
            });
    },
});

export const { } = taskSlice.actions;
export default taskSlice.reducer;


