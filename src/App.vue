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
      domainListData: [
        {
          id: 1,
          domain: "google.com"
        },
        {
          id: 2,
          domain: "slash-mochi.net"
        },
        {
          id: 3,
          domain: "github.com"
        }
      ],
      addItemText: ""
    };
  },
  methods: {
    addItem() {
      const numListData = this.domainListData.length;
      this.domainListData.push({
        id: numListData + 1,
        domain: this.addItemText
      });
    },
    deleteItem(id) {
      this.domainListData.some((v, i) => {
        if (id === v.id) this.domainListData.splice(i, 1);
      });
    },
    saveData() {
      chrome.storage.sync.set({ key: value }, function() {
        console.log("Value is set to " + value);
      });
    },
    loadData() {
      chrome.storage.sync.get(["key"], function(result) {
        console.log("Value currently is " + result.key);
      });
    }
  },
  computed: {
    isAddButtonDisabled() {
      if (this.addItemText === "") return true;
      return false;
    }
  },
  components: {
    DomainListRow
  }
};
</script>

<style>
</style>
