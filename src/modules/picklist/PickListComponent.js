import React, { PropTypes } from 'react';
import { PageHeader, Grid, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MoveDialogComponent';
import MusitObject from '../../models/object';
import './PickListComponent.css';
import Config from '../../config';
import PrintTemplate from '../print/PrintTemplateContainer';
import ScannerButton from '../../components/scanner/ScannerButton';

export class PickListComponent extends React.Component {
  static propTypes = {
    pickList: PropTypes.object.isRequired,
    markNode: PropTypes.func.isRequired,
    markObject: PropTypes.func.isRequired,
    markMainObject: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    removeObject: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    refreshNode: PropTypes.func.isRequired,
    refreshObjects: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    toggleScanner: PropTypes.func.isRequired,
    scannerEnabled: PropTypes.bool.isRequired,
    moveItems: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.print = this.print.bind(this);
    this.showMoveNodes = this.showMoveNodes.bind(this);
  }

  isNodeView() {
    return this.props.isTypeNode(this.props);
  }

  showMoveNodes(items) {
    let title;
    if (this.props.isTypeNode(this.props)) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.props.showModal(
      title,
      <MusitModal
        appSession={this.props.appSession}
        onMove={this.props.moveItems(this.props.appSession, items, this.isNodeView())}
      />
    );
  }

  print(nodesToPrint) {
    this.props.showModal(
      I18n.t('musit.template.labelTemplates'),
      <PrintTemplate appSession={this.props.appSession} marked={nodesToPrint} />
    );
  }

  toggleObject({ item, on }) {
    if (item.mainObjectId && MusitObject.isMainObject(item)) {
      this.props.markMainObject({ item, on });
    } else {
      this.props.markObject({ item, on });
    }
  }

  iconRenderer(pick) {
    if (pick.value.name) {
      return <FontAwesome name="folder" />;
    }
    return <span className="icon icon-musitobject" />;
  }

  labelRenderer(isNode, pick) {
    return (
      <div>
        {!isNode
          ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span>
          : null}
        {!isNode ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
        <span style={{ paddingLeft: '1em' }}>
          {pick.value.name ? pick.value.name : pick.value.term}
        </span>
        <div className="labelText">
          <Breadcrumb
            node={pick.path}
            onClickCrumb={node => {
              if (node.id) {
                hashHistory.push(
                  Config.magasin.urls.client.storagefacility.goToNode(
                    node.id,
                    this.props.appSession
                  )
                );
              } else {
                hashHistory.push(
                  Config.magasin.urls.client.storagefacility.goToRoot(
                    this.props.appSession
                  )
                );
              }
            }}
            allActive
          />
        </div>
      </div>
    );
  }

  selectedCount(isNode, count) {
    return (
      <span
        className="normalActionNoPadding"
        style={{ fontSize: '0.8em' }}
        title={I18n.t(
          `musit.pickList.tooltip.${isNode ? 'selectedNodeCount' : 'selectedObjectCount'}`
        )}
      >
        {`(${count})`}
      </span>
    );
  }

  remove(item) {
    if (this.isNodeView()) {
      this.props.removeNode(item);
    } else {
      this.props.removeObject(item);
    }
  }

  toggle(item, on) {
    if (this.isNodeView()) {
      this.props.markNode({ item, on });
    } else {
      this.toggleObject({ item, on });
    }
  }

  render() {
    const type = this.props.route.type;
    const pickList = this.props.pickList[type] || [];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);
    const isNode = this.isNodeView();
    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              <div>
                <span>{I18n.t(`musit.pickList.title.${this.props.route.type}`)}</span>
                <div
                  style={{
                    float: 'right',
                    margin: '0 25px 0 0'
                  }}
                >
                  <ScannerButton
                    enabled={this.props.scannerEnabled}
                    onClick={this.props.toggleScanner}
                  />
                </div>
              </div>
            </PageHeader>
            <Table responsive striped condensed hover>
              <thead>
                <tr>
                  <th style={{ width: '2em', textAlign: 'left' }}>
                    <input
                      className="normalAction"
                      type="checkbox"
                      checked={marked.length === pickList.length && pickList.length !== 0}
                      onChange={e =>
                        this.toggle(pickList.map(p => p.value), e.target.checked)}
                      title={I18n.t('musit.pickList.tooltip.checkBoxMarkAll')}
                    />
                  </th>
                  <th style={{ verticalAlign: 'bottom', textAlign: 'left' }}>
                    {isNode
                      ? <FontAwesome
                          className="normalActionNoPadding"
                          style={{ fontSize: '1.5em' }}
                          name="print"
                          onClick={() => {
                            if (marked.length > 0) {
                              this.print(marked);
                            }
                          }}
                          title={I18n.t('musit.pickList.tooltip.printSelectedNodes')}
                        />
                      : null}
                    {isNode ? this.selectedCount(isNode, marked.length) : null}
                    <FontAwesome
                      className={isNode ? 'normalAction' : 'normalActionNoPadding'}
                      name="truck"
                      style={{ fontSize: '1.5em' }}
                      onClick={() => {
                        if (marked.length > 0) {
                          this.showMoveNodes(markedValues);
                        }
                      }}
                      title={I18n.t(
                        `musit.pickList.tooltip.${isNode ? 'moveSelectedNodes' : 'moveSelectedObjects'}`
                      )}
                    />
                    {this.selectedCount(isNode, marked.length)}
                    <FontAwesome
                      className="normalAction"
                      style={{ fontSize: '1.5em' }}
                      name="remove"
                      onClick={() => {
                        if (marked.length > 0) {
                          this.remove(markedValues);
                        }
                      }}
                      title={I18n.t(
                        `musit.pickList.tooltip.${isNode ? 'removeSelectedNodesFromList' : 'removeSelectedObjectsFromList'}`
                      )}
                    />
                    {this.selectedCount(isNode, marked.length)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pickList.map((pick, i) => {
                  const item = pick.value;
                  const isItemMarked = pick.marked;
                  const isMainObject = item.term &&
                    (!item.mainObjectId || MusitObject.isMainObject(item));
                  const isChildObject = item.term &&
                    (item.mainObjectId && !MusitObject.isMainObject(item));
                  return (
                    <tr
                      key={i}
                      className={
                        isChildObject ? 'childObject' : isMainObject && 'mainObject'
                      }
                    >
                      <td
                        style={{
                          width: '3em',
                          textAlign: 'left',
                          verticalAlign: 'middle'
                        }}
                      >
                        <span>
                          {!item.mainObjectId || isMainObject
                            ? <input
                                type="checkbox"
                                checked={isItemMarked ? 'checked' : ''}
                                onChange={() => this.toggle(item)}
                              />
                            : <input
                                type="checkbox"
                                checked={isItemMarked ? 'checked' : ''}
                                disabled
                              />}
                        </span>
                      </td>
                      <td>
                        <span className="pickListIcon">
                          {this.iconRenderer(pick)} {this.labelRenderer(isNode, pick)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{pickList.length} &nbsp;
              {isNode
                ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected')}
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}
