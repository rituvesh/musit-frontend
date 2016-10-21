
import React from 'react'
import { connect } from 'react-redux'
import { Table, PageHeader, Panel, Grid, Row } from 'react-bootstrap'
import { loadKDReport } from '../../reducers/reports'
import { I18n } from 'react-i18nify'
import { formatFloatToString } from './../../util'

export class KDReport extends React.Component {
  static propTypes= {
    data: React.PropTypes.object,
    loadKDReport: React.PropTypes.func
  };

  componentWillMount() {
    this.props.loadKDReport()
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <PageHeader>
                  {I18n.t('musit.reports.securingCollections.header')}
                </PageHeader>
                <Table style={{ width: 700 }}>
                  <tbody>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.totalArea')}</td>
                      <td>{data ? formatFloatToString(data.totalArea) : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.perimeter')}</td>
                      <td>{data ? formatFloatToString(data.perimeterSecurity) : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.theftProtection')}</td>
                      <td>{data ? formatFloatToString(data.theftProtection) : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.fireProtection')}</td>
                      <td>{data ? formatFloatToString(data.fireProtection) : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.waterDamage')}</td>
                      <td>{data ? formatFloatToString(data.waterDamageAssessment) : null} m&sup2;</td>
                    </tr>
                    <tr>
                      <td>{I18n.t('musit.reports.securingCollections.routinesAndContingencyPlan')}</td>
                      <td>{data ? formatFloatToString(data.routinesAndContingencyPlan) : null} m&sup2;</td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    data: state.reports && state.reports.data ? state.reports.data.kdreport.data : null
  }
};

const mapDispatchToProps = (dispatch) => ({
  loadKDReport: () => dispatch(loadKDReport())
});

export default connect(mapStateToProps, mapDispatchToProps)(KDReport)
