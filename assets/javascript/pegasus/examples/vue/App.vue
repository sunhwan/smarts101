<template>
  <no-data v-if="employees.length === 0 && !editMode"
           v-on:add-employee="editMode = true" >
  </no-data>
  <employee-list v-else-if="!editMode"
                 v-bind:employees="employees"
                 v-bind:client="client"
                 v-on:add-employee="editMode = true"
                 v-on:edit-employee="editEmployee"
                 v-on:delete-employee="deleteEmployee" >
  </employee-list >
  <employee-edit-form v-else
                      v-bind:employee="currentEmployee"
                      v-bind:client="client"
                      v-bind:department-options="departmentChoices"
                      v-on:cancel-edit="editMode = false"
                      v-on:save-edit="saveEmployee"
  >
  </employee-edit-form>
</template>

<script>
import EmployeeTableRow from './components/EmployeeTableRow.vue';
import EmployeeList from "./components/EmployeeList.vue";
import EmployeeEditForm from './components/EmployeeEditForm.vue';
import NoData from './components/NoData.vue';
import {getPegasusApiClient} from "../../pegasus";

const client = getPegasusApiClient(SERVER_URL_BASE);

export default {
  name: 'App',
  components: {
    EmployeeList,
    NoData,
    EmployeeTableRow,
    EmployeeEditForm,
  },
  created() {
    client.employeesList().then((result) => {
      this.employees = result.results;
    });
  },
  data() {
    return {
      departmentChoices: EMPLOYEE_DEPARTMENT_CHOICES,
      client: client,
      currentEmployee: null,
      employees: [],
      editMode: false,
    }
  },
  methods: {
    addEmployee: function () {
      this.editMode = true;
    },
    deleteEmployee: function (employee) {
      this.client.employeesDestroy({id: employee.id}).then((result) => {
        // and remove from list
        for (let i = 0; i < this.employees.length; i++) {
          if (this.employees[i].id === employee.id) {
            this.employees.splice(i, 1);
            break;
          }
        }
      });
    },
    editEmployee: function (employee) {
      this.currentEmployee = employee;
      this.editMode = true;
    },
    saveEmployee: function (employeeData) {
      let employee = {
        name: employeeData.name,
        department: employeeData.department,
        salary: employeeData.salary,
      };
      if (employeeData.id) {
        // existing employee - use an update method with the id set
        let params = {
          id: employeeData.id,
          patchedEmployee: employee,
        };
        client.employeesPartialUpdate(params).then((result) => {
          // find the appropriate item in the list and update in place
          for (let i = 0; i < this.employees.length; i++) {
            if (this.employees[i].id === result.id) {
              this.employees[i] = result;
            }
          }
        }).catch((error) => {
          console.log("Error: ", error);
        });
      } else {
        client.employeesCreate({'employee': employee}).then((result) => {
          this.employees.push(result);
        });
      }
      // back to list view
      this.editMode = false;
      this.currentEmployee = null;
    }
  }
}
</script>
