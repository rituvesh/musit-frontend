import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Event from '../../models/event';
import MusitObject from '../../models/object';

const initialState = {};

export const loadEvents$ = createAction('loadEvents$').switchMap(
  Event.getAnalysesAndMoves()
);
export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(
  MusitObject.getObjectLocation()
);
export const setObject$ = createAction('setObject$');
export const clear$ = createAction('clear$');

const reducer$ = actions =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadEvents$.map(data => state => ({ ...state, data })),
    actions.getCurrentLocation$.map(currentLocation =>
      state => ({ ...state, currentLocation })),
    actions.setObject$.map(object => state => ({ ...state, object }))
  );

export const eventsStore$ = (
  actions = { loadEvents$, getCurrentLocation$, setObject$, clear$ }
) => createStore('eventsStore', reducer$(actions), Observable.of(initialState));

export default eventsStore$();
