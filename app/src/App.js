import React, { Component } from 'react';
import './components/globals.css';
import './App.css';
import Utils from "./utils.js"
import TextInput from "./components/TextInput"
import {ListItemText} from "./components/List"
import Menu from "./components/Menu"
import Button from "./components/Button.js"
import DataTypeIcon from "./components/DataTypeIcon.js"
import NavSection from "./components/NavSection.js"
import Spinner from "./components/Spinner"
import CodeBoxInput from "./components/CodeBoxInput"

import question from "./images/question.svg"
import infoIcon from "./images/information.svg"
import ungroupedIcon from "./images/ungrouped.svg"
import groupedIcon from "./images/grouped.svg"
import filterIcon from "./images/filter.svg"
import settingsIcon from "./images/dots-vertical.svg"
import sortasc from "./images/sortasc.svg"
import sortdesc from "./images/sortdesc.svg"
import closeicon from "./images/close.svg"
// import editicon from "./images/edit.svg"

const HOST = "localhost";
const PORT = "8083";

const identity = x => x

function Header({ id, list, unselected, hide, icon, name, handleOnMenuClick, menuItems }) {
  const cls = "Header flexrow" + (list ? " listitem" : " cell") +
                (unselected ? " unselected" : " selected") + (hide ? " hidden" : " visible")
  return (
    <div className={cls} data-id={id}>
      <DataTypeIcon icon={icon} />
      <ListItemText text={name} />
      <Menu id={id} inner={<img className={"SettingsIcon highlightDark" + (list ? " hidden" : "")} src={settingsIcon} />} menuItems={menuItems} handleOnMenuClick={handleOnMenuClick} />
    </div>
  );
}

function GroupIcon({ id, group, handleGroupClick}) {
  return (
    <img className={"FloatingIcon" + (group ? " selected visible" : "")}
         data-id={id}
         src={group ? groupedIcon : ungroupedIcon}
        onClick={handleGroupClick} />
  );
}

function Column({ id, icon, name, type, data, handleOnMenuClick, menuItems, group, handleGroupClick, filter, handleFilterDone, handleFilterCodeChange}) {
  const alignRight = icon === "REAL"
  return (
    <div className="Column">
      <div className="FloatingIcons">
        <GroupIcon id={id} group={group} handleGroupClick={handleGroupClick} />
        <img className={"FloatingIcon"} data-id={id} src={infoIcon} onClick={x => x} />
        <Menu inner={<img className={"FloatingIcon" + (filter ? " selected visible" : "")} src={filterIcon} />} menuItems={
          [<CodeBoxInput id={id} placeholder={"filter function"} value={filter}
            handleOnBlur={handleFilterDone} handleOnChange={handleFilterCodeChange} />]
        } />
      </div>
      <Header id={id} list={false} hide={false} icon={icon} name={name} handleOnMenuClick={handleOnMenuClick} menuItems={menuItems} />
      {data.map((v, i) => <TableCell key={i} value={v} alignRight={alignRight} />)}
    </div>
  );
}

function TableCell({value, alignRight}) {
  return <div className={"TableCell cell " + (alignRight ? "alignright" : "alignleft")}>{value}</div>
}

function Content({ view, funcs, sourceOptionsVisible, handleSourceOptionsClick, menuItems }) {
  return (
    <div className="Content leftpad flexcol">
      <div className="ContentTopRow flexrow">
        <TextInput divid="ContentView" placeholder="" value={view.name} handleOnChange={funcs.handleViewNameChange} />
        <Menu inner={<img className="SettingsIcon highlightDark" src={settingsIcon} />} menuItems={[<Button text="generate code" handleOnClick={funcs.handleGeneratedQueryClick} />]} handleOnMenuClick={funcs.handleOnMenuClick} />
      </div>
      <div className="SourceOptionsHeader flexrow">
        <div className="DataSource">Data.Source:&nbsp;</div>
        <img className="SortIcon noMargin" src={sourceOptionsVisible ? sortasc : sortdesc} onClick={handleSourceOptionsClick} />
      </div>
      <div className={"SourceOptions flexcol bottompad" + (sourceOptionsVisible ? " visible" : " hidden")}>
        <TextInput divid="ContentPreCode" placeholder="initialization code" value={view.preCode} handleOnBlur={funcs.handlePreCodeOnBlur} handleOnChange={funcs.handlePreCodeChange} />
        <div className="SourceRowOptions">
          <Checkbox label="Cache source?" checked={view.cacheSource} handleOnClick={funcs.handleCacheSourceClick} />
          <div className="smallfont flexcolrev">Limit:&nbsp;&nbsp;</div>
          <TextInput divid="Limit" placeholder="limit" value={view.limit} handleOnBlur={funcs.handleLimitBlur} handleOnChange={funcs.handleLimitChange} />
          <div className="smallfont flexcolrev">&nbsp;&nbsp;Offset:&nbsp;&nbsp;</div>
          <TextInput divid="Offset" placeholder="offset" value={view.offset} handleOnBlur={funcs.handleOffsetBlur} handleOnChange={funcs.handleOffsetChange} />
        </div>
      </div>
      <div className="SourceCodeRow flexrow">
        <TextInput divid="ContentCode" placeholder="Code" value={view.sourceCode} handleOnBlur={identity} handleOnChange={funcs.handleCodeChange} />
        <Button text="RUN" handleOnClick={funcs.handleSourceCodeRun} />
      </div>
      {/* TODO: use something like: https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md */}
      <div className="DataTable">
        {view.columns.map((c, i) => {
          if (!c.unselected && !c.hide) {
            return <Column key={i} id={i} {...c}
              handleColumnNameChange={funcs.handleColumnNameChange}
              handleGroupClick={funcs.handleGroupClick}
              handleFilterCodeChange={funcs.handleFilterCodeChange}
              handleFilterDone={funcs.handleFilterDone}
              handleOnMenuClick={funcs.handleOnMenuClick}
              menuItems={menuItems[i]}
            />
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

function Checkbox(props) {
  return (
    <div className="Checkbox">
      <input type="checkbox" checked={props.checked} onClick={props.handleOnClick} />
      <label>{props.label}</label>
    </div>
  );
}

function NewColumn({ visible, name, aggregated, code, handleNewColumnNameChange, handleNewColumnIsAggregated, handleNewColumnCodeChange, handleEnterPressed, handleSaveNewColumn, handleCancelNewColumn}) {
  return (
    <div className={"NewColumn" + (visible ? " visible" : " hidden")}>
      <TextInput divid="NewColumnNameTextInput" placeholder="New Column" value={name} handleOnBlur={(x) => (x)} handleOnChange={handleNewColumnNameChange} handleOnKeyPress={handleEnterPressed}/>
      <Checkbox label="Aggregated" checked={aggregated} handleOnClick={handleNewColumnIsAggregated} />
      <TextInput divid="NewColumnCode" placeholder="Code..." value={code} handleOnBlur={(x) => (x)} handleOnChange={handleNewColumnCodeChange} handleOnKeyPress={handleEnterPressed}/>
      <div className="NewColumnActionButtons">
        <Button text="SAVE" handleOnClick={handleSaveNewColumn} />
        <Button text="CANCEL" handleOnClick={handleCancelNewColumn} />
      </div>
    </div>
  );
}

function GeneratedQuery({visible, generatedQuery, handleGeneratedQueryClick}) {
  return (
    <div className={"GeneratedQuery flexcol" + (visible ? " visible" : " hidden")} >
      <div className="GeneratedQueryTitle flexrow">
        <div className="DataSource">Generated query:</div>
        <img className="CloseIcon" src={closeicon} onClick={handleGeneratedQueryClick} />
      </div>
      <div className="DataSource">{generatedQuery}</div>
    </div>
  );
}

function getId(e) {
  if (e.target.dataset.id) {
    return parseInt(e.target.dataset.id, 10)
  } else if (e.target.parentElement.dataset.id) {
    return parseInt(e.target.parentElement.dataset.id, 10)
  } else if (e.target.parentElement.parentElement.dataset.id) {
    return parseInt(e.target.parentElement.parentElement.dataset.id, 10)
  } else if (e.target.parentElement.parentElement.parentElement.dataset.id) {
    return parseInt(e.target.parentElement.parentElement.parentElement.dataset.id, 10)
  } else if (e.target.parentElement.parentElement.parentElement.parentElement.dataset.id) {
    return parseInt(e.target.parentElement.parentElement.parentElement.parentElement.dataset.id, 10)
  } else {
    console.log("warning: couldn't identify the right column dataset.id: ", e)
    return;
  }
}

function updateView(st, prop, value) {
  let views = st.views.slice()
  views[st.currentViewIndex][prop] = value
  return {views: views}
}

function updateColumn(st, col, prop, value) {
  let views = st.views.slice()
  views[st.currentViewIndex].columns[col][prop] = value
  return {views: views}
}

function updateColumns(st, columns) {
  let views = st.views.slice()
  views[st.currentViewIndex].columns = columns
  return {views: views}
}

function toggleColumn(st, col, prop) {
  let views = st.views.slice()
  views[st.currentViewIndex].columns[col][prop] = !views[st.currentViewIndex].columns[col][prop]
  return {views: views}
}

class AppManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentViewIndex: 0,
      views: [{ index: 0, name: "", hide: false, preCode: "", sourceCode: "", generatedQuery: "", cacheSource: false, sortSearch: "", columnSearch: "", columns: [], limit: 500, offset: 0}],
      newColumnData: {visible: false, name: "", aggregated: false, code: ""},
      generatedCodeVisible: false,
      sourceOptionsVisible: false,
      viewSearch: ""
    };

    this.viewListItemProps = {
      handleOnDragStart: this.handleOnDragStart,
      handleOnDragOver: this.handleOnDragOver,
      handleOnDragLeave: this.handleOnDragLeave,
      handleOnDrop: this.handleViewDrop,
      handleOnClick: this.handleCurrentViewIndexChange
    }

    this.sortListItemProps = {
      handleOnDragStart: this.handleOnDragStart,
      handleOnDragOver: this.handleOnDragOver,
      handleOnDragLeave: this.handleOnDragLeave,
      handleOnDrop: this.handleSortColumnDrop,
      handleOnClick: this.handleSortColumnClick
    }

    this.columnSettingsItems = [
      { inner: "edit", handleOnMenuClick: this.handleEditNewColumn },
      { inner: "remove", handleOnMenuClick: this.handleRemoveNewColumn },
      { inner: { inner: "rename", placeholder: "new column name", prop: "name", handleOnBlur: this.executeQuery, handleOnChange: this.handleColumnNameChange }, handleOnMenuClick: this.handleOnMenuClick },
      { inner: "hide column", handleOnMenuClick: this.handleColumnClick },
      { inner: "sort asc", handleOnMenuClick: this.handleSortAscClick },
      { inner: "sort desc", handleOnMenuClick: this.handleSortDescClick },
      { inner: "group", handleOnMenuClick: this.handleGroupClick },
      { inner: { inner: "aggregate", placeholder: "aggregate function", prop: "aggregate", handleOnBlur: this.executeQuery, handleOnChange: this.handleColumnAggregateChange }, handleOnMenuClick: this.handleOnMenuClick },
      { inner: { inner: "aggregate filter", placeholder: "aggregate filter function", prop: "having", handleOnBlur: this.executeQuery, handleOnChange: this.handleColumnAggregateFilterChange }, handleOnMenuClick: this.handleOnMenuClick },
    ]

    this.contentFunctions = {
      handleViewNameChange: this.handleViewNameChange,
      handleGeneratedQueryClick: this.handleGeneratedQueryClick,
      handleLimitBlur: this.executeQuery,
      handleLimitChange: this.handleLimitChange,
      handleOffsetBlur: this.executeQuery,
      handleOffsetChange: this.handleOffsetChange,
      handleCodeChange: this.handleCodeChange,
      handlePreCodeChange: this.handlePreCodeChange,
      handleSourceCodeRun: this.handleSourceCodeRun,
      handlePreCodeOnBlur: this.handlePreCodeOnBlur,
      handleCacheSourceClick: this.handleCacheSourceClick,
      handleColumnNameChange: this.handleColumnNameChange,
      handleGroupClick: this.handleGroupClick,
      handleFilterCodeChange: this.handleFilterCodeChange,
      handleFilterDone: this.executeQuery,
    }
  }

  handleOnMenuClick = e => {
    e.target.focus()
    e.stopPropagation()
  }

  handleColumnNameChange = e => {
    let value = e.target.value
    const col = getId(e)
    if (!value) {
      value = this.state.views[this.state.currentViewIndex].columns[col].origname
    }
    this.setState(st => updateColumn(st, col, "name", value))
  }

  handleColumnAggregateChange = e => {
    const value = e.target.value
    const col = getId(e)
    this.setState(st => updateColumn(st, col, "aggregate", value))
  }

  handleColumnAggregateFilterChange = e => {
    const value = e.target.value
    const col = getId(e)
    this.setState(st => updateColumn(st, col, "having", value))
  }

  handleOnDragStart = e => {
    e.dataTransfer.setData('text/plain', parseInt(e.target.dataset.id, 10))
  }
  
  handleOnDragOver = e => {
    if (e.clientY < (e.target.offsetTop + (e.target.offsetHeight / 2))) {
      e.target.classList.add("dragOverTop")
      e.target.classList.remove("dragOverBottom")
    } else {
      e.target.classList.add("dragOverBottom")
      e.target.classList.remove("dragOverTop")
    }
    e.preventDefault()
  }

  handleOnDragLeave = e => {
    e.target.classList.remove("dragOverTop")
    e.target.classList.remove("dragOverBottom")
  }

  handleViewDrop = e => {
    let draggedView = parseInt(e.dataTransfer.getData('text/plain'), 10)
    let drop = getId(e)
    e.target.classList.remove("dragOverTop")
    e.target.classList.remove("dragOverBottom")
    if (draggedView === drop) {
      return
    }
    let views = this.state.views
    let newViews = []
    let insertBefore = false
    if (e.clientY < (e.target.offsetTop + (e.target.offsetHeight / 2))) {
      insertBefore = true
    }
    for (let i = 0; i < views.length; i++) {
      if (i === drop) {
        if (insertBefore) {
          newViews.push(views[draggedView])
          newViews.push(views[i])
        } else {
          newViews.push(views[i])
          newViews.push(views[draggedView])
        }
      } else if (i !== draggedView) {
        newViews.push(views[i])
      }
    }

    this.setState(st => ({views: newViews}))
  }

  handleColumnDrop = e => {
    // TODO: make sure grouped columns can only be reordered amongst grouped columns
    let draggedCol = parseInt(e.dataTransfer.getData('text/plain'), 10)
    let drop = getId(e)
    e.target.classList.remove("dragOverTop")
    e.target.classList.remove("dragOverBottom")
    if (draggedCol === drop) {
      return
    }
    let columns = this.state.views[this.state.currentViewIndex].columns
    let newColumns = []
    let insertBefore = false
    if (e.clientY < (e.target.offsetTop + (e.target.offsetHeight / 2))) {
      insertBefore = true
    }
    for (let i = 0; i < columns.length; i++) {
      if (i === drop) {
        if (insertBefore) {
          newColumns.push(columns[draggedCol])
          newColumns.push(columns[i])
        } else {
          newColumns.push(columns[i])
          newColumns.push(columns[draggedCol])
        }
      } else if (i !== draggedCol) {
        newColumns.push(columns[i])
      }
    }

    this.setState(st => updateColumns(st, newColumns), this.executeQuery)
  }

  handleColumnClick = e => {
    const col = getId(e)
    this.setState(st => toggleColumn(st, col, "unselected"), this.executeQuery)
  }

  handleViewSearch = e => {
    const prefix = e.target.value
    let re = null
    try {
      re = new RegExp(prefix, "i")
    } catch (e) {
      this.setState(st => {
        return {viewSearch: prefix}
      })
      return;
    }
    const views = this.state.views.map(x => {
      if (!x.name.match(re)) {
        x.hide = true
      } else {
        x.hide = false
      }
      return x
    })
    this.setState(st => {
      return {views: views,
              viewSearch: prefix}
    })
  }

  handleSortSearch = e => {
    const prefix = e.target.value
    let re = null
    try {
      re = new RegExp(prefix, "i")
    } catch (e) {
      this.setState(st => updateView(st, "sortSearch", prefix))
      return;
    }
    const cols = this.state.views[this.state.currentViewIndex].columns.map(x => {
      if (x.sort) {
        if (!x.name.match(re)) {
          x.sortHide = true
        } else {
          x.sortHide = false
        }
      }
      return x
    })
    this.setState(st => {
      let newst = updateColumns(st, cols)
      newst.views[st.currentViewIndex].sortSearch = prefix
      return newst
    })
  }

  handleColumnSearch = e => {
    const prefix = e.target.value
    let re = null
    try {
      re = new RegExp(prefix, "i")
    } catch (e) {
      this.setState(st => updateView(st, "columnSearch", prefix))
      return;
    }
    const cols = this.state.views[this.state.currentViewIndex].columns.map(x => {
      if (!x.name.match(re)) {
        x.hide = true
      } else {
        x.hide = false
      }
      return x
    })
    this.setState(st => {
      let newst = updateColumns(st, cols)
      newst.views[st.currentViewIndex].columnSearch = prefix
      return newst
    })
  }

  handleLimitChange = e => {
    const limit = parseInt(e.target.value, 10)
    this.setState(st => updateView(st, "limit", limit ? limit : null))
  }

  handleOffsetChange = e => {
    const offset = parseInt(e.target.value, 10)
    this.setState(st => updateView(st, "offset", offset ? offset : null))
  }

  handleGeneratedQueryClick = e => {
    this.setState(st => ({generatedCodeVisible: !st.generatedCodeVisible}))
    e.target.parentElement.parentElement.parentElement.blur()
  }

  handleSourceOptionsClick = e => {
    this.setState(st => ({ sourceOptionsVisible: !st.sourceOptionsVisible}))
  }

  handleGroupClick = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    let groupcol = columns.splice(col, 1)[0]
    groupcol.group = !groupcol.group
    if (groupcol.group) {
      groupcol.aggregate = ""
    }
    // move column order up to front, but behind any existing grouped columns
    const idx = columns.reduce((a, b, i) => b.group ? i + 1 : a, 0)
    columns.splice(idx, 0, groupcol)
    // make sure each non-grouped column has an aggregate function
    for (let i = idx + groupcol.group; i < columns.length; i++) {
      let c = columns[i]
      if (idx === 0 && !groupcol.group) {
        c.name = c.origname
        c.aggregate = ""
      } else {
        if (!(c.aggregate || (c.compute && c.aggregated))) {
          c.aggregate = c.icon === "REAL" ? "sum" : "length"
          c.name = c.icon === "REAL" ? ("sum(" + c.name + ")") : ("length(" + c.name + ")")
        }
      }
    }
    this.setState(st => updateColumns(st, columns), this.executeQuery)
  }

  handleFilterCodeChange = e => {
    const code = e.target.value
    const col = getId(e)
    this.setState(st => updateColumn(st, col, "filter", code))
  }

  handleEnterPressed = e => {
    if (e.keyCode === 13) {
      this.handleSaveNewColumn(e);
    } else if (e.keyCode === 27) {
      this.handleCancelNewColumn(e)
    }
  }

  handleCancelNewColumn = e => {
    this.setState({
      newColumnData: { visible: false, name: "", code: "", aggregated: false, computeargs: [] }
    })
  }

  handleAddNewColumn = e => {
    this.setState({
      newColumnData: { visible: true, name: "", code: "", aggregated: false}
    }, () => document.getElementById("NewColumnNameTextInput").focus())
    e.stopPropagation()
  }

  handleEditNewColumn = e => {
    let idx = getId(e)
    const col = this.state.views[this.state.currentViewIndex].columns[idx]
    let name = col.name
    let agg = col.aggregated
    let code = col.compute
    this.setState({
      newColumnData: { col: idx, visible: true, name: name, code: code, aggregated: agg}
    })
    e.stopPropagation()
  }

  handleRemoveNewColumn = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    columns.splice(col, 1)
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    e.stopPropagation()
  }

  handleSaveNewColumn = e => {
    const name = this.state.newColumnData.name
    let code = this.state.newColumnData.code
    const aggregated = this.state.newColumnData.aggregated
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    // calculate computeargs
    const res = Utils.parse(code)
    const colnames = columns.map((x) => x.name)
    const args = res.args.map((x) => colnames.indexOf(x) + 1)
    const col = this.state.newColumnData.col
    if (col) {
      columns[col].name = name
      columns[col].aggregated = aggregated
      columns[col].computeargs = args
      columns[col].compute = res.code
    } else {
      columns.push({ name: name, T: "Any", icon: "COMPUTED", data: [], aggregated: aggregated, compute: res.code, computeargs: args })
    }
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    this.handleCancelNewColumn(e)
    e.stopPropagation()
  }

  handleCacheSourceClick = e => {
    const checked = e.target.checked
    this.setState(st => updateView(st, "cacheSource", checked))
  }

  handleNewColumnIsAggregated = e => {
    const checked = e.target.checked
    const n = this.state.newColumnData
    n.aggregated = checked
    this.setState({
      newColumnData: n
    });
  }

  handleNewColumnNameChange = e => {
    const name = e.target.value
    const n = this.state.newColumnData
    n.name = name
    this.setState({
      newColumnData: n
    });
  }

  handleNewColumnCodeChange = e => {
    const code = e.target.value
    const n = this.state.newColumnData
    n.code = code
    this.setState({
      newColumnData: n
    });
  }

  handleCurrentViewIndexChange = e => {
    this.setState({
      currentViewIndex: getId(e)
    });
  }

  handleAddNewView = e => {
    const newviewid = this.state.views.length
    const newviewname = "view_" + newviewid
    this.setState({
      currentViewIndex: newviewid,
      views: [...this.state.views,
        {
          index: newviewid,
          name: newviewname,
          hide: false,
          preCode: "",
          sourceCode: "",
          generatedQuery: "",
          cacheSource: false,
          sortSearch: "",
          columnSearch: "",
          columns: [],
          limit: 500,
          offset: 0,
        }
      ]
    });
    e.target.blur()
    e.target.parentElement.blur()
  }

  handleRemoveView = e => {
    const view = parseInt(e.target.dataset.id, 10)
    let views = this.state.views.slice()
    views.splice(view, 1)
    const idx = this.state.currentViewIndex < view ? this.state.currentViewIndex : this.state.currentViewIndex - 1
    this.setState({
      currentViewIndex: idx,
      views: views
    })
    e.stopPropagation()
  }

  handleViewNameChange = e => {
    const name = e.target.value
    this.setState(st => updateView(st, "name", name))
  }

  handlePreCodeChange = e => {
    const code = e.target.value
    this.setState(st => updateView(st, "preCode", code))
  }

  handleCodeChange = e => {
    const code = e.target.value
    this.setState(st => updateView(st, "sourceCode", code))
  }

  handleSortColumnClick = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    let c = columns[col]
    if (!c.sort) {
      c.sort = true
      c.sortasc = false
      c.sortidx = columns.filter((x) => x.sort).reduce((x) => x + 1, 0)
    } else {
      c.sortasc = !columns[col].sortasc
    }
    columns[col] = c
    this.setState(st => updateColumns(st, columns), this.executeQuery)
  }

  handleSortColumnDrop = e => {
    let draggedCol = parseInt(e.dataTransfer.getData('text/plain'), 10)
    let drop = getId(e)
    Array.from(document.getElementsByClassName("dragOverTop")).forEach(x => x.classList.remove("dragOverTop"))
    Array.from(document.getElementsByClassName("dragOverBottom")).forEach(x => x.classList.remove("dragOverBottom"))
    if (draggedCol === drop) {
      return
    }
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    let insertBefore = false
    if (e.clientY < (e.target.offsetTop + (e.target.offsetHeight / 2))) {
      insertBefore = true
    }
    let sorted = columns.map((x, i) => { return { col: (x.sort ? i : -1), sortidx: x.sortidx } })
      .sort((a, b) => Utils.cmp(a.sortidx, b.sortidx))
      .filter((x) => x.col !== -1)
    let newColumnOrder = []
    for (let i = 0; i < sorted.length; i++) {
      let val = sorted[i].col
      if (val === drop) {
        if (insertBefore) {
          newColumnOrder.push(draggedCol)
          newColumnOrder.push(val)
        } else {
          newColumnOrder.push(val)
          newColumnOrder.push(draggedCol)
        }
      } else if (val !== draggedCol) {
        newColumnOrder.push(val)
      }
    }
    newColumnOrder.forEach((x, i) => {
      columns[x].sortidx = i
    })
    this.setState(st => updateColumns(st, columns), this.executeQuery)
  }

  handleSortAscClick = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    columns[col].sort = true
    columns[col].sortasc = true
    if (!(columns[col].sortidx >= 0)) {
      columns[col].sortidx = columns.filter((x) => x.sort).reduce((x) => x + 1, 0)
    }
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    e.target.parentElement.parentElement.parentElement.blur()
  }

  handleSortDescClick = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    columns[col].sort = true
    columns[col].sortasc = false
    if (!(columns[col].sortidx >= 0)) {
      columns[col].sortidx = columns.filter((x) => x.sort).reduce((x) => x + 1, 0)
    }
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    e.target.parentElement.parentElement.parentElement.blur()
  }

  handleSortMenuClick = e => {
    let col = getId(e)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    columns[col].sort = true
    columns[col].sortasc = !columns[col].sortasc
    columns[col].sortidx = columns.filter((x) => x.sort).reduce((x) => x + 1, 0)
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    e.target.parentElement.parentElement.parentElement.blur()
  }

  handleSortColumnRemove = e => {
    const col = parseInt(e.target.dataset.id, 10)
    let views = this.state.views.slice()
    let columns = views[this.state.currentViewIndex].columns
    columns[col].sort = false
    this.setState(st => updateColumns(st, columns), this.executeQuery)
    e.stopPropagation()
  }

  handlePreCodeOnBlur = e => {
    const code = e.target.value
    // make http request
    if (code) {
      let httpRequest = new XMLHttpRequest();
      // const that = this
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            document.getElementById("spinner").classList.add("hidden")
          }
        }
      }
      httpRequest.open('POST', 'http://' + HOST + ":" + PORT + "/presource", true);
      httpRequest.send(JSON.stringify(this.state.views[this.state.currentViewIndex]));
      document.getElementById("spinner").classList.remove("hidden")
    }
  }

  // initial request to get source columns
  handleSourceCodeRun = e => {
    const code = this.state.views[this.state.currentViewIndex].sourceCode
    // make http request
    if (code) {
      let httpRequest = new XMLHttpRequest();
      const that = this
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            const result = JSON.parse(httpRequest.responseText)
            let views = that.state.views.slice()
            views[that.state.currentViewIndex] = result
            that.setState({
              views: views
            })
            document.getElementById("spinner").classList.add("hidden")
          }
        }
      }
      httpRequest.open('POST', 'http://' + HOST + ":" + PORT + "/source", true);
      httpRequest.send(JSON.stringify(this.state.views[this.state.currentViewIndex]));
      document.getElementById("spinner").classList.remove("hidden")
    }
  }

  executeQuery = () => {
    // send current view to backend
    let httpRequest = new XMLHttpRequest();
    const that = this
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          const result = JSON.parse(httpRequest.responseText)
          let views = that.state.views.slice()
          views[that.state.currentViewIndex] = result
          that.setState({
            views: views
          })
          document.getElementById("spinner").classList.add("hidden")
        }
      }
    }
    httpRequest.open('POST', 'http://' + HOST + ":" + PORT + "/query", true);
    httpRequest.send(JSON.stringify(this.state.views[this.state.currentViewIndex]));
    document.getElementById("spinner").classList.remove("hidden")
  }

  componentDidMount() {
    let httpRequest = new XMLHttpRequest();
    const that = this
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          const result = JSON.parse(httpRequest.responseText)
          that.setState({
            views: result
          })
          document.getElementById("spinner").classList.add("hidden")
        }
      }
    }
    httpRequest.open('GET', 'http://' + HOST + ":" + PORT + "/initialize", true);
    httpRequest.send();
    document.getElementById("spinner").classList.remove("hidden")
  }

  render() {
    return (
      <div className="AppManager flexrow">
        <div className="Nav flexcol">
          <NavSection id="viewList" title="Views" searchProps={{ value: this.state.viewSearch, handleOnChange: this.handleViewSearch }}
            listItems={this.state.views.map((x, i) => {
              return {id: i, inner: <div className={"ViewListItem listitem flexrow" + (x.hide ? " hidden" : " visible") + (i === this.state.currentViewIndex ? " selected" : " unselected")}>
                <ListItemText text={x.name} />
                <img className="CloseIcon hidden" data-id={i} src={closeicon} onClick={this.handleRemoveView} />
              </div>}
            })}
            listItemProps={this.viewListItemProps}
            buttonProps={{ text: "Add New View", handleOnClick: this.handleAddNewView} }
          />
          <div className="NavDivider bottompad"></div>
          <NavSection id="sortList" title="Sorting" searchProps={{ value: this.state.views[this.state.currentViewIndex].sortSearch, handleOnChange: this.handleSortSearch }} 
              listItems={this.state.views[this.state.currentViewIndex].columns.map((x, i) => ({ column: x, i: i })
                ).filter(x => x.column.sort).sort((a, b) => Utils.cmp(a.column.sortidx, b.column.sortidx)).map((x, i) => {
                  return {id: x.i, inner: <div className={"SortListItem selected listitem flexrow" + (x.column.sortHide ? " hidden" : " visible")} key={i} >
                          <img className="SortIcon" src={x.column.sortasc ? sortasc : sortdesc} />
                          <ListItemText text={x.column.name} />
                          <img className="CloseIcon hidden" data-id={x.i} src={closeicon} onClick={this.handleSortColumnRemove} />
                        </div>}
              })}
              listItemProps={this.sortListItemProps}
              buttonProps={{ text: "Add New Sort", handleOnClick: this.handleOnMenuClick}}
              menuProps={{ handleOnMenuClick: this.handleOnMenuClick, menuItems: this.state.views[this.state.currentViewIndex].columns.map((x, i) => {
                if (x.sort) {
                  return null;
                } else {
                  return <Button id={i} text={x.name} handleOnClick={this.handleSortMenuClick}/>
                }
              })}}
          />
          <div className="NavDivider bottompad"></div>
          <NavSection id="columnList" title="Columns" searchProps={{ value: this.state.views[this.state.currentViewIndex].columnSearch, handleOnChange: this.handleColumnSearch}}
            listItems={this.state.views[this.state.currentViewIndex].columns.map((x, i) => { return {id: i, inner: <Header key={i} id={i} list={true} {...x} handleOnMenuClick={this.handleOnMenuClick} />}})}
            listItemProps={{ handleOnDragStart: this.handleOnDragStart, handleOnDragOver: this.handleOnDragOver, handleOnDragLeave: this.handleOnDragLeave, handleOnDrop: this.handleColumnDrop, handleOnClick: this.handleColumnClick}}
            buttonProps={{ text: "Add New Column", handleOnClick: this.handleAddNewColumn}}
          />
        </div>
        <Content
          view={this.state.views[this.state.currentViewIndex]}
          funcs={this.contentFunctions}
          sourceOptionsVisible={this.state.sourceOptionsVisible}
          handleSourceOptionsClick={this.handleSourceOptionsClick}
          menuItems={this.state.views[this.state.currentViewIndex].columns.map((x, i) => {return this.columnSettingsItems.map((y, j) => {            
            if (typeof y.inner === "string") {
              if (!x.compute && (y.inner === "edit" || y.inner === "remove")) {
                return null
              } else {
                return <Menu inner={y.inner === "group" ? (x.group ? "ungroup" : "group") : y.inner === "hide column" ? (x.unselected ? "show column" : "hide column") : y.inner} handleOnMenuClick={y.handleOnMenuClick} />
              }
            } else {
              return <Menu inner={y.inner.inner} menuItems={[<CodeBoxInput id={i} placeholder={y.inner.placeholder} value={x[y.inner.prop]} handleOnBlur={y.inner.handleOnBlur} handleOnChange={y.inner.handleOnChange} />]} handleOnMenuClick={y.handleOnMenuClick} />
            }
          })})}
        />
        <NewColumn 
          visible={this.state.newColumnData.visible}
          name={this.state.newColumnData.name}
          handleEnterPressed={this.handleEnterPressed}
          handleNewColumnNameChange={this.handleNewColumnNameChange}
          aggregated={this.state.newColumnData.aggregated}
          handleNewColumnIsAggregated={this.handleNewColumnIsAggregated}
          code={this.state.newColumnData.code}
          handleNewColumnCodeChange={this.handleNewColumnCodeChange}
          handleCancelNewColumn={this.handleCancelNewColumn}
          handleSaveNewColumn={this.handleSaveNewColumn}
        />
        <GeneratedQuery
          visible={this.state.generatedCodeVisible}
          generatedQuery={this.state.views[this.state.currentViewIndex].generatedQuery}
          handleGeneratedQueryClick={this.handleGeneratedQueryClick}
        />
        <Spinner />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="Toolbar">
          <Menu inner={<div className="Question">?</div>} menuItems={
            [<div className="HelpMenu">
              <h3>Views</h3>
              <p>Each "view" corresponds to a DataStreams.jl Data.Source and allows generating a query for that source. Additional views can be created by clicking the "Add New View" button/text. You can search your list of views, re-arrange the order, remove, and switch to/from views through the list of views in the top left.</p>
              <h3>Data.Source</h3>
              <p>Right beneath the "Data.Source" text is a text input box for putting code corresponding to a valid DataStreams.jl Data.Source. Once you've put your code in, click "RUN" to execute the code and populate the initial data table view. There are a few configuration options for your source including:
                <ul>
                  <li>Initialization code: code like `using CSV` that will be executed by the julia engine, but not expected to return any results. This code is executed when the text input box "loses focus" (i.e. you click out of it).</li>
                  <li>Cache source: whether the Data.Source code should be cached, can be helpful for sources where fetching data may be expensive</li>
                  <li>Limit/Offset: used to limit the total # of rows and at what offset into the dataset rows will be returned</li>
                </ul>
              <p>*Note that if you need to "reset" your source at any time, you can click "RUN" again; do note, however, that this will remove any query actions that have been taken, as well as erase any "computed" columns.</p>
              </p>
              <h3>Columns</h3>
              <h4>Column List</h4>
              <p>Located in the bottom left side of the page; this column list holds a searchable, re-arrangeable, clickable, and scrollable list of columns in the Data.Source. Searching can use plain text or a regex and will only temporarily limit the view of matching columns. Clicking a column will toggle a column's visibility. Dragging a column will re-order it within the resulting query.</p>
              <h4>Add New Column</h4>
              <p>Clicking "Add New Column" will open a modal where a a new, "computed" column can be specified. A new column name must be given, as well as if the new column should be of an "aggregated" form. Aggregtated computed columns don't receive individual scalar row values as input, they recieve a Vector of values that correspond all the values for a specific grouping combination. As such, they should have the form `f(x::Vector) => scalar`, i.e. take a Vector as input and return a single, scalar value. </p>
              <p>For specifying the calculation function, it should take the form "(a, b, `col with space`, ...) -> ...", where a, b, `col with space`, etc. correspond _exactly_ to existing column names in your dataset. This is how the query engine determines which columns should be used in calculating the resulting new column. Note that for column names that are not valid julia symbol identifiers, backticks (``) can be used around the column name.</p>
              <h4>Sort List</h4>
              <p>Clicking "Add New Sort" shows a list of columns that can be added by which the dataset view will be sorted. Multiple columns can be added, re-ordered, and clicking on a sort column will reverse its sort direction. </p>
              <h4>Column Settings</h4>
              <p>Hovering over a column in the main dataset view reveals several ways to specify a "query action" on your dataset, including:
                <ul>
                  <li>Grouping: the first icon of vertical dots can be clicked to specify that the column should be apart of the query "grouping". Once grouped, the dots icon will be horizontal and highlighted and can be clicked again to ungroup the column</li>
                  <li>Info: view useful information about a column</li>
                  <li>Filter: clicking this icon will reveal a code input box where a "filter function" can be input to filter a column's values. The function should be of the form `f(x) => Bool`, i.e. takes a single column value as input and returns `true` if the value should be included in the resultset</li>
                  <li>Settings:
                    <ul>
                      <li>Rename: give a new name to a column; removing a new name will restore the original column name</li>
                      <li>Hide: hide a column from the resultset</li>
                      <li>Sort asc: sort the resultset by this column in an ascending direction</li>
                      <li>Sort desc: sort the resultset by this column in a descending direction</li>
                      <li>Group: group the resultset by this column</li>
                      <li>Aggregate: specify a custom aggregation function for this column; this will determine how the column's grouped values are "reduced" in the resultset</li>
                      <li>Aggregate Filter: apply a scalar filter function on the aggregated results, removing aggregated results for which the function returns false.</li>
                    </ul>
                  </li>
                </ul>
              </p>
            </div>]
          } />
        </div>
        <AppManager/>
      </div>
    );
  }
}

export default App;
