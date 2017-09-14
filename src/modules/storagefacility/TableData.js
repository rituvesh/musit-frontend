// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import FontAwesome from 'react-fontawesome';
import MusitObject from '../../models/object';
import type { AppSession } from '../../types/appSession';
import type { ObjectData } from '../../types/object';
import { getSampleTypeAndSubType } from '../sample/shared/types';

export type Data = ObjectData & {
  sampleNum: ?string,
  sampleTypeId: ?number
};

export type TableDataProps = {
  rowData: Data,
  appSession: AppSession,
  sampleTypes: Array<any>,
  goToObject: (id: string, type: string) => void,
  showMoveHistory: (data: Data) => void,
  onMove: (data: Data) => void,
  pickObject: (data: Data) => void,
  isObjectAdded: (data: Data) => boolean,
  sampleView: boolean
};

export default function TableData(props: TableDataProps) {
  const rowData = props.rowData;
  const isMainObject = !rowData.mainObjectId || MusitObject.isMainObject(rowData);
  const isChildObject = rowData.mainObjectId && !isMainObject;
  return (
    <tr
      key={rowData.id}
      className={isChildObject ? 'childObject' : isMainObject && 'mainObject'}
      onClick={() => props.goToObject(rowData.uuid, rowData.objectType)}
    >
      <td style={{ width: '20px' }}>
        {rowData.objectType && rowData.objectType === 'sample' ? (
          <span className="icon icon-musit-testtube" />
        ) : (
          <span className="icon icon-musitobject" />
        )}
      </td>
      <td>{rowData.museumNo}</td>
      <td>{rowData.subNo}</td>
      <td>{rowData.term}</td>
      {props.sampleView && <td>{rowData.sampleNum ? rowData.sampleNum : ''}</td>}
      {props.sampleView && (
        <td>
          {rowData.sampleTypeId && props.appSession && props.sampleTypes ? (
            getSampleTypeAndSubType(
              { sampleTypes: props.sampleTypes },
              rowData.sampleTypeId,
              props.appSession
            )
          ) : (
            ''
          )}
        </td>
      )}
      <td>
        {isMainObject && (
          <a
            className="onShowMoveHistory"
            href=""
            onClick={e => {
              e.preventDefault();
              props.showMoveHistory(props.rowData);
              e.stopPropagation();
            }}
            title={I18n.t('musit.grid.object.iconTooltip.moveObjectHistory')}
          >
            <span className="icon icon-musitmovehistoryicon" />
          </a>
        )}
      </td>
      <td>
        {isMainObject && (
          <a
            className="onMoveClick"
            href=""
            onClick={e => {
              e.preventDefault();
              props.onMove(props.rowData);
              e.stopPropagation();
            }}
            title={I18n.t('musit.grid.object.iconTooltip.moveObject')}
          >
            <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
          </a>
        )}
      </td>
      <td>
        {isMainObject && (
          <a
            className="onPickObject"
            href=""
            onClick={e => {
              e.preventDefault();
              props.pickObject(props.rowData);
              e.stopPropagation();
            }}
            title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
          >
            {props.isObjectAdded(rowData) ? (
              <FontAwesome
                style={{ fontSize: '1.5em', color: 'Gray' }}
                name="shopping-cart"
              />
            ) : (
              <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />
            )}
          </a>
        )}
      </td>
    </tr>
  );
}