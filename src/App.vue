<template>
  <div id="app">
    <h2>Your white domain list</h2>
    <div class="input-area">
      <input type="text" />
      <button>Add</button>
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
      ]
    };
  },
  methods: {
    // クリック時などに実行する関数をまとめるプロパティ。
    deleteItem(id) {
      this.domainListData.some((v, i) => {
        if (id === v.id) this.domainListData.splice(i, 1);
      });
    }
  },
  components: {
    DomainListRow
  }
};
</script>

<style>
</style>
