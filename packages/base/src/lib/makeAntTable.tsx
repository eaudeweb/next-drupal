// import { Table } from 'antd'
// import { kebabCase } from './string'

// // @todo: WIP on converting domNode to AntD table
// const _makeAntTable = (domNode) => {
//   const { class: className = undefined, ...otherAttribs } =
//     domNode?.attribs || {
//       class: '',
//     }
//   const headers =
//     domNode.children[0].name == 'thead'
//       ? domNode.children[0].children[0].children
//       : []

//   const columns = headers.map((th, key) => {
//     const header = _transformElementWithNesting(th.children)
//     console.log(header)
//     return {
//       key: key,
//       dataIndex: kebabCase(header),
//       title: header,
//     }
//   })

//   const rows =
//     domNode.children[1].name == 'tbody' ? domNode.children[1].children : []

//   const dataSource = rows.map((tr, rowKey) => {
//     const cells2 = tr.children.reduce((cells, cell, cellKey) => {
//       // console.log({ cell, cells, columns })
//       return {
//         ...cells,
//         [columns[cellKey].dataIndex]: (
//           <>
//             <p>{columns[cellKey].title}</p>
//             {/* {_transformElementWithNesting(cell.children)} */}
//           </>
//         ),

//         // parse(
//         //   serialize(_transformElementWithNesting(cell)),
//         // ),
//       }
//     }, [])

//     return {
//       key: rowKey,
//       ...cells2,
//     }
//   })

//   return (
//     <Table
//       className={className}
//       columns={columns}
//       dataSource={dataSource}
//       pagination={false}
//     />
//   )
// }
