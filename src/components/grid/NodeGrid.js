

import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class NodeGrid extends Component {
  static propTypes = {
    id: PropTypes.number,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      objectCount: PropTypes.number,
      totalObjectCount: PropTypes.number,
      nodeCount: PropTypes.number
    })),
    onAction: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render() {
    const { id, translate } = this.props
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>
                  {translate('musit.grid.node.nodeName')}
                </th>
                <th>
                  {translate('musit.grid.node.nodeType')}
                </th>
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.tableData.map((c, i) =>
                <tr key={i} id={`${id}_${c.name}_${c.type}`} >
                  <td id={`${id}_${c.name}_${c.type}_nodeName`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onClick(c)
                      }}
                    >
                      <FontAwesome name="folder" />
                      {` ${c.name}`}
                    </a>
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_nodeType`}>
                    {translate(`musit.grid.node.nodeTypeItems.${c.type}`)}
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_objectCount`}>
                    {c.objectCount}
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_totalObjectCount`}>
                    {c.totalObjectCount}
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_nodeCount`}>
                    {c.nodeCount}
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_eye`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onAction('controlsobservations', c)
                      }}
                    >
                      <span className="icon icon-musitcontrolobsicon" />
                    </a>
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_truck`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onAction('move', c)
                      }}
                    >
                      <FontAwesome name="truck" />
                    </a>
                  </td>
                  <td id={`${id}_${c.name}_${c.type}_shoppingCart`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onAction('pick', c)
                      }}
                    >
                      <FontAwesome name="shopping-cart" />
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}