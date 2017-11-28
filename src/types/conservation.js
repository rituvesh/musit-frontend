// @flow

import type { MusitObject } from '../types/object';
import type { SampleDataExtended } from '../types/samples';
import type { Person } from '../types/person';

export type ActorsAndRoles = {
  roleId?: number | string,
  roleName?: string,
  actorName?: string,
  actorId: string,
  date?: string
};

export type AffectedThing = {
  id: number,
  affectedThing: string,
  affectedType: 'collection',
  analysisTypeId: number,
  doneBy: string,
  doneDate: string,
  note?: ?string,
  partOf: number,
  registeredBy: string,
  registeredDate: string,
  responsible: string
};

export type ObjectInfo = {
  objectData?: ?MusitObject,
  sampleData?: ?SampleDataExtended
} & MusitObject;
export type ObjectInfoAffectedThing = ?ObjectInfo & ?AffectedThing;

// Fixme this type is incorrect/incomplete
export type ConservationCollection = {
  id: number,
  analysisTypeId: number,
  objectId?: ?string,
  doneBy?: ?string,
  doneDate?: ?string,
  doneByName?: ?string,
  registeredBy?: ?string,
  participating?: ?string,
  participatingName?: ?string,
  registeredDate?: ?string,
  responsible?: ?string,
  responsibleName?: string,
  administrator?: ?string,
  administratorName?: ?string,
  updatedBy?: ?string,
  updatedDate?: ?string,
  completedBy?: ?string,
  completedByName?: ?string,
  completedDate?: ?string,
  note?: ?string,
  extraAttributes?: { type: string, [string]: string | number },
  affectedThings?: ?Array<ObjectInfo>,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  caseNumber?: ?string,
  orgId?: ?number,
  events: Array<any>,
  actorsAndRoles?: Array<ActorsAndRoles>
};

export type ConservationType = {
  id: number,
  noName?: string,
  enName?: string
};

export type ConservationTypes = Array<ConservationType>;

export type ConservationTypesObject = {
  conservationTypes: ConservationTypes
};

export type ConservationStoreState = {
  loadingConservation?: boolean,
  conservation?: ?ConservationCollection,
  conservationTypes?: Array<string>
};

export type ConservationSave = {
  doneBy?: ?string,
  doneDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  caseNumber?: ?string,
  affectedThings?: ?Array<string>,
  actorsAndRoles?: Array<ActorsAndRoles>,
  note?: ?string
};

export type ConservatonSubType = {
  id: number,
  noTerm: string,
  enTerm: string
};

export type TreatmentType = {
  eventTypeId: number,
  keywords?: Array<string>,
  keywordTypes?: Array<ConservatonSubType>,
  keywordTypesOnChange?: Function,
  materials?: Array<string>,
  materialUsageTypes?: Array<ConservatonSubType>,
  materialUsageOnChange?: Function,
  note?: string,
  actorsAndRoles?: Array<Person>,
  affectedThings?: Array<string>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function
};
export type TechnicalDescriptionType = {
  eventTypeId: number,
  note: string,
  actorsAndRoles?: Array<Person>,
  affectedThings?: Array<string>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function
};

export type StorageAndHandlingType = {
  eventTypeId: number,
  note: string,
  lightAndUvLevel: string,
  relativeHumidity: string,
  temperature: string,
  actorsAndRoles: Array<Person>,
  affectedThings?: Array<string>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function
};

export type hseRiskType = {
  eventTypeId: number,
  note: string,
  actorsAndRoles: Array<Person>,
  affectedThings?: Array<string>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function
};

export type ConservationSubTypes =
  | TreatmentType
  | TechnicalDescriptionType
  | StorageAndHandlingType
  | hseRiskType;
