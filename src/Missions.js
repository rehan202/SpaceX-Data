import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';

class Missions extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      modules: [
        InfiniteRowModelModule,
        SetFilterModule,
        MenuModule,
        ColumnsToolPanelModule,
      ],
      columnDefs: [
        {
          headerName: "Name", field: "name", sorting: true, filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['Contains'],
            suppressAndOrCondition: true,
          },
         
          
          }, {
          headerName: "Details", field: "details" , width:800
        },{
         headerName: "Failures", field: "failures" 
       },{
         headerName: "Success", field: "success" ,filter: 'agTextColumnFilter',
         filterParams: {
          filterOptions: ['equals'],
           suppressAndOrCondition: true,
         },
       },
         {
          headerName: "Image", field: "links.patch.small" ,
            cellRenderer: (params) => {
                return `<img width='50' height='50' src='${params.value}'/>`;
              },
      },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
        floatingFilter: true,
      },
     
      rowSelection: 'multiple',
      rowModelType: 'infinite',
      paginationPageSize: 100,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 2,
      infiniteInitialRowCount: 1,
      maxBlocksInCache: 2,
      getRowNodeId: function(item) {
        return item.id;
      },
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      data.forEach(function(data, index) {
        data.id = 'R' + (index + 1);
      });
      var dataSource = {
        rowCount: null,
        getRows: function(params) {
          console.log('asking for ' + params.startRow + ' to ' + params.endRow);
          setTimeout(function() {
            var dataAfterSortingAndFiltering = sortAndFilter(
              data,
              params.sortModel,
              params.filterModel
            );
            var rowsThisPage = dataAfterSortingAndFiltering.slice(
              params.startRow,
              params.endRow
            );
            var lastRow = -1;
            if (dataAfterSortingAndFiltering.length <= params.endRow) {
              lastRow = dataAfterSortingAndFiltering.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 500);
        },
      };
      params.api.setDatasource(dataSource);
    };

    httpRequest.open(
      'GET',
      'https://api.spacexdata.com/v4/launches'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  render() {
    return (
      <div>
           <center><h1>SpaceX Missions</h1></center>
        <div
          id="myGrid"
          style={{
            height: '600px',
            width: '1350px',
          }}
          className="ag-theme-material"
        >
          <AgGridReact
            modules={this.state.modules}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowSelection={this.state.rowSelection}
            rowDeselection={true}
            rowModelType={this.state.rowModelType}
            paginationPageSize={this.state.paginationPageSize}
            cacheOverflowSize={this.state.cacheOverflowSize}
            maxConcurrentDatasourceRequests={
              this.state.maxConcurrentDatasourceRequests
            }
            infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            maxBlocksInCache={this.state.maxBlocksInCache}
            getRowNodeId={this.state.getRowNodeId}
            components={this.state.components}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}


function sortAndFilter(allOfTheData, sortModel, filterModel) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}
function sortData(sortModel, data) {
  var sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  var resultOfSort = data.slice();
  resultOfSort.sort(function(a, b) {
    for (var k = 0; k < sortModel.length; k++) {
      var sortColModel = sortModel[k];
      var valueA = a[sortColModel.colId];
      var valueB = b[sortColModel.colId];
      if (valueA == valueB) {
        continue;
      }
      var sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    return 0;
  });
  return resultOfSort;
}
function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (filterModel.name) {
      var name = item.name;
      console.log(name);
      

      var allowedAge = filterModel.name;
      console.log(filterModel.name.type);
    
     if(filterModel.name.type === 'Contains')
    {
      if (name.toLowerCase().indexOf(allowedAge.filter.toLowerCase()) >= 0) {
        resultOfFilter.push(item);
    console.log("Contains");
              continue;
    }
  }
}
if(filterModel.success)
{
var success = item.success;
var allowedAge = filterModel.success.filter;
  if (filterModel.success.filter ==='true' && success === true) 
  {
  
    resultOfFilter.push(item);
    continue;
  }
    
     if (filterModel.success.filter === 'false' && success === false)
  {
      
    resultOfFilter.push(item);
    console.log("false");
    continue;
  }
}
}
return resultOfFilter;

}
 export default Missions

