import { sampleTasks } from '~/mocks/data/tasks';
import type { TaskDetailResponse } from '../api/types';

const parentTask = sampleTasks[0];
const task = sampleTasks[1];
const subtask = sampleTasks[2];

export const mockTaskDetail: TaskDetailResponse = {
  task,
  parentTask,
  subtasks: [subtask],
};

export const mockTaskDetailWithoutSubtasks: TaskDetailResponse = {
  task: sampleTasks[2],
  parentTask,
  subtasks: [],
};

export const mockTaskDetailWithoutParent: TaskDetailResponse = {
  task: sampleTasks[0],
  parentTask: null,
  subtasks: [sampleTasks[1], sampleTasks[2]],
};
