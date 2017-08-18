// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import './ObjectResultTable.css';
import Result from '../components/Result';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';
import FontAwesome from 'react-fontawesome';
import MusitI18n from '../../../components/MusitI18n';

type Props = {
  data: Array<Object>,
  handleClickRow: (object: Object) => void,
  updateForm?: Function,
  extraAttributes?: any,
  history: History,
  appSession: AppSession,
  viewMode?: ?boolean
};

export default function ObjectResultTable({
  data,
  handleClickRow,
  extraAttributes,
  updateForm,
  history,
  appSession,
  viewMode
}: Props) {
  const enableResultForObject = data.length > 1;
  return (
    <table
      style={{
        backgroundColor: 'white'
      }}
      className="table table-bordered table-striped table-responsive"
    >
      <thead>
        <tr>
          <th>{' '}</th>
          <th>{I18n.t('musit.objects.objectsView.musNo')}</th>
          <th>{I18n.t('musit.objects.objectsView.subNo')}</th>
          <th>{I18n.t('musit.analysis.term')}</th>
          <th>{I18n.t('musit.sample.sampleNumber')}</th>
          <th>{I18n.t('musit.sample.sampleType')}</th>
          <th width={10}>{' '}</th>
        </tr>
      </thead>
      <tbody>
        {data
          ? data.map((row, i) => {
              const rows = [
                <tr
                  key={['objectRow', i].join('_')}
                  onClick={() => enableResultForObject && handleClickRow(row)}
                  className={row.expanded ? 'expanded-row' : 'collapsed-row'}
                >
                  <td name="type" width={10}>
                    {row.sampleNum
                      ? <span className="icon icon-musit-testtube" />
                      : <span className="icon icon-musitobject" />}
                  </td>
                  <td name="museumNo">{row.museumNo || ''}</td>
                  <td name="subNo">{row.subNo || ''}</td>
                  <td name="term">{row.term}</td>
                  <td name="sampleNum"><span>{row.sampleNum || ''}</span></td>
                  <td name="sampleType">
                    {row.sampleTypeObj &&
                      row.sampleTypeObj.enSampleType &&
                      <MusitI18n
                        en={row.sampleTypeObj.enSampleType}
                        no={row.sampleTypeObj.noSampleType}
                      />}
                    {row.sampleTypeObj &&
                      row.sampleTypeObj.enSampleSubType &&
                      <span>
                        <span>{' / '}</span>
                        <MusitI18n
                          en={row.sampleTypeObj.enSampleSubType}
                          no={row.sampleTypeObj.noSampleSubType}
                        />
                      </span>}
                  </td>
                  <td>
                    {enableResultForObject &&
                      (row.expanded
                        ? <FontAwesome name="chevron-up" />
                        : <FontAwesome name="chevron-right" />)}
                  </td>
                </tr>
              ];
              if (row.expanded) {
                return [
                  ...rows,
                  <tr
                    key={['objectResult', i].join('_')}
                    className="expanded-row-dropdown"
                  >
                    <td colSpan={7}>
                      <Result
                        extraAttributes={extraAttributesWithResult(
                          extraAttributes,
                          row.result
                        )}
                        updateExtraResultAttribute={(name, value) => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, [name]: value }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        externalSource={
                          row.result.extRef ? row.result.extRef.join(',') : ''
                        }
                        updateExternalSource={extRef => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: {
                              ...row.result,
                              extRef: extRef.split(',').map(v => v.trim())
                            }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        comments={row.result.comment}
                        updateComments={comment => {
                          const newData = [...data];
                          newData.splice(i, 1, {
                            ...row,
                            result: { ...row.result, comment }
                          });
                          updateForm && updateForm({ name: 'events', rawValue: newData });
                        }}
                        appSession={appSession}
                        history={history}
                        parentObjectId={
                          row.originatedObjectUuid ? row.originatedObjectUuid : row.uuid
                        }
                        viewMode={viewMode}
                      />
                    </td>
                  </tr>
                ];
              }
              return rows;
            })
          : <span className="no-data">{I18n.t('musit.objects.noData')}</span>}
      </tbody>
    </table>
  );
}

function extraAttributesWithResult(extraAttributes, result) {
  return (
    extraAttributes &&
    Object.keys(extraAttributes).reduce((acc, eat) => {
      const value = result[eat];
      const eatAttr = extraAttributes && extraAttributes[eat] ? extraAttributes[eat] : {};
      return {
        ...acc,
        [eat]: {
          ...eatAttr,
          value: eatAttr.type === 'String'
            ? value
            : {
                ...value,
                rawValue: value && value.value && value.value.toString().replace('.', ',')
              }
        }
      };
    }, {})
  );
}
