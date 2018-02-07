# Vue Table
A simple vue component to render dynamic tables with sortable headers.

## Initialize
Vue table is built as a vue plugin. It can be initialized just as the Vue documentation states.

```javascript
import VueTable from '@pderas/vue2-table';

Vue.use(VueTable);
```

## Usage
There are a few steps required before a vue table can be initialized.

### 1. Headers
Headers need to be defined before a table can be created. There are multiple options available for a header including it's label and if its sortable or not. A headers array that can be passed to vue table could look like this.

```javascript
[{
    label: 'Status',
    sortBy: 'status'
    },
    {
        label: 'Client Name',
        sortBy: 'client_name'
    },
    {
        label: 'Service Date',
        sortBy: 'service_date'
    },
    {
        label: '',
        sortBy: '',
        disabled: true
}]
```
*Note: Notice the last header not having any labels. This column would be used for buttons on the row which is why the sorting is disabled.

#### Header Options

| Option   | Description                                                   | Required                                |
|----------|---------------------------------------------------------------|-----------------------------------------|
| disabled | Boolean that defines if a header can be clicked or not        | No                                      |
| label    | The title of the header                                       | Yes                                     |
| sortBy   | The column name for the backend data                          | Yes                                     |
| width    | A defined width for the header in px.                         | No                                      |

### 2. Table
A vue table passes the information recieved from the url back into the view component so that it can be used in the row. A sample vue table could look like this.
```javascript
<vue-table url="/clients/search" :headers="headers" :methods="methods">
    <template slot="row" slot-scope="{ row }">
        <tr>
            <td>{{ row.status }}</td>
            <td @click="row.methods.goTo('/clients')">
                {{ row.name }}
            </td>
            <td>{{ row.service_date }}</td>
            <td>Status</td>
        </tr>
    </template>
</vue-table>
```

If you want to run any functions with a row action you can pass them into the vue table using the methods prop. All methods are then accessible in the row using the `row.methods` object.

*Note: It is very important to define the scope of the template so that the data can be passed from the parent component into the children being defined for the rows.

#### Table Options
| Option      | Description                                                          | Required |
|-------------|----------------------------------------------------------------------|----------|
| data        | An array to define the table data if a url is not provided.          | No       |
| hasSearch   | Display the search bar.                                              | No       |
| headers     | An array to populate the table headers                               | Yes      |
| methods     | An object containing any functions to run within a row of the table. | No       |
| paginate    | The number of items to paginate the table to.                        | No       |
| selectedCol | The column to default the sorting to.                                | No       |
| url         | The url to retrieve data from.                                       | No       |
| vuexSet     | The name of the commit function to run for vuex integration.         | No       |
| vuexGet     | The name of the getter function to run for vuex integration.         | No       |

#### Search Bar Options
There are options to change the functionality of the search bar. These can be changed through the global options given when the plugin is activated.

```javascript
import VueTable from '@pderas/vue2-table';

Vue.use(VueTable, {
    expandible: false,
    iconClasses: fa fa-search
});
```

| Option       | Description                                                          | Options  |
|--------------|----------------------------------------------------------------------|----------|
| expandible   | Determines if the search expands on focus.                           | true/false       |
| iconClasses  | The classes to generate the icon for the search bar                  | String   |
| iconSide     | Determines what side the icon shows on.                              | left/right       |
| searchWhen   | Determines when a search is run                                      | onDelay/onEnter      |
| timeoutDelay | How long to wait before running a new search. (Only applies when searchWhen set to 'onDelay') | Number       |

## Ajax Parameters
If a url is provided an ajax call is triggered every time a column is sorted or a search is run. The following parameters will be sent to the url provided.

| Parameter   | Description                                                  |
|-------------|--------------------------------------------------------------|
| order       | The order to sort the data by. Either 'asc' or 'desc'.       |
| paginate    | The amount of rows to paginate by.                           |
| selectedCol | The sortBy value of the current column selected for sorting. |
| term        | The current search term.                                     |

## License
This project is covered under the MIT License. Feel free to use it wherever you like.