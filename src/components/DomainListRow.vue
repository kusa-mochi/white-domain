<template>
  <tr>
    <td>{{listItem.domain}}</td>
    <td>
      <button v-on:click="deleteItem(listItem.id)">Remove</button>
    </td>
  </tr>
</template>

<script>
module.exports = {
  name: "domain-list-row",
  props: ["listItem"],
  methods: {
    // コンポーネント内で使える関数をまとめるプロパティ。
    deleteItem(id) {
      this.$emit("delete", id);
    }
  }
};
</script>

<style scoped>
/* You can write Sass styles here. */
</style>