// @flow
import { simpleGet, simplePost, simplePut } from '../../shared/RxAjax';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import MusitConservation from '../../models/conservation';
import MusitActor from '../../models/actor';
import MusitObject from '../../models/object';
import flatten from 'lodash/flatten';
import type { Callback, AjaxGet, AjaxPost } from '../../types/ajax';
import type {
  ConservationCollection,
  ObjectInfo,
  AffectedThing
} from '../../types/conservation';
import type { Actor } from '../../types/actor';
import Sample from '../../models/sample';
import type { SampleType } from 'types/sample';

export type ConservationStoreState = {
  loading?: boolean,
  conservation?: ?ConservationCollection
};

export const initialState: ConservationStoreState = {
  conservationTypes: [],
  loading: false,
  conservation: null
};

type Flag = { ['loadingConservation']: boolean };

const setLoading$: Subject<Flag> = createAction('setLoading$');

const flagLoading = s => () => setLoading$.next(s);

export const getConservation$: Subject<*> = createAction('getConservation$');
const getConservationAction$: Observable<*> = getConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(props =>
    MusitConservation.getConservationById(simpleGet)(props).flatMap(
      getConservationDetails(simpleGet, simplePost, props)
    )
  )
  .do(flagLoading({ loadingConservation: false }));

export const updateConservation$: Subject<*> = createAction('updateConservation$');
const updateConservationAction$: Observable<*> = updateConservation$
  .do(flagLoading({ loadingConservation: true }))
  .switchMap(MusitConservation.editConservationEvent(simplePut))
  .do(flagLoading({ loadingConservation: false }));

export const clearStore$: Subject<*> = createAction('clearStore$');

type Actions = {
  setLoading$: Subject<Flag>,
  getConservationAction$: Observable<*>,
  updateConservationAction$: Observable<*>,
  clearStore$: Subject<*>
};

export const reducer$ = (
  actions: Actions
): Observable<Reducer<ConservationStoreState>> => {
  return Observable.merge(
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.clearStore$.map(() => () => initialState),
    Observable.merge(
      actions.getConservationAction$,
      actions.updateConservationAction$
    ).map(conservation => state => ({
      ...state,
      conservation
    }))
  );
};

export const store$ = (
  actions$: Actions = {
    setLoading$,
    getConservationAction$,
    updateConservationAction$,
    clearStore$
  }
) => createStore('conservationStore', reducer$(actions$), initialState);

const storeSingleton = store$();
export default storeSingleton;
type SampleTypes = {
  [string]: Array<SampleType>
};

export function getConservationDetails(
  ajaxGet: AjaxGet<*>,
  ajaxPost: AjaxPost<*>,
  props: {
    id: number,
    museumId: number,
    collectionId: string,
    token: string,
    callback?: Callback<*>,
    sampleTypes: SampleTypes
  }
): (conservation: ConservationCollection) => Observable<*> {
  return (conservation: ConservationCollection) =>
    MusitActor.getActors(ajaxPost)({
      actorIds: [
        conservation.registeredBy || '',
        conservation.updatedBy || '',
        conservation.doneBy || '',
        conservation.responsible || '',
        conservation.administrator || '',
        conservation.completedBy || ''
      ].filter(p => p),
      token: props.token
    })
      .map(actors => {
        if (actors) {
          const actorNames = getActorNames(actors, conservation);
          if (conservation.restriction) {
            return {
              ...conservation,
              ...actorNames
            };
          }
          return {
            ...conservation,
            ...actorNames
          };
        }
        return conservation;
      })
      .flatMap(conservation => {
        const objectId = conservation.objectId;
        if (!objectId) {
          return Observable.of(conservation);
        }
        return MusitObject.getObjectDetails(ajaxGet)({
          id: objectId,
          museumId: props.museumId,
          collectionId: props.collectionId,
          token: props.token
        }).map(({ response }) => {
          if (!response) {
            return conservation;
          }
          return {
            ...conservation,
            museumNo: response.museumNo,
            subNo: response.subNo,
            term: response.term
          };
        });
      });
}

type AjaxParams = {
  museumId: number,
  collectionId: string,
  token: string,
  sampleTypes: SampleTypes
};

function getEventObjectDetails(
  props: AjaxParams,
  ajaxGet: AjaxGet<*>
): (t: AffectedThing) => Observable<ObjectInfo> {
  return event => {
    const params = {
      id: event.affectedThing,
      museumId: props.museumId,
      collectionId: props.collectionId,
      token: props.token
    };
    return MusitObject.getObjectDetails(ajaxGet)(params).flatMap(objRes => {
      if (objRes.error) {
        return Sample.loadSample(ajaxGet)(params).flatMap(sample => {
          return MusitObject.getObjectDetails(ajaxGet)({
            ...params,
            id: sample.originatedObjectUuid
          }).map(sampleObjectRes => {
            const flattened = flatten(Object.values(props.sampleTypes));
            const sampleType = flattened.find(
              st => st.sampleTypeId === sample.sampleTypeId
            );
            return {
              sampleData: { ...sample, sampleType: sampleType },
              objectData: sampleObjectRes.response
            };
          });
        });
      }
      return Observable.of({ objectData: objRes.response });
    });
  };
}

export function zipObjectInfoWithEvents(conservation: ConservationCollection) {
  return (arrayOfObjectDetails: Array<ObjectInfo>): ConservationCollection => {
    const actualValues = arrayOfObjectDetails.filter(a => a);
    if (actualValues.length === 0) {
      return conservation;
    }
    const events = conservation.events
      ? conservation.events.map(e => {
          const od = arrayOfObjectDetails.find(objD => {
            return (
              (objD.sampleData && objD.sampleData.objectId === e.affectedThing) ||
              (objD.objectData && objD.objectData.uuid === e.affectedThing)
            );
          });
          return od ? { ...od, ...e } : e;
        })
      : [];
    return { ...conservation, events: events };
  };
}

export function getActorNames(
  actors: Array<Actor>,
  conservation: ConservationCollection
) {
  return MusitActor.getMultipleActorNames(actors, [
    {
      id: conservation.updatedBy || '',
      fieldName: 'updatedByName'
    },
    {
      id: conservation.registeredBy || '',
      fieldName: 'registeredByName'
    },
    {
      id: conservation.doneBy || '',
      fieldName: 'doneByName'
    },
    {
      id: conservation.responsible || '',
      fieldName: 'responsibleName'
    },
    {
      id: conservation.administrator || '',
      fieldName: 'administratorName'
    },
    {
      id: conservation.completedBy || '',
      fieldName: 'completedByName'
    }
  ]);
}
