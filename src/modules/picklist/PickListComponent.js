
import React from 'react';
import PickListTable from './PickListTable';
import { PageHeader, Grid } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { hashHistory } from 'react-router';
import { TYPES } from '../picklist/picklistReducer';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MusitModalContainer';
import './PickListComponent.css';
import { emitError, emitSuccess } from '../../shared/errors/emitter';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import PrintTemplate from '../print/PrintTemplateContainer';
import inject from '../../state/inject';

export class PickListContainer extends React.Component {
  static propTypes = {
    picks: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    toggleObject: React.PropTypes.func.isRequired,
    removeNode: React.PropTypes.func.isRequired,
    removeObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    moveObject: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    appSession: React.PropTypes.object.isRequired,
    refreshNodes: React.PropTypes.func.isRequired,
    refreshObjects: React.PropTypes.func.isRequired,
    clearMoveDialog: React.PropTypes.func.isRequired
  }

  static contextTypes = {
    showModal: React.PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.moveModal = this.moveModal.bind(this);
    this.print = this.print.bind(this);
  }

  isTypeNode() {
    const type = this.props.params.type.toUpperCase();
    return type === TYPES.NODE;
  }

  showModal = (items) => {
    let title;
    if (this.isTypeNode()) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.context.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveModal(items)}/>, this.props.clearMoveDialog);
  }

  nodeCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onSuccess: () => {
      this.props.refreshNodes(items.map(p => p.value).map(item => item.id), this.props.appSession.getMuseumId());
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({type: 'movedSuccess', message: I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName })});
      } else {
        emitSuccess({type: 'movedSuccess', message: I18n.t('musit.moveModal.messages.nodesMoved', { count: toMoveLength, destination: toName })});
      }
    },
    onFailure: (e) => {
      if (toMoveLength === 1) {
        emitError({type: 'errorOnMove', error: e, message: I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName })});
      } else {
        emitError({type: 'errorOnMove', error: e,
          message: I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLength, destination: toName })});
      }
    }
  })
  objectCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onSuccess: () => {
      this.props.refreshObjects(items.map(p => p.value).map(item => item.id), this.props.appSession.getMuseumId());
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({type: 'movedSuccess', message: I18n.t('musit.moveModal.messages.objectMoved', { name, destination: toName })});
      } else {
        emitSuccess({type: 'movedSuccess', message: I18n.t('musit.moveModal.messages.objectsMoved', { count: toMoveLength, destination: toName })});
      }
    },
    onFailure: (e) => {
      if (toMoveLength === 1) {
        emitError({type: 'errorOnMove', error: e, message: I18n.t('musit.moveModal.messages.errorObject', { name, destination: toName })});
      } else {
        emitError({type: 'errorOnMove', error: e,
          message: I18n.t('musit.moveModal.messages.errorObjects', { count: toMoveLength, destination: toName })});
      }
    }
  })

  moveModal = (items) => (to, toName, onSuccess) => {
    const isNode = this.isTypeNode();
    const moveFunction = isNode ? this.props.moveNode : this.props.moveObject;
    const toMove = items.map(itemToMove => itemToMove.value.id);
    const toMoveLength = toMove.length;
    const first = items[0].value;
    const name = isNode ? first.name : first.term;
    let callback;
    if (isNode) {
      callback = this.nodeCallback(toName, toMoveLength, name, items, onSuccess);
    } else {
      callback = this.objectCallback(toName, toMoveLength, name, items, onSuccess);
    }


    let error = false;
    if (isNode) {
      const itemsWithError = items.filter(fromNode => checkNodeBranchAndType(fromNode, to));
      const errorMessages = itemsWithError.map(fromNode => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.value.name})` );
      if (errorMessages.length > 0) {
        error = true;
        for (const errorMessage of errorMessages) {
          emitError({
            type: 'errorOnMove',
            message: errorMessage
          });
        }
      }
    }

    if (!error) {
      moveFunction(toMove, to.id, this.props.appSession.getActor().getActorId(), this.props.appSession.getMuseumId(), callback);
    }
  }

  print(nodesToPrint) {
    this.context.showModal('Choose template', <PrintTemplate marked={nodesToPrint} />);
  }

  render() {
    const { toggleNode, toggleObject, removeNode, removeObject } = this.props;
    const type = this.props.params.type.toUpperCase();
    const picks = (this.props.picks && this.props.picks[type]) || [];
    const marked = picks.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);
    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              {I18n.t(`musit.pickList.title.${this.props.params.type}`)}
            </PageHeader>
            <PickListTable
              picks={picks}
              marked={markedValues}
              isnode={this.isTypeNode()}
              iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                <span className='icon icon-musitobject'/>)
              }
              labelRendrer={(pick) => {
                return (
                  <div>
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span> : null}
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                      <Breadcrumb
                        node={pick.path}
                        onClickCrumb={node => hashHistory.push(`/magasin/${!node.id || node.id === -1 ? '' : node.id}`)}
                        allActive
                      />
                    </div>
                  </div>
                );
              }}
              toggle={(item, on) => this.isTypeNode() ? toggleNode(item, on) : toggleObject(item, on)}
              remove={item => this.isTypeNode() ? removeNode(item) : removeObject(item)}
              move={() => this.showModal(marked)}
              print={this.print}
            />
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{picks.length} &nbsp;
              {this.isTypeNode() ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected') }
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}

const data = {
  appSession: {
    type: React.PropTypes.object.isRequired
  }
};

export default inject(data)(PickListContainer);