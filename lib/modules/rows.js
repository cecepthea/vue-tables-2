module.exports = function(h) {
  
  return (classes) => {

    var data = this.source=='client'?this.filteredData:this.tableData;

    if (this.count===0) {
      
      let colspan = this.allColumns.length;
      if (this.hasChildRow) colspan++;
      
      return <tr class="VueTables__no-results">
      <td class="text-center"
      colspan={this.colspan}>
      {this.display(this.loading?'loading':'noResults')}
      </td>
      </tr>
    } 
    
    var rows = [];
    var columns;
    var rowKey = this.opts.uniqueKey;
    
    var rowClass;
    var recordCount = (this.Page-1) * this.limit;
    var currentGroup;

    data.map((row, index) => {
      
      
      if (this.opts.groupBy && this.source==='client' && row[this.opts.groupBy]!==currentGroup) {
          rows.push(<tr class={classes.groupTr} on-click={this._toggleGroupDirection.bind(this)}><td colspan={this.colspan}>{row[this.opts.groupBy]}</td></tr>);
          currentGroup = row[this.opts.groupBy];
      }

      index = recordCount + index + 1;
      
      columns = [];
      
      if (this.hasChildRow) {
        var childRowToggler = <td><span on-click={this.toggleChildRow.bind(this,row[rowKey])} class={`VueTables__child-row-toggler ` + this.childRowTogglerClass(row[rowKey])}></span></td>;
        if (this.opts.childRowTogglerFirst) columns.push(childRowToggler);
      }
      
      
      this.allColumns.map(column => {
        let rowTemplate = this.$scopedSlots && this.$scopedSlots[column];
        
        columns.push(<td class={this.columnClass(column)}>
        {rowTemplate ? rowTemplate({ row, column, index }) : this.render(row, column, index, h)}
        </td>)
      });
      
      if (this.hasChildRow && !this.opts.childRowTogglerFirst) columns.push(childRowToggler);
      
      rowClass = this.opts.rowClassCallback?this.opts.rowClassCallback(row):'';
      
      rows.push(<tr class={rowClass} on-click={this.rowWasClicked.bind(this, row)} on-dblclick={this.rowWasClicked.bind(this, row)}>{columns} </tr>);
      
      rows.push(this.hasChildRow && this.openChildRows.includes(row[rowKey])?
      <tr class='VueTables__child-row'><td colspan={this.colspan}>{this._getChildRowTemplate(h, row)}</td></tr>:h());
      
    });
    
    return rows;
    
  }
  
}
