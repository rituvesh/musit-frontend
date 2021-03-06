/* @flow */
import React from 'react';
import { Row, Col, Tabs, Tab, PageHeader, Button } from 'react-bootstrap';
import type { ObjectData } from '../../types/object';
import type { Samples } from '../../types/samples';
import type { Events } from '../../types/events';
import EventTableComponent from '../../components/events/eventTableComponent';
import SampleTableComponent from '../../components/samples/sampleTableComponent';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';

type ViewObjectComponentProps = {
  objectStore: { objectData: ObjectData, events: Events, samples: Samples },
  appSession: AppSession
};

export const ViewObjectComponent = (
  { objectStore: { objectData, events, samples }, appSession }: ViewObjectComponentProps
) => (
  <div>
    <PageHeader>Objektvisning</PageHeader>
    <div style={{ marginTop: '30px', marginBottom: '40px' }}>
      <Row>
        <Col md={2}><b>Museumsnr:</b>{' '}{objectData && objectData.museumNo}</Col>
        <Col md={1}><b>Unr:</b>{' '}{objectData && objectData.subNo}</Col>
        <Col md={3}><b>Term/artsnavn:</b>{' '}{objectData && objectData.term}</Col>
      </Row>
    </div>
    <div style={{ paddingBottom: 10 }}>
      <Button
        className="primary"
        onClick={() =>
          hashHistory.push({
            pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
            state: [objectData]
          })}
      >
        Ny analyse
      </Button>
      <Button
        className="primary"
        onClick={() =>
          hashHistory.push({
            pathname: Config.magasin.urls.client.analysis.addSample(
              appSession,
              objectData.uuid
            ),
            state: [objectData]
          })}
      >
        Ny prøve
      </Button>
    </div>
    <Tabs defaultActiveKey={1} id="events">
      <Tab title="Hendelser" eventKey={1}>
        <EventTableComponent
          events={events}
          onClick={event => {
            if (event.type === 'Analysis') {
              hashHistory.push({
                pathname: Config.magasin.urls.client.analysis.viewAnalysis(
                  appSession,
                  event.id
                ),
                state: [objectData]
              });
            }
          }}
        />
      </Tab>
      <Tab title="Prøver" eventKey={2}>
        <SampleTableComponent
          samples={samples}
          onClick={sample => {
            hashHistory.push({
              pathname: Config.magasin.urls.client.analysis.gotoSample(
                appSession,
                sample.objectId
              ),
              state: [objectData]
            });
          }}
        />
      </Tab>
    </Tabs>
  </div>
);

export default ViewObjectComponent;
