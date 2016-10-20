import React from 'react'
import { I18n } from 'react-i18nify'
import { Grid, Form, FormGroup, FormControl, ControlLabel, Button, Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import Breadcrumb from '../../layout/Breadcrumb'
import { createBreadcrumbPath } from '../../util'
import PagingToolbar from '../../util/paging'
import { hashHistory } from 'react-router'

export function renderParam(id, props) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{I18n.t(`musit.objectsearch.${id}.label`)}</ControlLabel>
      {' '}
      <FormControl
        type="text"
        placeholder={I18n.t(`musit.objectsearch.${id}.placeHolder`)}
        value={props.params[id] || ''}
        onChange={(e) => props.onChangeField(id, e.target.value)}
      />
    </FormGroup>
  )
}

export function renderBreadcrumb(path: [], pathNames: []) {
  return <Breadcrumb nodes={createBreadcrumbPath(path, pathNames)} allActive />
}

export default (props) =>
  <div style={{ paddingTop: 20 }}>
    <main>
      <Grid>
        <div>
          <h2>{I18n.t('musit.objectsearch.title')}</h2>
          <Form inline>
            {renderParam('museumNo', props)}
            {' '}
            {renderParam('subNo', props)}
            {' '}
            {renderParam('term', props)}
            {' '}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                props.searchForObjects(props.params)
              }}
            >
              Search
            </Button>
          </Form>
          {props.data.length > 0 &&
            <div>
              <br />
              <h4>{I18n.t('musit.objectsearch.results.title', { count: props.data.length })}</h4>
              <Table>
                <thead>
                  <tr>
                    <th>{I18n.t('musit.objectsearch.museumNo.label')}</th>
                    <th>{I18n.t('musit.objectsearch.subNo.label')}</th>
                    <th>{I18n.t('musit.objectsearch.term.label')}</th>
                    <th>{I18n.t('musit.objectsearch.location.label')}</th>
                  </tr>
                </thead>
                <tbody>
                {props.data.map((data, i) =>
                  <tr key={i}>
                    <td className="museumNo">{data.museumNo}</td>
                    <td className="subNo">{data.subNo}</td>
                    <td className="term">{data.term}</td>
                    <td className="path">{renderBreadcrumb(data.path, data.pathNames)}</td>
                    <td className="move"><FontAwesome name="truck" /></td>
                  </tr>
                )}
                </tbody>
              </Table>
              <PagingToolbar
                currentPage={props.location.query.page}
                numItems={props.data.length}
                baseUrl={props.location.pathname}
                history={hashHistory}
                perPage={10}
              />
            </div>
          }
        </div>
      </Grid>
    </main>
  </div>