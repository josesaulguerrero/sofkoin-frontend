import { createAction, props } from '@ngrx/store';

export const fundAction = createAction(
  '[Fund page] Fund event',
  props<{
    cash: number;
  }>()
);
