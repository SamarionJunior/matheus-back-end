import mongoose from "../../database/index.js";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { collection : 'Task' });

const Task = mongoose.model('Task', TaskSchema);

export default Task;