import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';

class Contacts extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      modules: [InfiniteRowModelModule],
      columnDefs: [{
                 headerName: "Name", field: "name", filter: true, filterParams: {
                  filterOptions: ['equals', 'contains', 'Not equal'],
                  suppressAndOrCondition: true,
                },
                 
                 }, {
                 headerName: "Details", field: "details" , width:800, sortable: true, filter:true
               },{
                headerName: "Failures", field: "failures" , sortable: true, filter:true
              },{
                headerName: "Success", field: "success" , sortable: true, filter:true
              },
                {
                 headerName: "Image", field: "links.patch.small" ,
                   cellRenderer: (params) => {
                       return `<img width='50' height='50' src='${params.value}'/>`;
                     },
             }],
      defaultColDef: {
        flex: 1,
        resizable: true,
        minWidth: 100
      },

      rowBuffer: 0,
      rowSelection: 'multiple',
      rowModelType: 'infinite',
      paginationPageSize: 10,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 1,
      infiniteInitialRowCount: 10,
      maxBlocksInCache: 10,
    };
  }
  
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
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
            var rowsThisPage = data.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (data.length <= params.endRow) {
              lastRow = data.length;
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
            components={this.state.components}
            rowBuffer={this.state.rowBuffer}
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
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

 

//2nd


// const Contacts = ({ contacts }) => {
 
//   columnDefs: [{
//     headerName: "Make", field: "make"
//   }, {
//     headerName: "Model", field: "model"
//   }, {
//     headerName: "Price", field: "price"
//   }];
//   rowData: [{
//     make: "Toyota", model: "Celica", price: 35000
//   }, {
//     make: "Ford", model: "Mondeo", price: 32000
//   }, {
//     make: "Porsche", model: "Boxter", price: 72000
//   }]
//   return (
//     <div>

//       <center><h1>SpaceX Missions</h1></center>
    
      
		
		
// 		 {contacts.map((contact) => (
//        <div
//        className="ag-theme-material"
//        style={{
//        height: '250px',
//        width: '600px' }}
//      >
//        <AgGridReact
//          columnDefs={columnDefs}
//          rowData={rowData}>
//        </AgGridReact>
//      </div>
      
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
};
function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (filterModel.age) {
      var age = item.age;
      var allowedAge = parseInt(filterModel.age.filter);
      if (filterModel.age.type == 'equals') {
        if (age !== allowedAge) {
          continue;
        }
      } else if (filterModel.age.type == 'lessThan') {
        if (age >= allowedAge) {
          continue;
        }
      } else {
        if (age <= allowedAge) {
          continue;
        }
      }
    }
    if (filterModel.year) {
      if (filterModel.year.values.indexOf(item.year.toString()) < 0) {
        continue;
      }
    }
    if (filterModel.country) {
      if (filterModel.country.values.indexOf(item.country) < 0) {
        continue;
      }
    }
    resultOfFilter.push(item);
  }
  return resultOfFilter;
}
  export default Contacts

