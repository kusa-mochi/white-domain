<template>
  <div id="app">
    <h2>Your white domain list</h2>
    <div class="input-area">
      <input type="text" v-model="addItemText" />
      <button v-on:click="addItem()" v-bind:disabled="isAddButtonDisabled">Add</button>
    </div>
    <table>
      <tbody>
        <domain-list-row
          v-for="item in domainListData"
          v-bind:key="item.id"
          v-bind:list-item="item"
          v-on:delete="deleteItem($event)"
        ></domain-list-row>
      </tbody>
    </table>
  </div>
</template>

<script>
import DomainListRow from "./components/DomainListRow.vue";

export default {
  name: "app",
  data() {
    return {
      domainListData: [],
      addItemText: ""
    };
  },
  methods: {
    addItem() {
      console.log("begin addItem()");
      const numListData = this.domainListData.length;
      this.domainListData.push({
        id: numListData + 1,
        domain: this.addItemText
      });

      this.saveData(this.domainListData);
    },
    deleteItem(id) {
      console.log("begin deleteItem()");
      this.domainListData.some((v, i) => {
        if (id === v.id) this.domainListData.splice(i, 1);
      });

      this.saveData(this.domainListData);
    },
    serialize(data) {
      let dataToSave = "";

      for (let iDomain = 0; iDomain < data.length; iDomain++) {
        dataToSave += data[iDomain].domain;
        if (iDomain < data.length - 1) {
          dataToSave += ",";
        }
        console.log(
          "saveData(data): data[" +
            iDomain +
            "].domain: " +
            data[iDomain].domain
        );
      }

      return dataToSave;
    },
    saveData(data) {
      console.log("begin saveData()");
      if (data === undefined || data === null) {
        console.log("saveData(data): data is undefined or null.");
        return;
      }
      if (data.length === 0) {
        console.log("saveData(data): there is no data.");
        return;
      }

      let dataToSave = this.serialize(data);
      console.log("dataToSave: " + dataToSave);

      chrome.storage.sync.set({ domains: dataToSave }, function() {});
    },
    deserialize(list) {
      let output = [];
      const tmpList = list.split(",");
      for (let i = 0; i < tmpList.length; i++) {
        output.push({
          id: i,
          domain: tmpList[i]
        });
      }
      return output;
    },
    loadData() {
      console.log("begin loadData()");
      chrome.storage.sync.get("domains", result => {
        console.log("storage get: " + result.domains);
        if (result.domains === undefined || result.domains === null) {
          this.domainListData = [];
        } else {
          this.domainListData = this.deserialize(result.domains);
        }
      });
    }
  },
  computed: {
    isAddButtonDisabled() {
      if (this.addItemText === "") return true;
      return false;
    }
  },
  mounted() {
    this.loadData();
  },
  components: {
    DomainListRow
  }
};
</script>

<style>
</style>
